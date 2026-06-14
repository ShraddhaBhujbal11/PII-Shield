import React from 'react';

const ResultCard = ({ result }) => {
    if (!result) return null;
    return (
        <div className="result-container">
            <div className="result-badge">SECURE OUTPUT</div>
            <pre className="result-text">{result}</pre>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result)}>
                Copy to Clipboard
            </button>
        </div>
    );
};

export default ResultCard;