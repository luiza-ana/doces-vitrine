import { useEffect, useState, useContext, useRef } from 'react';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { productService, authService } from '../services/apiServices';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import logoImg from '../assets/logo.png';

export default function Store() {
    const { user: authUser } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [profile, setProfile] = useState(authUser || { name: 'Visitante' });
    const [loading, setLoading] = useState(true);

    const productsRef = useRef(null);
    const testimonialsRef = useRef(null);

    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, profileData, testimonialsData] = await Promise.allSettled([
                productService.list(),
                authService.getProfile(),
                authService.listTestimonials()
            ]);

            if (productsData.status === 'fulfilled') {
                const data = productsData.value;
                setProducts(Array.isArray(data) ? data : data.products ?? []);
            }

            if (profileData.status === 'fulfilled') {
                setProfile(profileData.value);
            } else {
                setProfile(authUser);
            }

            if (testimonialsData.status === 'fulfilled') {
                const data = testimonialsData.value;
                setTestimonials(Array.isArray(data) ? data : data.testimonials ?? []);
            }
        } catch (error) {
            toast.error('Erro ao carregar os dados da loja.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
            <Navbar />

            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #e096a6 100%)',
                padding: '6rem 2rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2rem', // Reduzido para aproximar os elementos
                color: '#fff',
                boxShadow: 'var(--shadow-lg)',
                textAlign: 'center' // Garante alinhamento central em telas menores
            }}>
                <div style={{ maxWidth: '600px', textAlign: 'left', flex: '1 1 200px' }}>
                    <span style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                    }}>
                        BEM-VINDO À VITRINE DE {profile?.name?.toUpperCase() || 'SUA LOJA'}
                    </span>
                    <h1 style={{ fontSize: '4rem', textTransform: 'uppercase', lineHeight: 0.9, marginTop: '1.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>
                        DOCES QUE<br /><span style={{ color: 'var(--secondary)' }}>ENCANTAM</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9, lineHeight: 1.6 }}>
                        Aqui você encontra uma seleção especial de delícias preparadas com carinho, ingredientes de qualidade e muito sabor. Explore nossas opções, descubra novos sabores e escolha o doce perfeito para tornar o seu momento ainda mais especial.

                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-secondary" style={{ backgroundColor: '#fff', color: 'var(--primary)', padding: '1rem 2.5rem', borderRadius: '30px', fontWeight: 'bold', border: 'none' }}>VER CATÁLOGO</button>
                        <button className="btn-secondary" style={{ backgroundColor: 'transparent', color: '#fff', padding: '1rem 1.5rem', borderRadius: '30px', fontWeight: 'bold', border: '2px solid #fff' }}>CONTATO</button>
                    </div>
                </div>

                <div style={{ position: 'relative', flex: '0 0 auto', transform: 'translateX(-1rem)' }}>
                    <div style={{
                        width: '350px',
                        height: '350px',
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        backgroundColor: '#fff',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <img
                            src={logoImg}
                            alt="Logo Sweet & Bite"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="page-container" style={{ padding: '6rem 2rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', color: 'var(--secondary)', fontWeight: 800 }}>
                        <span style={{ color: 'var(--primary)' }}>#</span> NOSSOS PRODUTOS
                    </h2>
                    <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--primary)', margin: '1rem auto' }}></div>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Confira nossa vitrine e escolha seu favorito!</p>
                </div>

                {loading ? (
                    <div className="loading-spinner">Carregando...</div>
                ) : products.length === 0 ? (
                    <div className="empty-state">Nenhum produto cadastrado no momento.</div>
                ) : (
                    <div style={{ position: 'relative', padding: '0 3rem' }}>
                        <button 
                            onClick={() => scroll(productsRef, 'left')}
                            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 5, background: 'var(--primary)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        
                        <div 
                            ref={productsRef}
                            style={{ 
                                display: 'flex', 
                                gap: '2rem', 
                                overflowX: 'auto', 
                                scrollBehavior: 'smooth',
                                padding: '1rem 0.5rem',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                            className="hide-scrollbar"
                        >
                            {products.map((product) => (
                                <div key={product.id || product._id} style={{ flex: '0 0 300px' }}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => scroll(productsRef, 'right')}
                            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 5, background: 'var(--primary)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}

                {/* Testimonial Section */}
                <div style={{ marginTop: '8rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '3rem' }}>O que dizem nossos clientes</h2>
                    
                    <div style={{ position: 'relative', padding: '0 3rem' }}>
                        {testimonials.length > 0 && (
                            <button 
                                onClick={() => scroll(testimonialsRef, 'left')}
                                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 5, background: 'var(--primary)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        <div 
                            ref={testimonialsRef}
                            style={{ 
                                display: 'flex', 
                                gap: '2rem', 
                                overflowX: 'auto', 
                                scrollBehavior: 'smooth',
                                padding: '1rem 0.5rem',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                            className="hide-scrollbar"
                        >
                            {testimonials.length === 0 ? (
                                <p style={{ color: 'var(--text-light)', width: '100%' }}>Nenhum depoimento ainda. Seja o primeiro!</p>
                            ) : (
                                testimonials.map(t => (
                                    <div key={t.id || t._id} style={{ flex: '0 0 350px' }}>
                                        <div style={{
                                            backgroundColor: 'var(--surface)',
                                            padding: '2.5rem',
                                            borderRadius: '20px',
                                            boxShadow: 'var(--shadow-md)',
                                            border: '1px solid var(--border)',
                                            textAlign: 'left',
                                            position: 'relative',
                                            height: '100%'
                                        }}>
                                            <span style={{ position: 'absolute', top: '1rem', right: '2rem', fontSize: '3rem', color: 'var(--primary)', opacity: 0.2 }}>"</span>
                                            
                                            <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                                                {t.comment}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ 
                                                    width: '50px', 
                                                    height: '50px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: 'var(--primary)', 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden' 
                                                }}>
                                                    {(() => {
                                                        const imgPath = t.file?.path || t.photo || t.avatar || t.image || t.photo_url || t.avatar_url || t.file_path;
                                                        if (!imgPath) return <User size={24} color="#fff" />;
                                                        
                                                        const cleanPath = typeof imgPath === 'string' ? imgPath.replace(/^\//, '') : '';
                                                        const fullUrl = cleanPath.startsWith('http') 
                                                            ? cleanPath 
                                                            : `${API_BASE_URL}/${cleanPath}`;
                                                        
                                                        return (
                                                            <img 
                                                                src={fullUrl} 
                                                                alt="Client" 
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                                onError={(e) => { 
                                                                    e.target.style.display = 'none'; 
                                                                    const fallback = e.target.parentElement.querySelector('.user-fallback');
                                                                    if (fallback) fallback.style.display = 'flex';
                                                                }}
                                                            />
                                                        );
                                                    })()}
                                                    <div className="user-fallback" style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                                        <User size={24} color="#fff" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{t.name}</h4>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.2rem' }}>
                                                        {t.rating === 1 ? 'Insatisfeito' : 
                                                         t.rating === 2 ? 'Regular' : 
                                                         t.rating === 3 ? 'Bom' : 
                                                         t.rating === 4 ? 'Satisfeito' : 
                                                         'Muito Satisfeito'}
                                                    </span>
                                                    <div style={{ color: '#fbbf24', fontSize: '1rem', display: 'flex', gap: '2px' }}>
                                                        {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {testimonials.length > 0 && (
                            <button 
                                onClick={() => scroll(testimonialsRef, 'right')}
                                style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 5, background: 'var(--primary)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ backgroundColor: 'var(--primary)', padding: '3rem 2rem', textAlign: 'center', color: 'var(--secondary)' }}>
                <h3 style={{ fontFamily: 'serif', fontSize: '3rem', fontWeight: 'bold', letterSpacing: '-1px' }}>
                    Sweet & Bite
                </h3>
            </footer>
        </div>
    );
}
