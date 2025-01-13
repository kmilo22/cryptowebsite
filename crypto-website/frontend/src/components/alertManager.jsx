import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/alertManager.css';

const AlertManager = ({ onClose }) => {
    const [alerts, setAlerts] = useState([]);
    const [newAlert, setNewAlert] = useState({
        symbol: '',
        targetPrice: '',
        alertType: 'above',
    });
    const [cryptoList, setCryptoList] = useState([]);
    const [filteredCryptos, setFilteredCryptos] = useState([]);
    const [message, setMessage] = useState('');

    // Obtener alertas del usuario
    const fetchAlerts = async () => {
        try {
            const response = await api.get('/api/alerts');
            setAlerts(response.data);
        } catch (err) {
            console.error('Error al obtener alertas:', err);
        }
    };

    useEffect(() => {
        // Llamada inicial para obtener las alertas
        fetchAlerts();

        // Intervalo para verificar las alertas periódicamente
        const interval = setInterval(fetchAlerts, 10000); // Actualizar cada 10 segundos
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, []);

    // Obtener lista de criptomonedas
    useEffect(() => {
        const fetchCryptoList = async () => {
            try {
                const response = await api.get('/api/portafolio/crypto/list');
                setCryptoList(response.data);
            } catch (err) {
                console.error('Error al obtener lista de criptomonedas:', err);
            }
        };

        fetchCryptoList();
    }, []);

    // Filtrar criptomonedas al escribir en el campo de símbolo
    const handleSymbolChange = (e) => {
        const value = e.target.value.toUpperCase();
        setNewAlert({ ...newAlert, symbol: value });

        if (value.trim() !== '') {
            const filtered = cryptoList.filter((crypto) =>
                crypto.symbol.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCryptos(filtered);
        } else {
            setFilteredCryptos([]);
        }
    };

    const handleSelectCrypto = (symbol) => {
        setNewAlert({ ...newAlert, symbol });
        setFilteredCryptos([]);
    };

    const handleCreateAlert = async () => {
        try {
            const response = await api.post('/api/alerts', newAlert);
            setAlerts((prev) => [...prev, response.data.alert]);
            setMessage('Alerta creada con éxito');
        } catch (err) {
            setMessage('Error al crear la alerta');
            console.error(err);
        }
    };

    const handleDeleteAlert = async (id) => {
        try {
            await api.delete(`/api/alerts/${id}`);
            setAlerts((prev) => prev.filter((alert) => alert._id !== id));
            setMessage('Alerta eliminada con éxito');
        } catch (err) {
            setMessage('Error al eliminar la alerta');
            console.error(err);
        }
    };

    return (
        <div className="alert-manager">
            <div className="alert-manager-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Gestión de Alertas</h2>
                {message && <p className="message">{message}</p>}
                <div className="alert-form">
                    <div className="symbol-input-container">
                        <input
                            type="text"
                            placeholder="Símbolo (e.g., BTC)"
                            value={newAlert.symbol}
                            onChange={handleSymbolChange}
                            className="symbol-input"
                        />
                        {filteredCryptos.length > 0 && (
                            <ul className="crypto-dropdown">
                                {filteredCryptos.map((crypto) => (
                                    <li
                                        key={crypto.symbol}
                                        onClick={() => handleSelectCrypto(crypto.symbol)}
                                    >
                                        {crypto.symbol} - {crypto.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <input
                        type="number"
                        placeholder="Precio objetivo"
                        value={newAlert.targetPrice}
                        onChange={(e) =>
                            setNewAlert({ ...newAlert, targetPrice: e.target.value })
                        }
                    />
                    <select
                        value={newAlert.alertType}
                        onChange={(e) =>
                            setNewAlert({ ...newAlert, alertType: e.target.value })
                        }
                    >
                        <option value="above">Superior a</option>
                        <option value="below">Inferior a</option>
                    </select>
                    <button onClick={handleCreateAlert}>Crear Alerta</button>
                </div>
                <div className="alert-list">
                    <h3>Alertas Activas</h3>
                    <ul>
                        {alerts.map((alert) => (
                            <li
                                key={alert._id}
                                className={`alert-item ${
                                    alert.isActive ? '' : 'completed-alert'
                                }`}
                            >
                                <span>
                                    {alert.symbol} - {alert.targetPrice} USD (
                                    {alert.alertType === 'above' ? 'Superior a' : 'Inferior a'}
                                    )
                                </span>
                                {!alert.isActive && <span className="completed-text">Cumplida</span>}
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteAlert(alert._id)}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AlertManager;
