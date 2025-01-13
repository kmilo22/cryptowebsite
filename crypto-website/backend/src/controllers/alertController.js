const Alert = require('../models/alert');
const sendEmailNotification = require('../services/notificationService');
const { getCryptoPrices } = require('../services/cryptoService'); // Servicio para obtener precios actuales
const User = require('../models/user');

// Crear una alerta
const createAlert = async (req, res) => {
    try {
        const { symbol, targetPrice, alertType } = req.body;

        if (!symbol || !targetPrice || !alertType) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const alert = new Alert({
            userId: req.user.id,
            symbol,
            targetPrice,
            alertType,
        });

        await alert.save();
        res.status(201).json({ message: 'Alerta creada con éxito', alert });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la alerta' });
    }
};

// Obtener las alertas del usuario
const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ userId: req.user.id });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las alertas' });
    }
};

// Eliminar una alerta
const deleteAlert = async (req, res) => {
    try {
        const { id } = req.params;

        const alert = await Alert.findByIdAndDelete(id);
        if (!alert) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }

        res.json({ message: 'Alerta eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la alerta' });
    }
};



const checkAlerts = async () => {
    try {
        const activeAlerts = await Alert.find({ isActive: true });

        if (activeAlerts.length === 0) {
            console.log('No hay alertas activas para verificar.');
            return;
        }

        const symbols = [...new Set(activeAlerts.map((alert) => alert.symbol))];
        const prices = await getCryptoPrices(symbols);

        for (const alert of activeAlerts) {
            const cryptoData = prices.find((crypto) => crypto.symbol === alert.symbol);


            if (!cryptoData) {
                console.warn(`No se encontraron datos para el símbolo: ${alert.symbol}`);
                continue;
            }

            const currentPrice = parseFloat(cryptoData.price.replace(/[^0-9.]/g, ''));
            
            if (
                (alert.alertType === 'above' && currentPrice >= alert.targetPrice) ||
                (alert.alertType === 'below' && currentPrice <= alert.targetPrice)
            ) {
                // Obtener correo del usuario
                const user = await User.findById(alert.userId);
                if (user && user.email) {
                    await sendEmailNotification(user.email, alert.symbol, currentPrice);
                }

                // Desactivar alerta
                alert.isActive = false;
                await alert.save();
            }
        }
    } catch (error) {
        console.error('Error al comprobar alertas:', error.message);
    }
};


module.exports = { createAlert, getAlerts, deleteAlert, checkAlerts };
