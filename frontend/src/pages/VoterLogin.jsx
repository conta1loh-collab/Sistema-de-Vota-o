import React, { useState } from 'react';
import { authService } from '../services/api';

const VoterLogin = ({ onLoginSuccess }) => {
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(matricula);
      onLoginSuccess(matricula, res.data.voter_name);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in" style={{ width: '400px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>Eleição CIPA 2026</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Por favor, insira sua matrícula para iniciar o processo de votação.
      </p>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Número da Matrícula" 
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          style={{
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '1.2rem',
            textAlign: 'center'
          }}
          required
        />
        {error && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</div>}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--accent-primary)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default VoterLogin;
