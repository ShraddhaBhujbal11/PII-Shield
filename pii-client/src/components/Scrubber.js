import React, { useState } from 'react';
import axios from 'axios';

const Scrubber = ({ onResult, setLoading }) => {
    const [text, setText] = useState("");

    // Inside Scrubber.js, ensure your handleProcess looks like this:
    const handleProcess = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:3000/api/chat', { message: text });

            // Safety: If dataReceived is somehow an object, grab the string
            const finalString = typeof data.dataReceived === 'object'
                ? data.dataReceived.scrubbedText
                : data.dataReceived;

            onResult(finalString);
        } catch (err) {
            alert("Backend unreachable. Ensure Node.js is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="input-card">
            <textarea
                className="main-input"
                placeholder="Paste sensitive logs or messages here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="process-btn" onClick={handleProcess}>
                Scan & Redact
            </button>
        </div>
    );
};

export default Scrubber;