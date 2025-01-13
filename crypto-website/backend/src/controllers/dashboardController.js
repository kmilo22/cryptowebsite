const { getCryptoPrices,  getCryptoHistoricalData, getCryptoHistoricalMinuteData } = require('../services/cryptoService');

// Obtener los precios de las principales criptomonedas
const getDashboard = async (req, res) => {
    try {
        const symbols = req.query.symbols ? req.query.symbols.split(',') : ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'XRP', 'ETH'];
        const currency = req.query.currency || 'USD';

        const prices = await getCryptoPrices(symbols, currency);

        res.json({
            message: `Precios de las criptomonedas obtenidos en ${currency}`,
            data: prices,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el dashboard de precios' });
    }
};
// Obtener datos históricos para gráficos
const getHistoricalData = async (req, res) => {
    try {
        const { symbol, currency = 'USD', limit = 30 } = req.query;

        if (!symbol) {
            return res.status(400).json({ error: 'El parámetro "symbol" es obligatorio' });
        }

        const historicalData = await getCryptoHistoricalData(symbol, currency, limit);

        res.json({
            message: `Datos históricos de ${symbol} en ${currency}`,
            data: historicalData,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos históricos' });
    }
};
const getHistoricalMinuteData = async (req, res) => {
    try {
        const { symbol, currency = 'USD', limit = 60 } = req.query;

        if (!symbol) {
            return res.status(400).json({ error: 'El parámetro "symbol" es obligatorio' });
        }

        const historicalMinuteData = await getCryptoHistoricalMinuteData(symbol, currency, limit);

        res.json({
            message: `Datos históricos por minuto de ${symbol} en ${currency}`,
            data: historicalMinuteData,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos históricos por minuto' });
    }
};


module.exports = { getDashboard, getHistoricalData, getHistoricalMinuteData };


