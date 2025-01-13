import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
    fetchPortfolioWithDetails,
    fetchCryptoList,
    addCryptoToPortfolio,
    removeCryptoFromPortfolio,
} from './portfolioController';

import './Portfolio.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [chartData, setChartData] = useState({});
    const [cryptoList, setCryptoList] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const updatedPortfolio = await fetchPortfolioWithDetails();
                const cryptoListData = await fetchCryptoList();
                setPortfolio(updatedPortfolio);
                setCryptoList(cryptoListData);
                updateChartData(updatedPortfolio);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setTotalCost(currentPrice * quantity);
    }, [quantity, currentPrice]);

    const handleAddToPortfolio = async () => {
        try {
            if (!selectedCrypto || !quantity || !currentPrice) {
                alert('Por favor, selecciona una criptomoneda y completa la cantidad.');
                return;
            }

            const updatedPortfolio = await addCryptoToPortfolio(
                portfolio,
                selectedCrypto,
                quantity,
                currentPrice
            );
            setPortfolio(updatedPortfolio);
            updateChartData(updatedPortfolio);
            alert('Criptomoneda añadida al portafolio.');
            setQuantity('');
            setSelectedCrypto('');
            setCurrentPrice(0);
            setTotalCost(0);
        } catch (error) {
            alert('Ocurrió un error al intentar añadir la criptomoneda.');
        }
    };

    const handleRemoveFromPortfolio = async (id) => {
        try {
            const confirmDelete = window.confirm(
                '¿Estás seguro de que deseas eliminar esta criptomoneda del portafolio?'
            );
            if (!confirmDelete) return;

            const updatedPortfolio = await removeCryptoFromPortfolio(portfolio, id);
            setPortfolio(updatedPortfolio);
            updateChartData(updatedPortfolio);
        } catch (error) {
            alert('Ocurrió un error al intentar eliminar la criptomoneda.');
        }
    };

    const updateChartData = (portfolio) => {
        if (portfolio.length === 0) {
            setChartData({});
            return;
        }

        const labels = portfolio.map((item) => item.symbol);
        const data = portfolio.map((item) => item.totalValue);
        const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

        setChartData({
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: backgroundColors,
                },
            ],
        });
    };

    return (
        <div>
            <div className="portfolio-container">
                <h1>Mi Portafolio</h1>
                <div className="portfolio-grid">
                    <div className="chart-section">
                        <h2>Distribución de Criptomonedas</h2>
                        {chartData.labels ? (
                            <Pie data={chartData} />
                        ) : (
                            <p>No hay datos en el gráfico.</p>
                        )}
                    </div>
                    <div className="buy-section">
                        <h2>Comprar Criptomonedas</h2>
                        <div className="buy-form">
                            <label>
                                Selecciona la criptomoneda:
                                <select
                                    value={selectedCrypto}
                                    onChange={(e) => {
                                        const selected = cryptoList.find(
                                            (crypto) => crypto.symbol === e.target.value
                                        );
                                        setSelectedCrypto(e.target.value);
                                        setCurrentPrice(
                                            selected
                                                ? parseFloat(
                                                      selected.price.replace('$', '').replace(',', '')
                                                  )
                                                : 0
                                        );
                                    }}
                                >
                                    <option value="">-- Selecciona --</option>
                                    {cryptoList.map((crypto) => (
                                        <option key={crypto.symbol} value={crypto.symbol}>
                                            {crypto.symbol} - ${crypto.price} ({crypto.change24h}%)
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Cantidad:
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </label>
                            <p>Precio actual: <strong>${currentPrice.toFixed(2)}</strong></p>
                            <p>Costo total: <strong>${totalCost.toFixed(2)}</strong></p>
                            <button onClick={handleAddToPortfolio} className="buy-button">
                                Añadir al Portafolio
                            </button>
                        </div>
                    </div>
                </div>
                <div className="table-section">
                    <h2>Detalles del Portafolio</h2>
                    <table className="portfolio-table">
                        <thead>
                            <tr>
                                <th>Criptomoneda</th>
                                <th>Cantidad</th>
                                <th>Precio de Compra</th>
                                <th>Precio Actual</th>
                                <th>Valor Total</th>
                                <th>Ganancia/Pérdida</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.symbol}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.purchasePrice.toFixed(2)}</td>
                                    <td>${item.currentPrice.toFixed(2)}</td>
                                    <td>${item.totalValue.toFixed(2)}</td>
                                    <td
                                        className={
                                            item.profitLoss >= 0 ? 'positive' : 'negative'
                                        }
                                    >
                                        ${item.profitLoss.toFixed(2)}
                                    </td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleRemoveFromPortfolio(item._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
