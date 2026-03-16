import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { productService, fileService, authService } from '../services/apiServices';
import { toast } from 'react-toastify';
import { Edit, Trash2, Plus, X, User } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import TestimonialForm from '../components/TestimonialForm';
import ConfirmModal from '../components/ConfirmModal';
import { API_BASE_URL } from '../config';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('products'); // 'products' ou 'testimonials'

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    // Estado para o modal de confirmação
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        id: null,
        type: '', // 'product' ou 'testimonial'
        message: ''
    });

    const loadData = async () => {
        try {
            const [pData, tData] = await Promise.all([
                productService.list(),
                authService.listTestimonials().catch(() => [])
            ]);
            setProducts(Array.isArray(pData) ? pData : pData.products ?? []);
            setTestimonials(Array.isArray(tData) ? tData : []);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao carregar dados.');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openProductModal = (product = null) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleProductDelete = (id) => {
        setConfirmConfig({
            isOpen: true,
            id,
            type: 'product',
            message: 'Deseja realmente apagar o produto?'
        });
    };

    const handleTestimonialDelete = (id) => {
        setConfirmConfig({
            isOpen: true,
            id,
            type: 'testimonial',
            message: 'Deseja realmente apagar o Depoimento?'
        });
    };

    const executeDelete = async () => {
        const { id, type } = confirmConfig;

        try {
            setLoading(true);
            if (type === 'product') {
                await productService.delete(id);
                toast.success('Produto removido!');
            } else {
                await authService.deleteTestimonial(id);
                toast.success('Depoimento removido!');
            }
            loadData();
        } catch (error) {
            toast.error('Erro ao remover item.');
            console.error(error);
        } finally {
            setLoading(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleProductSubmit = async (data, selectedImage) => {
        try {
            setLoading(true);
            if (!selectedImage && !editingProduct) {
                toast.error('Imagem obrigatória.');
                setLoading(false);
                return;
            }

            let file_id = null;
            if (selectedImage) {
                const fileResponse = await fileService.upload(selectedImage);
                file_id = fileResponse?.file?.id ?? fileResponse?.id ?? fileResponse?.file_id ?? null;
                if (!file_id) throw new Error('Falha no upload.');
            }

            const payload = { name: data.name, description: data.description, price: Number(data.price) };
            if (file_id) payload.file_id = file_id;

            if (editingProduct) {
                await productService.update(editingProduct.id || editingProduct._id, payload);
                toast.success('Produto atualizado!');
            } else {
                await productService.create(payload);
                toast.success('Produto criado!');
            }
            setIsProductModalOpen(false);
            loadData();
        } catch (error) {
            const serverMsg = error.response?.data?.message || error.message || 'Erro desconhecido';
            toast.error(`Falha: ${serverMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleTestimonialSubmit = async (data, selectedImage) => {
        try {
            setLoading(true);

            let file_id = null;
            let file_obj = null;
            if (selectedImage) {
                const fileResponse = await fileService.upload(selectedImage);
                // Captura tanto o ID quanto o objeto completo para o fallback
                file_obj = fileResponse?.file || fileResponse;
                file_id = file_obj?.id ?? file_obj?.file_id ?? null;
            }

            const payload = { ...data };
            if (file_id) payload.file_id = file_id;
            // Incluímos o objeto file no payload para que o fallback do localStorage salve o caminho da imagem
            if (file_obj) payload.file = file_obj;

            await authService.createTestimonial(payload);
            toast.success('Depoimento adicionado!');
            setIsTestimonialModalOpen(false);
            loadData();
        } catch (error) {
            toast.error('Erro ao salvar depoimento.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = activeTab === 'products'
        ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : testimonials;

    return (
        <div>
            <Navbar />
            <div className="page-container" style={{ maxWidth: '1000px' }}>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setActiveTab('products')}
                        style={{ padding: '1rem', border: 'none', background: 'none', borderBottom: activeTab === 'products' ? '3px solid var(--primary)' : 'none', fontWeight: 600, color: activeTab === 'products' ? 'var(--primary)' : 'var(--text-light)' }}
                    >
                        📦 PRODUTOS
                    </button>
                    <button
                        onClick={() => setActiveTab('testimonials')}
                        style={{ padding: '1rem', border: 'none', background: 'none', borderBottom: activeTab === 'testimonials' ? '3px solid var(--primary)' : 'none', fontWeight: 600, color: activeTab === 'testimonials' ? 'var(--primary)' : 'var(--text-light)' }}
                    >
                        💬 DEPOIMENTOS
                    </button>
                </div>

                <div className="admin-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', width: '100%', gap: '1rem', flexWrap: 'wrap' }}>
                        {activeTab === 'products' && (
                            <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                                <input
                                    type="text"
                                    placeholder="Pesquisar produto..."
                                    className="input-field"
                                    style={{ width: '100%', paddingLeft: '3rem' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                            </div>
                        )}
                        <button className="btn-primary" onClick={() => activeTab === 'products' ? setIsProductModalOpen(true) : setIsTestimonialModalOpen(true)} style={{ padding: '0.75rem 2rem', marginLeft: activeTab === 'testimonials' ? 'auto' : '0' }}>
                            <Plus size={20} /> {activeTab === 'products' ? 'Novo Produto' : 'Novo Depoimento'}
                        </button>
                    </div>
                </div>

                <div className="table-container" style={{ border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
                    {activeTab === 'products' ? (
                        <table>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--surface)' }}>
                                    <th>Imagem</th>
                                    <th>Nome</th>
                                    <th>Preço</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr><td colSpan="4" className="empty-state">Nenhum produto.</td></tr>
                                ) : (
                                    filteredItems.map(p => (
                                        <tr key={p.id || p._id}>
                                            <td>
                                                <div style={{ width: '50px', height: '50px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {(() => {
                                                        const imgPath = p.file?.path || p.photo || p.image;
                                                        if (!imgPath) return <span style={{ fontSize: '0.7rem', color: '#999' }}>S/ Foto</span>;

                                                        const fullUrl = imgPath.startsWith('http')
                                                            ? imgPath
                                                            : `${API_BASE_URL}/${imgPath.replace(/^\//, '')}`;

                                                        return (
                                                            <img
                                                                src={fullUrl}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.textContent = 'ERRO'; e.target.nextSibling.style.display = 'block'; }}
                                                            />
                                                        );
                                                    })()}
                                                    <span style={{ display: 'none', fontSize: '0.7rem', color: 'red' }}></span>
                                                </div>
                                            </td>
                                            <td>{p.name}</td>
                                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}</td>
                                            <td className="text-center">
                                                <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => openProductModal(p)}><Edit size={16} /></button>
                                                <button className="btn-danger" style={{ padding: '0.4rem', marginLeft: '0.5rem' }} onClick={() => handleProductDelete(p.id || p._id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--surface)' }}>
                                    <th>Foto</th>
                                    <th>Cliente</th>
                                    <th>Nota</th>
                                    <th>Depoimento</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length === 0 ? (
                                    <tr><td colSpan="5" className="empty-state">Nenhum depoimento.</td></tr>
                                ) : (
                                    filteredItems.map(t => (
                                        <tr key={t.id || t._id}>
                                            <td>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden'
                                                }}>
                                                    {(() => {
                                                        const imgPath = t.file?.path || t.photo || t.avatar || t.image || t.photo_url || t.avatar_url || t.file_path;
                                                        if (!imgPath) return <User size={20} color="#fff" />;

                                                        const cleanPath = typeof imgPath === 'string' ? imgPath.replace(/^\//, '') : '';
                                                        const fullUrl = cleanPath.startsWith('http')
                                                            ? cleanPath
                                                            : `${API_BASE_URL}/${cleanPath}`;

                                                        return (
                                                            <img
                                                                src={fullUrl}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    const fb = e.target.parentElement.querySelector('.user-fb');
                                                                    if (fb) fb.style.display = 'flex';
                                                                }}
                                                            />
                                                        );
                                                    })()}
                                                    <div className="user-fb" style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                                        <User size={20} color="#fff" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 'bold' }}>{t.name}</td>
                                            <td style={{ color: '#fbbf24', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                                                {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                                            </td>
                                            <td style={{ maxWidth: '400px', fontSize: '0.9rem' }}>{t.comment}</td>
                                            <td className="text-center">
                                                <button className="btn-danger" style={{ padding: '0.4rem' }} onClick={() => handleTestimonialDelete(t.id || t._id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modais */}
                {isProductModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ backgroundColor: '#FFF5F6', borderRadius: '25px', padding: '2.5rem' }}>
                            <div className="modal-header" style={{ justifyContent: 'center', border: 'none', position: 'relative', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                                    <div style={{ height: '6px', background: '#F5AFB8', flex: 1, borderRadius: '10px' }}></div>
                                    <h3 style={{
                                        fontFamily: 'serif',
                                        fontSize: '1.8rem',
                                        textTransform: 'uppercase',
                                        color: '#5D3A2C',
                                        whiteSpace: 'nowrap',
                                        fontWeight: '900'
                                    }}>
                                        {editingProduct ? 'Editar Produto' : 'Adicionar Produtos'}
                                    </h3>
                                    <div style={{ height: '6px', background: '#F5AFB8', flex: 1, borderRadius: '10px' }}></div>
                                </div>
                                <button onClick={() => setIsProductModalOpen(false)} style={{ position: 'absolute', right: '-1rem', top: '-1rem', background: '#F5AFB8', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={20} /></button>
                            </div>
                            <ProductForm initialData={editingProduct} onSubmit={handleProductSubmit} onCancel={() => setIsProductModalOpen(false)} loading={loading} />
                        </div>
                    </div>
                )}

                {isTestimonialModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ backgroundColor: '#FFF5F6', borderRadius: '25px', padding: '2.5rem' }}>
                            <div className="modal-header" style={{ justifyContent: 'center', border: 'none', position: 'relative', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                                    <div style={{ height: '6px', background: '#F5AFB8', flex: 1, borderRadius: '10px' }}></div>
                                    <h3 style={{
                                        fontFamily: 'serif',
                                        fontSize: '1.8rem',
                                        textTransform: 'uppercase',
                                        color: '#5D3A2C',
                                        whiteSpace: 'nowrap',
                                        fontWeight: '900'
                                    }}>
                                        Adicionar Depoimento
                                    </h3>
                                    <div style={{ height: '6px', background: '#F5AFB8', flex: 1, borderRadius: '10px' }}></div>
                                </div>
                                <button onClick={() => setIsTestimonialModalOpen(false)} style={{ position: 'absolute', right: '-1rem', top: '-1rem', background: '#F5AFB8', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><X size={20} /></button>
                            </div>
                            <TestimonialForm onSubmit={handleTestimonialSubmit} onCancel={() => setIsTestimonialModalOpen(false)} loading={loading} />
                        </div>
                    </div>
                )}

                <ConfirmModal
                    isOpen={confirmConfig.isOpen}
                    onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                    onConfirm={executeDelete}
                    message={confirmConfig.message}
                />
            </div>

            <footer style={{ backgroundColor: 'var(--secondary)', padding: '2rem', textAlign: 'center', color: '#fff', marginTop: 'auto' }}>
                <h3 style={{ fontFamily: 'serif', fontSize: '2rem', fontStyle: 'italic' }}>Cup<span style={{ color: 'var(--primary)' }}>&</span>Cake</h3>
            </footer>
        </div>
    );
}