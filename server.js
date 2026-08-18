const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Mock License / Verification Route
app.post('/api/verify', (req, res) => {
    res.json({ 
        success: true, 
        valid: true, 
        status: 'active',
        license: 'Lifetime'
    });
});

// 2. Proxy Route for API Requests
app.post('/api/proxy', async (req, res) => {
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

// 3. Download Project Route
app.post('/api/download', async (req, res) => {
    try {
        res.json({ success: true, message: 'Project download initiated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Download failed' });
    }
});

// 4. Approve Plan Route
app.post('/api/approve', async (req, res) => {
    try {
        res.json({ success: true, message: 'Plan approved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Plan approval failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});