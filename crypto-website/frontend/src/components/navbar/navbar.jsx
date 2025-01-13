import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCryptoList, handleSearchChange, handleCryptoClick, handleLogout } from './navbarController';
import './navbar.css'; // Asegúrate de tener este archivo de estilos
import AlertManager from '../alertManager';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [cryptoList, setCryptoList] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [showAlertManager, setShowAlertManager] = useState(false);

    useEffect(() => {
        fetchCryptoList(setCryptoList);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="/binance-logo.png" alt="Logo" />
                <span>CryptoApp</span>
            </div>
            <div className="navbar-search">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) =>
                        handleSearchChange(e, setSearchQuery, cryptoList, setFilteredResults)
                    }
                />
                {filteredResults.length > 0 && (
                    <ul className="search-dropdown">
                        {filteredResults.map((crypto) => (
                            <li
                                key={crypto.symbol}
                                onClick={() => handleCryptoClick(crypto.symbol, setSearchQuery, setFilteredResults, navigate)}
                            >
                                {crypto.symbol} - {crypto.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="navbar-links">
                <button onClick={() => navigate('/')}>Mercados</button>
                <button onClick={() => navigate('/Portfolio')}>Portafolio</button>
                <button onClick={() => setShowAlertManager(true)}>Alertas</button>
                <button onClick={() => handleLogout(navigate)}>Salir</button>
            </div>
            {showAlertManager && (
                <AlertManager onClose={() => setShowAlertManager(false)} />
            )}
        </nav>
    );
};

export default Navbar;
