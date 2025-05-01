require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
// Modules Imports
const connectDB = require('./config/dbConfig')
const ZeffyEvent = require('./models/ZeffyEventSchema')
const app = express();
app.use(express.json());


// CORS configuration: allow requests only from specified origins (comma-separated in env)
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost'];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (e.g. mobile apps, curl)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('CORS policy violation: Origin not allowed'));
    }
}));


// Initate DB connection
connectDB();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'App is working' });
})
// Test
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'App is working' });
})

// Webhook endpoint
app.post('/zeffy-webhook', async (req, res) => {
    // Simple verification
    if (process.env.ZEFFY_SECRET && req.headers['x-zeffy-secret'] !== process.env.ZEFFY_SECRET) {
        console.warn('⚠️ Invalid Zeffy secret on request');
        return res.status(401).send('Invalid secret');
    }

    const event = new ZeffyEvent({
        payload: req.body,
        headers: { xZeffySecret: req.headers['x-zeffy-secret'] || null }
    });

    try {
        const saved = await event.save();
        console.log('📥 Event logged with _id:', saved._id);
        res.status(200).send('OK');
    } catch (err) {
        console.error('❌ Error saving event:', err);
        res.status(500).send('Internal Server Error');
    }
});

if (process.env.MODE === 'production-vercel') {
    module.exports = app;
}
else {
    app.listen(process.env.PORT, () => {
        console.log(`App is running on port ${process.env.PORT}`)
    })
}
