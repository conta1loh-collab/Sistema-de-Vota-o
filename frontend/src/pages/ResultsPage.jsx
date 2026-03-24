import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { ArrowLeft, PieChart, Trophy } from 'lucide-react';

const ResultsPage = ({ onBack }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getResults()
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="spinner">Carregando Resultados...</div>;

  if (!results) return (
    <div className="glass-card" style={{ textAlign: 'center' }}>
      <p>A eleição ainda está aberta. Encerre-a no painel administrativo para ver os resultados.</p>
      <button onClick={onBack} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>Voltar</button>
    </div>
  );

  const totalVotes = results.candidates.reduce((sum, c) => sum + c.votes, 0) + results.null_blank;

  return (
    <div className="glass-card fade-in" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
          <ArrowLeft size={18} /> Voltar ao Painel
        </button>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PieChart color="var(--accent-primary)" /> Apuração dos Votos
        </h2>
        <div style={{ width: '100px' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {results.candidates.sort((a,b) => b.votes - a.votes).map((cand, idx) => (
          <div key={cand.number} style={{ padding: '1.5rem', background: idx === 0 && cand.votes > 0 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '15px', border: idx === 0 && cand.votes > 0 ? '1px solid #34d399' : '1px solid var(--glass-border)', position: 'relative' }}>
            {idx === 0 && cand.votes > 0 && <Trophy size={20} style={{ position: 'absolute', top: -10, right: 10, color: '#fbbf24' }} />}
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{cand.name}</h3>
            <p style={{ color: '#888', marginBottom: '1rem' }}>Número: {cand.number}</p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{cand.votes}</div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
              {totalVotes > 0 ? ((cand.votes / totalVotes) * 100).toFixed(1) : 0}% dos votos
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Votos Brancos/Nulos: <strong>{results.null_blank}</strong></span>
        <span>Total de Votos: <strong>{totalVotes}</strong></span>
      </div>
    </div>
  );
};

export default ResultsPage;
