import axios from 'axios';

// Crear una instancia de Axios
const api = axios.create({
    baseURL: 'http://localhost:4000', // URL del backend
    withCredentials: true, // Para enviar cookies/credenciales
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Recuperar el token del almacenamiento local
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Agregar el token al encabezado
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejar errores específicos como 401 (no autorizado)
        if (error.response?.status === 401) {
            // Eliminar el token y redirigir al login
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirigir al login
        }
        return Promise.reject(error);
    }
);

export default api;
