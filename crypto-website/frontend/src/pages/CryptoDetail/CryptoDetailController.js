import { useState, useEffect } from 'react';
import api from '../../api/axios';

const useCryptoDetailController = (symbol) => {
    const [cryptoData, setCryptoData] = useState({});
    const [historicalData, setHistoricalData] = useState([]);
    const [quantity, setQuantity] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await api.get(`/api/crypto/${symbol}`);
                setCryptoData(response.data);
            } catch (err) {
                console.error('Error al obtener detalles:', err);
            }
        };

        const fetchHistoricalData = async () => {
            try {
                const response = await api.get('/api/dashboard/historical/minute', {
                    params: { symbol, limit: 60 },
                });
                setHistoricalData(response.data.data);
            } catch (err) {
                console.error('Error al cargar datos históricos:', err);
            }
        };

        fetchCryptoData();
        fetchHistoricalData();
    }, [symbol]);

    useEffect(() => {
        const lastPrice = historicalData.length > 0 ? historicalData[historicalData.length - 1].close : 0;
        setTotalCost((parseFloat(quantity) || 0) * lastPrice);
    }, [quantity, historicalData]);

    const handleQuantityChange = (value) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setQuantity(value);
        }
    };

    const handleAddToPortfolio = async () => {
        try {
            const lastPrice = historicalData.length > 0 ? historicalData[historicalData.length - 1].close : 0;
            await api.post('/api/portafolio/add', {
                symbol,
                quantity: parseFloat(quantity) || 0,
                purchasePrice: lastPrice,
            });
            setMessage('Criptomoneda añadida al portafolio');
        } catch (err) {
            setMessage('Error al añadir al portafolio');
        }
    };

    return {
        cryptoData,
        historicalData,
        quantity,
        totalCost,
        message,
        handleQuantityChange,
        handleAddToPortfolio,
    };
};

export default useCryptoDetailController;
