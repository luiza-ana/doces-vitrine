import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';

const productSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    description: z.string().optional(),
    price: z.coerce.number().min(0.01, 'O preço deve ser maior que zero')
});

import { Camera } from 'lucide-react';

export default function ProductForm({ initialData = null, onSubmit, onCancel, loading }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(productSchema)
    });

    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('description', initialData.description || '');
            setValue('price', initialData.price);
        }
    }, [initialData, setValue]);

    const handleFormSubmit = (data) => {
        onSubmit(data, selectedImage);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <label className="input-label" style={{ alignSelf: 'flex-start', color: '#5D3A2C', fontWeight: 'bold' }}>Foto:</label>
                <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    border: '2px solid #5D3A2C', 
                    borderRadius: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    position: 'relative', 
                    overflow: 'hidden',
                    backgroundColor: '#fff'
                }}>
                    {selectedImage ? (
                         <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                         <Camera size={48} color="#5D3A2C" strokeWidth={1} />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label" style={{textTransform: 'none', color: '#5D3A2C', fontWeight: 'bold'}}>Nome:</label>
                <input className={`input-field ${errors.name ? 'input-error' : ''}`} style={{border: '2px solid #5D3A2C', borderRadius: '15px'}} type="text" {...register('name')} />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="input-group">
                <label className="input-label" style={{textTransform: 'none', color: '#5D3A2C', fontWeight: 'bold'}}>Descrição:</label>
                <input className="input-field" style={{border: '2px solid #5D3A2C', borderRadius: '15px'}} type="text" {...register('description')} />
            </div>

            <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '1rem'}}>
                <div style={{flex: 1}}>
                    <label className="input-label" style={{textTransform: 'none', color: '#5D3A2C', fontWeight: 'bold'}}>Valor:</label>
                    <input className={`input-field ${errors.price ? 'input-error' : ''}`} style={{border: '2px solid #5D3A2C', borderRadius: '15px', width: '100%'}} type="number" step="0.01" {...register('price')} />
                    {errors.price && <span className="error-message">{errors.price.message}</span>}
                </div>
                
                <button type="submit" className="btn-primary" disabled={loading} style={{ 
                    width: '80px', 
                    height: '45px',
                    borderRadius: '15px', 
                    backgroundColor: '#F5AFB8', 
                    color: '#5D3A2C', 
                    fontSize: '1.5rem',
                    border: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 0 #e096a6'
                }}>
                    {loading ? '...' : '+'}
                </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button type="button" onClick={onCancel} disabled={loading} style={{ background: 'none', border: 'none', color: '#5D3A2C', textDecoration: 'underline', fontWeight: '500', cursor: 'pointer' }}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}
