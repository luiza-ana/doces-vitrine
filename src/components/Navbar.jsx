import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Store, LogOut, Package, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { logout } = useContext(AuthContext);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar" style={{ padding: '1rem 4rem' }}>
            <Link to="/store" className="navbar-brand" onClick={closeMenu} style={{ fontFamily: 'serif', fontSize: '2rem', fontStyle: 'italic', letterSpacing: '-1px' }}>
                Sweet<span style={{color: 'var(--secondary)'}}>&</span>Bite
            </Link>

            <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                {isMenuOpen ? <X size={24} color="var(--primary)" /> : <Menu size={24} color="var(--primary)" />}
            </button>

            <div className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
                <Link
                    to="/store"
                    className="nav-link"
                    style={{ textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 600 }}
                    onClick={closeMenu}
                >
                    Produtos
                </Link>
                <Link
                    to="/dashboard"
                    className="nav-link"
                    style={{ textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 600 }}
                    onClick={closeMenu}
                >
                    Admin Painel
                </Link>

                <button 
                    className="btn-secondary" 
                    onClick={() => {
                        closeMenu();
                        logout();
                    }} 
                    style={{ marginLeft: '1rem', border: 'none', color: 'var(--error)' }}
                >
                    <LogOut size={20} /> Sair
                </button>
            </div>
        </nav>
    );
}
