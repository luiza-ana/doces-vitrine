import { API_BASE_URL } from '../../config';

export default function ProductCard({ product }) {
    return (
        <div className="produto-card">
            <div style={{ width: '100%', height: '200px', backgroundColor: '#f5f5f5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(() => {
                    const imgPath = product.file?.path || product.photo || product.image;
                    if (!imgPath) return <span style={{ color: '#999' }}>Sem Imagem</span>;
                    
                    const fullUrl = imgPath.startsWith('http') 
                        ? imgPath 
                        : `${API_BASE_URL}/${imgPath.replace(/^\//, '')}`;
                    
                    return (
                        <img 
                            src={fullUrl} 
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                        />
                    );
                })()}
                <span style={{ display: 'none', color: '#999' }}>Erro na Imagem</span>
            </div>
            <div className="produto-content">
                <h3 className="produto-titulo">{product.name}</h3>
                <p className="produto-desc">
                    {product.description || 'Sem descrição'}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                    <span className="produto-preco">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(product.price)}
                    </span>
                </div>
            </div>
        </div>
    );
}
