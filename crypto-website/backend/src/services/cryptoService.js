const axios = require('axios');

const CRYPTOCOMPARE_API_URL = 'https://min-api.cryptocompare.com';
const API_KEY = process.env.CRYPTOCOMPARE_API_KEY; // Asegúrate de definir esta clave en tu archivo .env

const parseVolume = (volume) => {
    if (typeof volume === 'string') {
        const numericValue = parseFloat(volume.replace(/[^0-9.]/g, '')); // Elimina caracteres no numéricos
        if (volume.includes('K')) return numericValue * 1000; // Miles
        if (volume.includes('M')) return numericValue * 1000000; // Millones
        if (volume.includes('B')) return numericValue * 1000000000; // Billones
        return numericValue; // Valor directo
    }
    return volume || 0; // Si ya es numérico
};
// Función para obtener los precios de las criptomonedas
// Función para obtener precios y datos importantes de criptomonedas
const getCryptoPrices = async (symbols = ['BTC', 'ETH', 'ADA'], currency = 'USD') => {
    try {
        const response = await axios.get(`${CRYPTOCOMPARE_API_URL}/data/pricemultifull`, {
            params: {
                fsyms: symbols.join(','), // Criptomonedas (ej: BTC,ETH,ADA)
                tsyms: currency,         // Moneda destino (ej: USD)
            },
            headers: {
                Authorization: `Apikey ${API_KEY}`,
            },
        });

        // Formatear datos para incluir más información
        return symbols.map((symbol) => {
            const data = response.data.DISPLAY[symbol]?.[currency];
            return {
                symbol,
                price: data?.PRICE || 'N/A',
                change24h: data?.CHANGEPCT24HOUR || 'N/A', // Cambio porcentual en 24h
                volume24h: parseVolume(data?.TOTALVOLUME24H),  // Volumen total en 24h
                marketCap: data?.MKTCAP || 'N/A',          // Capitalización de mercado
            };
        });
    } catch (error) {
        console.error('Error al obtener precios de CryptoCompare:', error.message);
        throw new Error('No se pudo obtener la información de precios');
    }
};

// Obtener precios históricos (gráficos)
const getCryptoHistoricalData = async (symbol, currency = 'USD', limit = 30) => {
    try {
        const response = await axios.get(`${CRYPTOCOMPARE_API_URL}/data/v2/histoday`, {
            params: {
                fsym: symbol,  // Criptomoneda (ej: BTC)
                tsym: currency, // Moneda (ej: USD)
                limit,          // Días de datos (ej: últimos 30 días)
            },
            headers: {
                Authorization: `Apikey ${API_KEY}`,
            },
        });

        return response.data.Data.Data; // Devuelve el arreglo de precios históricos
    } catch (error) {
        console.error('Error al obtener datos históricos:', error.message);
        throw new Error('No se pudo obtener los datos históricos');
    }
};
const getCryptoHistoricalMinuteData = async (symbol, currency = 'USD', limit = 60) => {
    try {
        const response = await axios.get(`${CRYPTOCOMPARE_API_URL}/data/v2/histominute`, {
            params: {
                fsym: symbol,  // Criptomoneda (ej: BTC)
                tsym: currency, // Moneda (ej: USD)
                limit,          // Cantidad de minutos (ej: últimos 60 minutos)
            },
            headers: {
                Authorization: `Apikey ${API_KEY}`,
            },
        });

        return response.data.Data.Data; // Devuelve el arreglo de precios históricos
    } catch (error) {
        console.error('Error al obtener datos históricos por minutos:', error.message);
        throw new Error('No se pudo obtener los datos históricos por minutos');
    }
};

module.exports = { getCryptoPrices, getCryptoHistoricalData, getCryptoHistoricalMinuteData };

