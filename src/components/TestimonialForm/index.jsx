import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    comment: z.string().min(5, 'O depoimento deve ter pelo menos 5 caracteres'),
    rating: z.number().min(1).max(5)
});

import { Camera } from 'lucide-react';
import { useState } from 'react';

export default function TestimonialForm({ onSubmit, onCancel, loading }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            rating: 5
        }
    });

    const rating = watch('rating');

    const handleFormSubmit = async (data) => {
        await onSubmit(data, selectedImage);
        reset();
        setSelectedImage(null);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label className="input-label" style={{ alignSelf: 'flex-start', color: '#5D3A2C', fontWeight: 'bold' }}>Foto:</label>
                <div style={{ 
                    width: '100%', 
                    height: '180px', 
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
                         <Camera size={40} color="#5D3A2C" strokeWidth={1} />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                </div>
            </div>

            <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                    <label className="input-label" style={{textTransform: 'none', color: '#5D3A2C', fontWeight: 'bold'}}>Nome:</label>
                    <input 
                        className={`input-field ${errors.name ? 'input-error' : ''}`} 
                        type="text" 
                        placeholder="Ex: Maria Souza"
                        style={{border: '2px solid #5D3A2C', borderRadius: '15px'}}
                        {...register('name')} 
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ 
                    width: '70px', 
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

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" style={{textTransform: 'none', color: '#5D3A2C', fontWeight: 'bold'}}>Avaliação:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', fontSize: '1.6rem', cursor: 'pointer', color: '#fbbf24' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} onClick={() => setValue('rating', star)}>
                                {star <= rating ? '★' : '☆'}
                            </span>
                        ))}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#5D3A2C', fontWeight: 'bold', backgroundColor: '#F5AFB822', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                        {rating === 1 ? 'Insatisfeito' : 
                         rating === 2 ? 'Regular' : 
                         rating === 3 ? 'Bom' : 
                         rating === 4 ? 'Satisfeito' : 
                         'Muito Satisfeito'}
                    </span>
                </div>
            </div>

            <div className="input-group">
                <label className="input-label" style={{textTransform: 'none', color: '#5D3A2C', fontWeight: 'bold'}}>Descrição:</label>
                <textarea 
                    className={`input-field ${errors.comment ? 'input-error' : ''}`} 
                    rows="3"
                    placeholder="Escreva aqui o depoimento..."
                    style={{ resize: 'none', border: '2px solid #5D3A2C', borderRadius: '15px' }}
                    {...register('comment')} 
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button type="button" onClick={onCancel} disabled={loading} style={{ background: 'none', border: 'none', color: '#5D3A2C', textDecoration: 'underline', fontWeight: '500', cursor: 'pointer' }}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}
