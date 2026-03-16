import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { signed, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="loading-spinner">Carregando...</div>;
    }

    if (!signed) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
