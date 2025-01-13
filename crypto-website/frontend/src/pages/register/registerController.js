import api from '../../api/axios'; // Importar la instancia de Axios

export const validatePasswords = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
    }
    return null;
};

export const registerUser = async (formData) => {
    try {
        await api.post('/auth/usuarios/register', {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });
        return null; // Sin errores
    } catch (err) {
        return 'Hubo un error al registrarse. Intenta nuevamente.';
    }
};
