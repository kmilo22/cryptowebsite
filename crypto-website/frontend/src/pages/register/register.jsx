import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePasswords, registerUser } from './registerController';
import './register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de contraseñas
        const passwordError = validatePasswords(
            formData.password,
            formData.confirmPassword
        );
        if (passwordError) {
            setError(passwordError);
            return;
        }

        // Registro del usuario
        const registerError = await registerUser(formData);
        if (registerError) {
            setError(registerError);
        } else {
            navigate('/login'); // Redirige al login tras registro exitoso
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-logo">
                    <img src="/binance-logo.png" alt="Binance Logo" />
                </div>
                <h1>Crear cuenta</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nombre de usuario"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="register-button">
                        Registrarse
                    </button>
                </form>
                <p className="redirect-login">
                    ¿Ya tienes una cuenta?{' '}
                    <span onClick={() => navigate('/login')}>Inicia sesión</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
