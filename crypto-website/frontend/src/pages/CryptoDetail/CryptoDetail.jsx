import React from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import useCryptoDetailController from './CryptoDetailController';
import './CryptoDetail.css';

const CryptoDetail = () => {
    const { symbol } = useParams();
    const {
        cryptoData,
        historicalData,
        quantity,
        totalCost,
        message,
        handleQuantityChange,
        handleAddToPortfolio,
    } = useCryptoDetailController(symbol);

    const chartData = {
        labels: historicalData.map((data) =>
            new Date(data.time * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            })
        ),
        datasets: [
            {
                label: `Precio de ${symbol}`,
                data: historicalData.map((data) => data.close),
                borderColor: '#F7931A',
                backgroundColor: 'rgba(247, 147, 26, 0.2)',
                tension: 0.2,
                pointRadius: 0,
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1a1a1a',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#333',
            },
        },
        scales: {
            x: {
                ticks: { color: '#E0E0E0' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            y: {
                ticks: { color: '#E0E0E0' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    };

    return (
        <div>
            <div className="crypto-detail-container">
                <div className="left-section">
                    <h1>Detalles de {symbol}</h1>
                    <p className="price-info">
                        {historicalData.length > 0
                            ? `De ${symbol} a USD: 1 ${symbol} equivale a $${historicalData[historicalData.length - 1].close.toFixed(2)} USD `
                            : 'Cargando precio...'}
                        {cryptoData.changePercentage !== undefined ? (
                            <span
                                className={cryptoData.changePercentage >= 0 ? 'positive' : 'negative'}
                            >
                                {cryptoData.changePercentage >= 0
                                    ? `+${cryptoData.changePercentage}%`
                                    : `${cryptoData.changePercentage}%`}
                            </span>
                        ) : null}
                    </p>
                    <div className="chart-container">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="right-section">
                    <h2>Comprar {symbol}</h2>
                    <label>
                        Cantidad:
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(e.target.value)}
                            className="quantity-input"
                        />
                    </label>
                    <p className="total-cost">
                        Gastarás: <span>${totalCost.toFixed(2)}</span> USD
                    </p>
                    <button onClick={handleAddToPortfolio} className="buy-button">
                        Añadir al Portafolio
                    </button>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default CryptoDetail;
