import React from 'react';

const Header = () => (
    <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a202c', marginBottom: '10px' }}>
            🛡️ Shield<span style={{ color: '#3182ce' }}>AI</span>
        </h1>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>
            Privacy-first PII redaction powered by local Transformers.
        </p>
    </header>
);

export default Header;