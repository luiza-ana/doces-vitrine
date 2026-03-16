import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RoutesApp from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <RoutesApp />
                <ToastContainer position="top-right" autoClose={3000} theme="light" />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
