import React, { useState } from 'react';
import { adminService } from '../services/api';
import { Lock, User } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await adminService.login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="glass-card fade-in" style={{ width: '400px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Acesso Restrito</h2>
      {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
          <input 
            type="text" 
            placeholder="Usuário" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 12px 12px 40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px 12px 12px 40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
          />
        </div>
        <button type="submit" className="urna-btn-confirm" style={{ padding: '12px', borderRadius: '10px', fontWeight: 'bold' }}>
          ENTRAR
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
