const express = require('express');
const {
    addCryptoToPortfolio,
    getPortfolio,
    updateCryptoInPortfolio,
    deleteCryptoFromPortfolio,
    getCryptoList 
} = require('../controllers/portfolioController');

const authenticate = require('../middleware/authMiddleware'); // Middleware de autenticación

const router = express.Router();

router.post('/add', authenticate, addCryptoToPortfolio); // Añadir una criptomoneda
router.get('/', authenticate, getPortfolio); // Obtener el portafolio
router.put('/:id', authenticate, updateCryptoInPortfolio); // Actualizar una criptomoneda
router.delete('/:id', authenticate, deleteCryptoFromPortfolio); // Eliminar una criptomoneda
router.get('/crypto/list', authenticate, getCryptoList);

module.exports = router;
