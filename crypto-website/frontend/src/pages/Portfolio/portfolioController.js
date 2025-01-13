import api from '../../api/axios';

// Obtener portafolio y actualizar datos de criptomonedas
export const fetchPortfolioWithDetails = async () => {
    try {
        const response = await api.get('/api/portafolio');
        const cryptoPrices = await api.get('/api/portafolio/crypto/list');

        const updatedPortfolio = response.data.map((item) => {
            const crypto = cryptoPrices.data.find((c) => c.symbol === item.symbol);
            const currentPrice = crypto
                ? parseFloat(crypto.price.replace('$', '').replace(',', ''))
                : item.currentPrice;

            const totalValue = currentPrice * item.quantity;
            const profitLoss = totalValue - item.purchasePrice * item.quantity;

            return {
                ...item,
                currentPrice,
                totalValue,
                profitLoss,
            };
        });

        return updatedPortfolio;
    } catch (error) {
        console.error('Error al obtener el portafolio:', error);
        throw error;
    }
};

// Obtener lista de criptomonedas
export const fetchCryptoList = async () => {
    try {
        const response = await api.get('/api/portafolio/crypto/list');
        return response.data;
    } catch (error) {
        console.error('Error al obtener lista de criptomonedas:', error);
        throw error;
    }
};

// Añadir criptomoneda al portafolio
export const addCryptoToPortfolio = async (portfolio, selectedCrypto, quantity, currentPrice) => {
    try {
        const existingCrypto = portfolio.find((item) => item.symbol === selectedCrypto);

        if (existingCrypto) {
            const updatedCrypto = {
                ...existingCrypto,
                quantity: existingCrypto.quantity + parseFloat(quantity),
            };

            await api.put(`/api/portafolio/${existingCrypto._id}`, updatedCrypto);

            const updatedPortfolio = portfolio.map((item) =>
                item.symbol === selectedCrypto
                    ? {
                          ...item,
                          quantity: item.quantity + parseFloat(quantity),
                          totalValue: item.currentPrice * (item.quantity + parseFloat(quantity)),
                      }
                    : item
            );

            return updatedPortfolio;
        } else {
            const newCrypto = {
                symbol: selectedCrypto,
                quantity: parseFloat(quantity),
                purchasePrice: currentPrice,
            };

            const response = await api.post('/api/portafolio/add', newCrypto);
            return [...portfolio, response.data];
        }
    } catch (error) {
        console.error('Error al añadir al portafolio:', error);
        throw error;
    }
};

// Eliminar criptomoneda del portafolio
export const removeCryptoFromPortfolio = async (portfolio, id) => {
    try {
        await api.delete(`/api/portafolio/${id}`);
        return portfolio.filter((item) => item._id !== id);
    } catch (error) {
        console.error('Error al eliminar del portafolio:', error);
        throw error;
    }
};
