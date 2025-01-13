const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generar Token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });
};

// Registro de usuarios
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si el usuario o correo ya existe
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ error: 'El usuario o correo ya existe' });
        }

        // Crear nuevo usuario
        const user = await User.create({ username, email, password });
        const token = generateToken(user);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Inicio de sesión
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token
        const token = generateToken(user);

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

module.exports = { registerUser, loginUser };
