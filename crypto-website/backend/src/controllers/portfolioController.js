const Portfolio = require('../models/Portfolio');
const { getCryptoPrices } = require('../services/cryptoService'); // Servicio para obtener precios actuales

// Añadir una criptomoneda al portafolio
const addCryptoToPortfolio = async (req, res) => {
    try {
        const { symbol, quantity, purchasePrice } = req.body;

        if (!symbol || !quantity || !purchasePrice) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const portfolioEntry = new Portfolio({
            userId: req.user.id, // ID del usuario autenticado
            symbol,
            quantity,
            purchasePrice,
        });

        await portfolioEntry.save();
        res.status(201).json({ message: 'Criptomoneda añadida al portafolio', portfolioEntry });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir criptomoneda al portafolio' });
    }
};

// Obtener el portafolio completo
const getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.find({ userId: req.user.id });
        const symbols = portfolio.map((item) => item.symbol);

        // Obtener precios actuales de las criptomonedas
        const prices = await getCryptoPrices(symbols);

        // Calcular el valor actual de cada criptomoneda
        const portfolioWithValues = portfolio.map((item) => ({
            _id: item._id,
            symbol: item.symbol,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            currentPrice: prices[item.symbol]?.USD || 0,
            totalValue: (prices[item.symbol]?.USD || 0) * item.quantity,
            profitLoss: ((prices[item.symbol]?.USD || 0) - item.purchasePrice) * item.quantity,
        }));

        res.json(portfolioWithValues);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el portafolio' });
    }
};

// Editar una criptomoneda del portafolio
const updateCryptoInPortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, purchasePrice } = req.body;

        const updatedEntry = await Portfolio.findByIdAndUpdate(
            id,
            { quantity, purchasePrice },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ error: 'Criptomoneda no encontrada en el portafolio' });
        }

        res.json({ message: 'Criptomoneda actualizada', updatedEntry });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar criptomoneda' });
    }
};

// Eliminar una criptomoneda del portafolio
const deleteCryptoFromPortfolio = async (req, res) => {
    try {
        const { id } = req.params; // Asegúrate de obtener el parámetro dinámico
        const userId = req.user.id;

        const result = await Portfolio.findOneAndDelete({ _id: id, userId }); // Cambia '_id' si tu modelo usa otro campo

        if (!result) {
            return res.status(404).json({ message: 'Criptomoneda no encontrada.' });
        }

        res.json({ message: 'Criptomoneda eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
const getCryptoList = async (req, res) => {
    try {
        const symbols = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'XRP', 'ETH']; // Puedes ampliar esta lista
        const cryptoData = await getCryptoPrices(symbols); // Llamar al servicio para obtener datos

        res.json(cryptoData); // Devuelve la lista procesada al frontend
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener lista de criptomonedas' });
    }
};

module.exports = {
    addCryptoToPortfolio,
    getPortfolio,
    updateCryptoInPortfolio,
    deleteCryptoFromPortfolio,
    getCryptoList 
};
