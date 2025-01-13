const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relación con el modelo de Usuario
        required: true,
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true, 
    },
    targetPrice: {
        type: Number,
        required: true,
    },
    alertType: {
        type: String,
        enum: ['above', 'below'], 
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Alert', alertSchema);
