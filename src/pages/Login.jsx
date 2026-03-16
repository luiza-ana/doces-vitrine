import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import authHero from '../assets/auth-hero.jpg';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

export default function Login() {
  const { login, signed, loading } = useContext(AuthContext);
  
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  if (loading) return <div className="loading-spinner">Carregando...</div>;
  if (signed) return <Navigate to="/store" />;

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-split-left">
        <img 
          src={authHero} 
          alt="Hero" 
          className="auth-split-bg"
        />
        <div className="auth-split-left-content">
          <h1 className="auth-logo" style={{ fontSize: '5.5rem', color: '#fff', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
            Sweet &<br/>Bite
          </h1>
        </div>
      </div>
      
      <div className="auth-split-right">
        <div className="auth-tabs">
          <Link to="/register" style={{ color: 'inherit' }}>Sign Up</Link>
        </div>
        <div className="auth-card" style={{ maxWidth: '450px' }}>
          <h1 className="auth-title">Login Admin</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
              <label className="input-label">Email:</label>
              <input className={`input-field ${errors.email ? 'input-error' : ''}`} type="email" placeholder="Seu email" {...formRegister('email')} />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Senha:</label>
              <input className={`input-field ${errors.password ? 'input-error' : ''}`} type="password" placeholder="Sua senha" {...formRegister('password')} />
              {errors.password && <span className="error-message">{errors.password.message}</span>}
            </div>
            <button className="btn-primary" style={{width: '100%', marginTop: '1.5rem', borderRadius: '8px'}} type="submit">
              Logar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
