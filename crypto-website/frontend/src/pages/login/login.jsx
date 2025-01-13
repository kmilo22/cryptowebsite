import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './authController'; // Importar controlador
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password); // Usar controlador
            localStorage.setItem('token', data.token); // Guardar el token
            navigate('/'); // Redirigir al Dashboard
        } catch (err) {
            setError(err.message); // Mostrar mensaje de error
        }
    };

    const handleRegister = () => {
        navigate('/register'); // Redirigir a la página de registro
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <img src="/binance-logo.png" alt="Binance Logo" />
                </div>
                <h2>Iniciar Sesión</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Introduce tu correo"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introduce tu contraseña"
                            required
                        />
                    </div>
                    <button className="login-button" type="submit">Ingresar</button>
                </form>
                <button className="register-button" onClick={handleRegister}>
                    Registrarse
                </button>
            </div>
        </div>
    );
};

export default Login;
