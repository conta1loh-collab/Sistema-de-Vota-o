import React, { useState, useEffect } from 'react';
import { adminService, authService } from '../services/api';
import { LogOut, UserPlus, Users, ClipboardList, Download, CheckCircle, Power, BarChart2, Upload } from 'lucide-react';

const AdminDashboard = ({ onViewResults }) => {
  const [activeTab, setActiveTab] = useState('confirm');
  const [logs, setLogs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [isElectionOpen, setIsElectionOpen] = useState(true);
  const [newCand, setNewCand] = useState({ name: '', number: '' });
  const [newVoter, setNewVoter] = useState({ name: '', matricula: '' });

  useEffect(() => {
    refreshData();
    checkElectionStatus();
  }, [activeTab]);

  const checkElectionStatus = async () => {
    try {
      const res = await adminService.getElectionStatus();
      setIsElectionOpen(res.data.is_open);
    } catch (err) { console.error(err); }
  };

  const refreshData = async () => {
    try {
      if (activeTab === 'logs') {
        const res = await adminService.getLogs();
        setLogs(res.data);
      } else if (activeTab === 'candidates') {
        const res = await adminService.getCandidates();
        setCandidates(res.data);
      } else if (activeTab === 'confirm' || activeTab === 'voters') {
        const res = await authService.getWaiting();
        setVoters(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleElection = async () => {
    if (confirm(`Tem certeza que deseja ${isElectionOpen ? 'ENCERRAR' : 'ABRIR'} a eleição?`)) {
      const res = await adminService.toggleElection();
      setIsElectionOpen(res.data.is_open);
    }
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await adminService.importVoters(file);
      alert('Eleitores importados com sucesso!');
      refreshData();
    }
  };

  const handleConfirmVoter = async (matricula) => {
    await authService.confirm(matricula);
    refreshData();
  };

  const handleAddCandidate = async () => {
    await adminService.addCandidate(newCand.number, newCand.name);
    setNewCand({ name: '', number: '' });
    refreshData();
  };

  const handleAddVoter = async () => {
    const csvContent = `matricula,nome\n${newVoter.matricula},${newVoter.name}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const file = new File([blob], 'voter.csv', { type: 'text/csv' });
    await adminService.importVoters(file);
    setNewVoter({ name: '', matricula: '' });
    refreshData();
  };

  const handleExportLogs = async () => {
    const res = await adminService.exportLogs();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'audit_logs.csv');
    document.body.appendChild(link);
    link.click();
  };

  const handleExportVoted = async () => {
    const res = await adminService.exportVoted();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'eleitores_que_votaram.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="glass-card fade-in" style={{ width: '950px', height: '650px', display: 'flex', gap: '2rem' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--glass-border)', paddingRight: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>PAINEL DE CONTROLE</h2>
        
        <button onClick={() => setActiveTab('confirm')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem', background: activeTab === 'confirm' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}>
          <CheckCircle size={18} /> Confirmar Eleitor
        </button>
        <button onClick={() => setActiveTab('candidates')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem', background: activeTab === 'candidates' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}>
          <UserPlus size={18} /> Candidatos
        </button>
        <button onClick={() => setActiveTab('voters')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem', background: activeTab === 'voters' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}>
          <Users size={18} /> Eleitores
        </button>
        <button onClick={() => setActiveTab('logs')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem', background: activeTab === 'logs' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}>
          <ClipboardList size={18} /> Auditoria
        </button>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <button 
            onClick={handleToggleElection} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem', background: isElectionOpen ? '#ef4444' : '#10b981', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold' }}
          >
            <Power size={18} /> {isElectionOpen ? 'Encerrar Eleição' : 'Abrir Eleição'}
          </button>
          
          <button 
            onClick={onViewResults} 
            disabled={isElectionOpen}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem', background: isElectionOpen ? 'rgba(255,255,255,0.05)' : 'var(--accent-primary)', border: 'none', color: 'white', cursor: isElectionOpen ? 'not-allowed' : 'pointer', borderRadius: '8px', opacity: isElectionOpen ? 0.5 : 1 }}
          >
            <BarChart2 size={18} /> Ver Apuração
          </button>

          <button 
            onClick={handleExportVoted} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px' }}
          >
            <Download size={18} /> Exportar Votantes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
        {activeTab === 'confirm' && (
          <div>
            <h3>Fila de Votação (Pendentes)</h3>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Autorize o eleitor após conferir o documento físico.</p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {voters.filter(v => !v.is_authorized && !v.has_voted).map(v => (
                <div key={v.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 'bold' }}>{v.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Matrícula: {v.matricula}</span>
                  </div>
                  <button onClick={() => handleConfirmVoter(v.matricula)} style={{ padding: '0.6rem 1.2rem', background: 'var(--urna-btn-confirm)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>AUTORIZAR</button>
                </div>
              ))}
              {voters.filter(v => !v.is_authorized && !v.has_voted).length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                  <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>Nenhum eleitor aguardando autorização no momento.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'voters' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <h3>Gerenciar Eleitores</h3>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Adicione manualmente ou importe via CSV (Colunas: matricula, nome)</p>
              </div>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
                <Upload size={16} /> Importar CSV
                <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
              <input type="text" placeholder="Nome Completo" value={newVoter.name} onChange={e => setNewVoter({...newVoter, name: e.target.value})} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid #444', color: 'white' }} />
              <input type="text" placeholder="Matrícula" value={newVoter.matricula} onChange={e => setNewVoter({...newVoter, matricula: e.target.value})} style={{ width: '150px', padding: '0.6rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid #444', color: 'white' }} />
              <button onClick={handleAddVoter} style={{ padding: '0.6rem 1.2rem', background: 'var(--accent-primary)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>ADICIONAR</button>
            </div>

            <h3>Lista Total ({voters.length})</h3>
            <div style={{ border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' }}>
              {voters.map((v, idx) => (
                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem', background: v.has_voted ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderLeft: v.has_voted ? '4px solid #10b981' : '4px solid #ef4444', borderBottom: idx === voters.length - 1 ? 'none' : '1px solid #333' }}>
                  <span>{v.name} <small style={{ color: '#666', marginLeft: '10px' }}>#{v.matricula}</small></span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: v.has_voted ? '#10b981' : '#ef4444', background: v.has_voted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                    {v.has_voted ? 'VOTOU' : 'NÃO VOTOU'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div>
            <h3>Gerenciar Candidatos</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
              <input type="text" placeholder="Nome do Candidato" value={newCand.name} onChange={e => setNewCand({...newCand, name: e.target.value})} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid #444', color: 'white' }} />
              <input type="text" placeholder="Número" value={newCand.number} onChange={e => setNewCand({...newCand, number: e.target.value})} style={{ width: '100px', padding: '0.6rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid #444', color: 'white' }} />
              <button onClick={handleAddCandidate} style={{ padding: '0.6rem 1.2rem', background: 'var(--accent-primary)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>ADICIONAR</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {candidates.map(c => (
                <div key={c.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{c.number}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{c.name}</div>
                  <button onClick={() => adminService.removeCandidate(c.id).then(refreshData)} style={{ color: '#ef4444', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Remover</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Registros de Auditoria</h3>
              <button onClick={handleExportLogs} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                <Download size={16} /> Exportar CSV
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {logs.map(log => (
                <div key={log.id} style={{ padding: '10px', borderBottom: '1px solid #333', background: log.action.includes('FAILED') || log.action.includes('REJECTED') ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <code style={{ color: 'var(--accent-secondary)' }}>[{log.function_code}]</code>
                    <span style={{ color: '#666' }}>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div><strong>{log.action}</strong>: {log.details}</div>
                  <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '4px' }}>IP: {log.ip_address} | Usuário: {log.user_matricula}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
