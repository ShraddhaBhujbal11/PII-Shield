import React, { useState } from 'react';
import axios from 'axios';

const FileScrubber = () => {
    const [file, setFile] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState("");

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await axios.post('http://localhost:3000/api/upload', formData);

            // Create a downloadable blob for the scrubbed text
            const blob = new Blob([data.scrubbedContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (err) {
            alert("File processing failed.");
        }
    };

    return (
        <div className="input-card" style={{ marginTop: '20px' }}>
            <h3>📂 Batch File Scrubber</h3>
            <input type="file" onChange={handleFileChange} accept=".txt" />
            <button className="process-btn" onClick={handleUpload} disabled={!file}>
                Upload & Redact File
            </button>

            {downloadUrl && (
                <div style={{ marginTop: '15px' }}>
                    <a href={downloadUrl} download="scrubbed_document.txt" className="copy-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        📥 Download Clean File
                    </a>
                </div>
            )}
        </div>
    );
};

export default FileScrubber;