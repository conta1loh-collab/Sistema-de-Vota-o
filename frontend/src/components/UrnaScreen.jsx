import React from 'react';

const UrnaScreen = ({ numbers, candidate, isVoted, message }) => {
  if (isVoted) {
    return (
      <div className="urna-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '5rem', fontWeight: 'bold' }}>
        FIM
      </div>
    );
  }

  return (
    <div className="urna-screen">
      <div style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>SEU VOTO PARA:</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>MEMBRO DA CIPA</div>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
        {numbers.map((n, i) => (
          <div key={i} style={{ 
            width: '40px', 
            height: '60px', 
            border: '2px solid #555', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontSize: '2rem',
            background: 'white',
            color: 'black'
          }}>
            {n}
          </div>
        ))}
      </div>

      {candidate ? (
        <div className="fade-in" style={{ flex: 1 }}>
          <div style={{ marginBottom: '5px' }}>Nome: <strong>{candidate.name}</strong></div>
          <div>Partido/Área: <strong>CIPA</strong></div>
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', borderTop: '2px solid #222', paddingTop: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
            Aperte a tecla:<br/>
            VERDE para CONFIRMAR<br/>
            LARANJA para CORRIGIR
          </div>
        </div>
      ) : numbers.length === 2 && !message ? (
        <div className="fade-in" style={{ color: 'red', flex: 1, marginTop: '2rem' }}>CANDIDATO INEXISTENTE - VOTO NULO</div>
      ) : message ? (
        <div className="fade-in" style={{ fontSize: '2rem', marginTop: '2rem', flex: 1 }}>{message}</div>
      ) : null}

      {/* Realistic 6x8cm photo placeholder */}
      {candidate && (
        <div style={{ position: 'absolute', right: '10%', top: '10%', width: '6cm', height: '8cm', border: '2px solid #222', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ccc', flexDirection: 'column' }}>
          <span style={{ color: '#444', fontSize: '2rem' }}>👤</span>
          <span style={{ fontSize: '0.8rem', color: '#444', marginTop: '10px' }}>Foto do Candidato</span>
        </div>
      )}
    </div>
  );
};

export default UrnaScreen;
