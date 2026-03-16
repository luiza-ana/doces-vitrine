import React from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content" style={{ 
                maxWidth: '400px', 
                textAlign: 'center', 
                padding: '2rem',
                backgroundColor: '#FFF5F6', // Fundo rosado claro conforme imagem
                borderRadius: '20px',
                border: '2px solid #5D3A2C' // Borda marrom sutil
            }}>
                <p style={{ 
                    fontSize: '1.2rem', 
                    color: '#5D3A2C', 
                    fontWeight: '500', 
                    marginBottom: '2rem' 
                }}>
                    {message}
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                        onClick={onClose}
                        style={{ 
                            backgroundColor: '#F5AFB8', 
                            color: '#5D3A2C', 
                            border: 'none', 
                            padding: '0.8rem 2rem', 
                            borderRadius: '10px', 
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        Não
                    </button>
                    <button 
                        onClick={onConfirm}
                        style={{ 
                            backgroundColor: '#8B5E4A', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '0.8rem 2rem', 
                            borderRadius: '10px', 
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        Sim
                    </button>
                </div>
            </div>
        </div>
    );
}
