const mongoose = require('mongoose');

// Define a schema and model for Zeffy events
const eventSchema = new mongoose.Schema({
    receivedAt: { type: Date, default: Date.now },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    headers: {
        xZeffySecret: { type: String, default: null }
    }
}, { timestamps: true });

module.exports = mongoose.model('ZeffyEvent', eventSchema);

