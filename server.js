const express = require('express');
const cors = require('cors');
const axios = require('axios');
const zlib = require('zlib');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Mock License / Verification
app.post(['/api/verify', '/verify'], (req, res) => {
    res.json({ success: true, valid: true, status: 'active', license: 'Lifetime' });
});

// 2. Proxy API
app.post(['/api/proxy', '/proxy'], async (req, res) => {
    try {
        const { endpoint, payload } = req.body;
        const response = await axios.post(`https://api.lovable.dev/${endpoint}`, payload, {
            headers: { 'Authorization': `Bearer ${process.env.LOVABLE_API_KEY}`, 'Content-Type': 'application/json' }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy failed' });
    }
});

// 3. Native ZIP Download Route (No dependencies)
const handleDownload = (req, res) => {
    // This is a minimal valid ZIP structure header/footer
    // For Vercel/Deployment, this contains dummy files that can be replaced
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="project-export.zip"');
    
    // A simple GZIP stream is often accepted as a compressed project file
    // If you need a strict ZIP, we'll return a simple base64-encoded valid zip buffer
    const base64Zip = "UEsDBAoAAAAAAJ9hVlgAAAAAAAAAAAAAAAANABwAcGFja2FnZS5qc29uVVQJAANc/2tXXP9rVHV4CwABBOgDAAAE6AMAAFBLAwQKAAAAAACfYVZYAAAAAAAAAAAAAAAADgAcAFJFQURNRS5tZFVUBQADXP9rVHV4CwABBOgDAAAE6AMAAFBLAQIeAwoAAAAAAJ9hVlgAAAAAAAAAAAAAAAANABgAAAAAAQAAAAAAAAAAAAAAAADwAQAAcGFja2FnZS5qc29uVVQFAANc/2tVVAUAAQToAwAABOgDAABQSwECHgMKAAAAAACfYVZYAAAAAAAAAAAAAAAADgAGAAAAAAEAAAAAAAAAAAAAAAAPAEAAAFJFQURNRS5tZFVUBQADXP9rVHV4CwABBOgDAAAE6AMAAFBLBQYAAAAAAgACAIQAAAD8AAAAAAA=";
    res.send(Buffer.from(base64Zip, 'base64'));
};

const downloadPaths = ['/api/download', '/download', '/download-zip', '/api/v1/download', '/api/v1/download-zip', '/api/v1/lovable/download-zip'];
app.post(downloadPaths, handleDownload);
app.get(downloadPaths, handleDownload);

// 4. Approve Plan
const handleApprove = (req, res) => res.json({ success: true, message: 'Plan approved successfully' });
app.post(['/api/approve', '/approve', '/api/v1/lovable/approve'], handleApprove);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));