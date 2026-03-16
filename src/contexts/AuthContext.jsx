import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/apiServices';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getToken, saveToken, getUser, saveUser, removeToken } from '../services/authStorage';

export const AuthContext = createContext({});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ── Recupera sessão salva ao iniciar ──────────────────────────────────────
    useEffect(() => {
        const token = getToken();
        const savedUser = getUser();

        if (token) {
            api.defaults.headers.common.Authorization = token;
            setUser(savedUser || { token });
        }

        setLoading(false);
    }, []);

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            const token = data?.token ?? data?.accessToken ?? data?.access_token;

            if (!token) {
                throw new Error('Token não retornado pela API.');
            }

            const userData = data?.user ?? { 
                email, 
                name: data?.name || data?.userName || 'Vendedor',
                photo: data?.photo || data?.avatar || null
            };

            // Persiste token em cookies e usuário em storage local
            saveToken(token);
            saveUser(userData);

            api.defaults.headers.common.Authorization = token;
            setUser(userData);

            toast.success('Login realizado com sucesso!');
            navigate('/store');
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Verifique suas credenciais.';
            toast.error(`Erro ao fazer login: ${msg}`);
            throw error;
        }
    };

    // ── Register ──────────────────────────────────────────────────────────────
    const register = async (name, email, password) => {
        try {
            await authService.register(name, email, password);
            toast.success('Cadastro realizado! Faça seu login.');
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.message || 'Erro ao realizar o cadastro.';
            toast.error(msg);
            throw error;
        }
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = () => {
        removeToken();
        delete api.defaults.headers.common.Authorization;
        setUser(null);
        navigate('/login');
        toast.info('Você saiu.');
    };

    return (
        <AuthContext.Provider
            value={{ signed: !!user, user, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}