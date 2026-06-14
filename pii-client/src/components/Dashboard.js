import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const { data } = await axios.get('http://localhost:3000/api/logs');
            setLogs(data);
        };
        fetchLogs();
    }, []);

    return (
        <div className="dashboard-container">
            <h3>🛡️ Security Audit Logs</h3>
            <table className="audit-table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Original (Masked for Admin)</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log._id}>
                            <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td>{log.original.substring(0, 10)}...</td>
                            <td><span className="status-tag">Redacted</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;