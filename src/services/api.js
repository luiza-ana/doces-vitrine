import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getToken, removeToken } from './authStorage';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// ─── REQUEST INTERCEPTOR ────────────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = token;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ───────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken();

            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;