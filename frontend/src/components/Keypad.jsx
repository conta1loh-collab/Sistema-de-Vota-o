import React, { useState } from 'react';

const Keypad = ({ onNumberPress, onBlank, onCorrect, onConfirm }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="urna-panel">
      <div className="keypad">
        {numbers.slice(0, 9).map(num => (
          <button key={num} className="key-btn" onClick={() => onNumberPress(num.toString())}>
            {num}
          </button>
        ))}
        <div /> {/* Spacer */}
        <button className="key-btn" onClick={() => onNumberPress("0")}>0</button>
        <div /> {/* Spacer */}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
        <button className="action-btn btn-blank" onClick={onBlank}>Branco</button>
        <button className="action-btn btn-correct" onClick={onCorrect}>Corrige</button>
      </div>
      
      <button className="action-btn btn-confirm" onClick={onConfirm}>
        Confirmar
      </button>
    </div>
  );
};

export default Keypad;
