const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser); // Ruta para registro
router.post('/login', loginUser);       // Ruta para inicio de sesión

module.exports = router;


