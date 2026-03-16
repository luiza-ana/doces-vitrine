import Cookies from 'js-cookie';

const TOKEN_KEY = '@DocesVitrine:token';
const USER_KEY = '@DocesVitrine:user';

/**
 * Salva o token nos cookies com expiração de 7 dias
 * @param {string} token 
 */
export const saveToken = (token) => {
    if (token) {
        Cookies.set(TOKEN_KEY, token, { 
            expires: 7, 
            secure: window.location.protocol === 'https:',
            sameSite: 'strict'
        });
    }
};

/**
 * Recupera o token dos cookies
 * @returns {string|null}
 */
export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY);
    return (token && token !== 'undefined' && token !== 'null') ? token : null;
};

/**
 * Remove o token e dados do usuário dos cookies/localStorage
 */
export const removeToken = () => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

/**
 * Salva os dados do usuário no localStorage
 * @param {object} user 
 */
export const saveUser = (user) => {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};

/**
 * Recupera os dados do usuário do localStorage
 * @returns {object|null}
 */
export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    try {
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};
