const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Mock License / Verification Route
app.post(['/api/verify', '/verify'], (req, res) => {
    res.json({ 
        success: true, 
        valid: true, 
        status: 'active',
        license: 'Lifetime'
    });
});

// 2. Proxy Route for API Requests
app.post(['/api/proxy', '/proxy'], async (req, res) => {
    try {
        const { endpoint, payload } = req.body;
        const response = await axios.post(`https://api.lovable.dev/${endpoint}`, payload, {
            headers: {
                'Authorization': `Bearer ${process.env.LOVABLE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(
            error.response?.data || { error: 'Proxy forwarding failed' }
        );
    }
});

// 3. Download Project Routes (including the new exact path)
const handleDownload = (req, res) => {
    res.json({ success: true, message: 'Project download initiated successfully' });
};
const downloadPaths = [
    '/api/download', '/download', '/download-zip', 
    '/api/v1/download', '/api/v1/download-zip', 
    '/api/v1/lovable/download-zip'
];
app.post(downloadPaths, handleDownload);
app.get(downloadPaths, handleDownload);

// 4. Approve Plan Routes
const handleApprove = (req, res) => {
    res.json({ success: true, message: 'Plan approved successfully' });
};
const approvePaths = ['/api/approve', '/approve', '/api/v1/approve', '/api/v1/lovable/approve'];
app.post(approvePaths, handleApprove);
app.get(approvePaths, handleApprove);

// Catch-all to log any other unhandled routes
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ error: `Route not found: ${req.url}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});