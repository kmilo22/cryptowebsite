const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extraer token tras "Bearer"

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos la información del usuario en req
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = authenticate;
