import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/register/register';
import CryptoDetail from './pages/CryptoDetail/CryptoDetail';
import Portfolio from './pages/Portfolio/Portfolio';

const AppContent = ({ isAuthenticated, handleLogout, handleLogin }) => {
    return (
        <>
            {/* El Navbar siempre estará visible */}
            <Navbar onLogout={handleLogout} />
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/crypto/:symbol"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <CryptoDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/portfolio"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Portfolio />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticación

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <Router>
            <AppContent
                isAuthenticated={isAuthenticated}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        </Router>
    );
};

export default App;
