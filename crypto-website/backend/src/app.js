const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('../database/config');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const alertRoutes = require('./routes/alertRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:5173', // Cambia esto a la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Permitir envío de cookies si es necesario
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/auth/usuarios', authRoutes);
app.use('/api/portafolio', portfolioRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertRoutes);

// Función para verificar alertas automáticamente
const { checkAlerts } = require('./controllers/alertController');

const startAlertChecker = () => {
    setInterval(async () => {
        console.log('🔄 Verificando alertas cada 10 segundos...');
        await checkAlerts();
    }, 10000); // Ejecutar cada 10 segundos
};

// Iniciar verificación de alertas
startAlertChecker();

// Servidor escuchando
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
