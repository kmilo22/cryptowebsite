const express = require('express');
const { createAlert, getAlerts, deleteAlert } = require('../controllers/alertController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createAlert); // Crear una alerta
router.get('/', authenticate, getAlerts); // Obtener alertas
router.delete('/:id', authenticate, deleteAlert); // Eliminar una alerta

module.exports = router;
