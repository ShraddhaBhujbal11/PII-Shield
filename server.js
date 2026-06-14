import express from 'express';
import { scrubText } from './scrubber.js';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors());

// 2. Define the Audit Schema so the /api/logs route works
const auditSchema = new mongoose.Schema({
    original: String,
    scrubbed: String,
    timestamp: { type: Date, default: Date.now }
});
const AuditLog = mongoose.model('AuditLog', auditSchema);

const piishield = async (req, res, next) => {
    try {
        if (req.body && req.body.message) {
            console.log("Original :- ", req.body.message);

            // scrubText now returns { scrubbedText, piiMap }
            const result = await scrubText(req.body.message);

            // Save to DB
            await AuditLog.create({
                original: req.body.message,
                scrubbed: result.scrubbedText
            });

            // IMPORTANT: Pass only the scrubbed string back to the request
            req.body.message = result.scrubbedText;

            console.log("Safe Message :- ", result.scrubbedText);
        }
        next();
    } catch (err) {
        next(err);
    }
};
const upload = multer({ dest: 'uploads/' }); //temporary storage for files 

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No file uploaded.");

        // 1. Read the uploaded file
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // 2. Use your existing AI scrubber
        const result = await scrubText(fileContent);

        // 3. Clean up (delete) the temporary file
        fs.unlinkSync(filePath);

        // 4. Return the scrubbed content
        res.json({
            fileName: req.file.originalname,
            scrubbedContent: result.scrubbedText
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Processing failed.");
    }
});
app.post('/api/chat', piishield, (req, res) => {
    res.json({
        status: "Success",
        dataReceived: req.body.message // This is now a clean string
    });
});

app.get('/api/logs', async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(10);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

// Connect to Mongo (Ensure your local MongoDB is running!)
mongoose.connect('mongodb://127.0.0.1:27017/piishield')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Mongo Error:", err));

app.listen(3000, () => console.log("Shield Active on http://localhost:3000"));