// Usando o proxy configurado no vite.config.js para evitar problemas de CORS
export const API_BASE_URL = window.location.hostname === 'localhost' 
    ? '/api-proxy' 
    : 'https://knex.zernis.space';
