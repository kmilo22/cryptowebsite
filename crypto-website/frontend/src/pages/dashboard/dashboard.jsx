import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import './dashboard.css';

// Importar controladores
import { fetchCryptoPrices, fetchHistoricalData } from './dashboardController';

// Registrar componentes de Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Dashboard = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [historicalData, setHistoricalData] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [selectedSymbol, setSelectedSymbol] = useState('BTC');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cargar los precios de las criptomonedas
    useEffect(() => {
        const loadCryptoPrices = async () => {
            try {
                const data = await fetchCryptoPrices(currency);
                setCryptoData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        loadCryptoPrices();
    }, [currency]);

    // Cargar los datos históricos de la criptomoneda seleccionada
    useEffect(() => {
        const loadHistoricalData = async () => {
            try {
                const data = await fetchHistoricalData(selectedSymbol, currency);
                setHistoricalData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        loadHistoricalData();
    }, [selectedSymbol, currency]);

    // Datos para el gráfico
    const chartData = {
        labels: historicalData.map((data) => new Date(data.time * 1000).toLocaleDateString()),
        datasets: [
            {
                label: `${selectedSymbol} en ${currency}`,
                data: historicalData.map((data) => data.close),
                borderColor: '#F7931A',
                backgroundColor: 'rgba(247, 147, 26, 0.2)',
            },
        ],
    };

    // Eventos
    const handleRowClick = (symbol) => setSelectedSymbol(symbol);
    const handleDetailsClick = (symbol) => navigate(`/crypto/${symbol}`);

    return (
        <div>
            <div className="dashboard-container">
                {error && <p className="error-message">{error}</p>}
                <table className="crypto-table">
                    <thead>
                        <tr>
                            <th>Criptomoneda</th>
                            <th>Precio</th>
                            <th>Cambio (24h)</th>
                            <th>Volumen (24h)</th>
                            <th>Capitalización de Mercado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cryptoData.map((crypto) => (
                            <tr
                                key={crypto.symbol}
                                onClick={() => handleRowClick(crypto.symbol)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{crypto.symbol}</td>
                                <td>{crypto.price}</td>
                                <td
                                    style={{
                                        color: parseFloat(crypto.change24h) >= 0 ? 'green' : 'red',
                                    }}
                                >
                                    {crypto.change24h}%
                                </td>
                                <td>{crypto.volume24h}</td>
                                <td>{crypto.marketCap}</td>
                                <td>
                                    <button onClick={() => handleDetailsClick(crypto.symbol)}>Detalles</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="chart-container">
                    <h2>Gráfico de {selectedSymbol}</h2>
                    <Line data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
