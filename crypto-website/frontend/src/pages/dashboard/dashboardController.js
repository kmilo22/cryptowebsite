import api from '../../api/axios';

/**
 * Obtiene los precios actuales de las criptomonedas.
 * @param {string} currency - La moneda en la que se mostrarán los precios (USD, EUR, etc.).
 * @returns {Promise<Object[]>} - Lista de criptomonedas con sus datos.
 */
export const fetchCryptoPrices = async (currency) => {
    try {
        const response = await api.get('/api/dashboard/', { params: { currency } });
        return response.data.data;
    } catch (error) {
        throw new Error('Error al cargar los precios de las criptomonedas');
    }
};

/**
 * Obtiene los datos históricos de precios de una criptomoneda.
 * @param {string} symbol - El símbolo de la criptomoneda (BTC, ETH, etc.).
 * @param {string} currency - La moneda en la que se mostrarán los precios (USD, EUR, etc.).
 * @returns {Promise<Object[]>} - Lista de datos históricos.
 */
export const fetchHistoricalData = async (symbol, currency) => {
    try {
        const response = await api.get('/api/dashboard/historical', { params: { symbol, currency } });
        return response.data.data;
    } catch (error) {
        throw new Error('Error al cargar los datos históricos');
    }
};
