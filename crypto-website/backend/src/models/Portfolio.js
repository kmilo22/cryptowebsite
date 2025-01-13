const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
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
    quantity: {
        type: Number,
        required: true,
        min: 0, 
    },
    purchasePrice: {
        type: Number,
        required: true,
        min: 0, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
