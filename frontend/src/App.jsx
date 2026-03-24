import React, { useState, useEffect } from 'react';
import VoterLogin from './pages/VoterLogin';
import Urna from './components/Urna';
import AdminDashboard from './pages/AdminDashboard';
import { authService } from './services/api';
import AdminLogin from './pages/AdminLogin';
import ResultsPage from './pages/ResultsPage';

function App() {
  const [session, setSession] = useState({
    view: 'voter-login', // 'voter-login', 'waiting-confirmation', 'urna', 'admin', 'admin-login', 'results'
    matricula: null,
    voterName: null
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleVoterLogin = (matricula, name) => {
    // ... code for voter login (polling logic preserved)
    setSession({ view: 'waiting-confirmation', matricula, voterName: name });
    
    const timer = setInterval(async () => {
      try {
        const waitingRes = await authService.getWaiting();
        const voterData = waitingRes.data.find(v => v.matricula === matricula);
        if (voterData && voterData.is_authorized) {
          clearInterval(timer);
          setSession(prev => ({ ...prev, view: 'urna' }));
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
  };

  const toggleAdmin = () => {
    if (session.view === 'admin' || session.view === 'results') {
      setSession(prev => ({ ...prev, view: 'voter-login' }));
    } else {
      if (isAdminAuthenticated) {
        setSession(prev => ({ ...prev, view: 'admin' }));
      } else {
        setSession(prev => ({ ...prev, view: 'admin-login' }));
      }
    }
  };

  return (
    <div className="app-container">
      <div style={{ position: 'fixed', top: 10, right: 10 }}>
        <button onClick={toggleAdmin} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}>
          {(session.view === 'admin' || session.view === 'results') ? 'Sair Admin' : 'Admin Access'}
        </button>
      </div>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {session.view === 'voter-login' && <VoterLogin onLoginSuccess={handleVoterLogin} />}
        
        {session.view === 'waiting-confirmation' && (
          <div className="glass-card fade-in" style={{ textAlign: 'center' }}>
            <h2>Olá, {session.voterName}!</h2>
            <p>Seja bem-vindo(a). Por favor, apresente seu documento ao mesário para validação.</p>
            <div className="spinner" style={{ margin: '2rem auto' }}>Aguardando autorização...</div>
          </div>
        )}

        {session.view === 'urna' && <Urna matricula={session.matricula} onFinish={() => setSession({ view: 'voter-login', matricula: null, voterName: null })} />}
        
        {session.view === 'admin-login' && <AdminLogin onLoginSuccess={() => { setIsAdminAuthenticated(true); setSession(prev => ({ ...prev, view: 'admin' })); }} />}

        {session.view === 'admin' && <AdminDashboard onViewResults={() => setSession(prev => ({ ...prev, view: 'results' }))} />}

        {session.view === 'results' && <ResultsPage onBack={() => setSession(prev => ({ ...prev, view: 'admin' }))} />}
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        Sistema de Auditoria CIPA v1.0 | Transparência e Integridade
      </footer>
    </div>
  );
}

export default App;
