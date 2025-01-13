import api from '../../api/axios';

/**
 * Obtiene la lista de criptomonedas del servidor y actualiza el estado.
 */
export const fetchCryptoList = async (setCryptoList) => {
    try {
        const response = await api.get('/api/portafolio/crypto/list'); // Endpoint para obtener todas las criptomonedas
        setCryptoList(response.data);
    } catch (err) {
        console.error('Error al obtener lista de criptomonedas:', err);
    }
};

/**
 * Maneja los cambios en el campo de búsqueda.
 */
export const handleSearchChange = (e, setSearchQuery, cryptoList, setFilteredResults) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== '') {
        const results = cryptoList.filter((crypto) =>
            crypto.symbol.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredResults(results);
    } else {
        setFilteredResults([]);
    }
};

/**
 * Maneja la selección de una criptomoneda en los resultados de búsqueda.
 */
export const handleCryptoClick = (symbol, setSearchQuery, setFilteredResults, navigate) => {
    setSearchQuery(''); // Limpia el campo de búsqueda
    setFilteredResults([]); // Limpia los resultados
    navigate(`/crypto/${symbol}`); // Redirige a la página de detalles
};

/**
 * Maneja el cierre de sesión del usuario.
 */
export const handleLogout = (navigate) => {
    localStorage.removeItem('token'); // Elimina el token de autenticación
    navigate('/login'); // Redirige al login
};
