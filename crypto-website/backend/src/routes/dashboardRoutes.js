const express = require('express');
const { getDashboard, getHistoricalData, getHistoricalMinuteData } = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware'); // Rutas protegidas con autenticación

const router = express.Router();

// Ruta para obtener precios en tiempo real
router.get('/', authenticate, getDashboard);
router.get('/historical', authenticate, getHistoricalData);
router.get('/historical/minute', authenticate, getHistoricalMinuteData);
module.exports = router;
