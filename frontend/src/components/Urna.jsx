import React, { useState, useEffect } from 'react';
import Keypad from './Keypad';
import UrnaScreen from './UrnaScreen';
import { votingService, adminService } from '../services/api';

const Urna = ({ matricula, onFinish }) => {
  const [numbers, setNumbers] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [isVoted, setIsVoted] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    adminService.getCandidates().then(res => setCandidates(res.data));
  }, []);

  const handleNumberPress = (num) => {
    if (numbers.length < 2) {
      const newNumbers = [...numbers, num];
      setNumbers(newNumbers);
      
      if (newNumbers.length === 2) {
        const found = candidates.find(c => c.number === newNumbers.join(''));
        setCandidate(found || null);
      }
    }
  };

  const handleCorrect = () => {
    setNumbers([]);
    setCandidate(null);
  };

  const handleBlank = () => {
    setNumbers(["B", "R", "A", "N", "C", "O"]); // Placeholder for visual
    setCandidate({ name: "VOTO EM BRANCO", number: "" });
  };

  const handleConfirm = async () => {
    const candidateNumber = numbers.length === 2 ? numbers.join('') : null;
    try {
      await votingService.cast(matricula, candidateNumber);
      setIsVoted(true);
      // Play sound "Piririm!" (mock)
      setTimeout(() => {
        onFinish();
      }, 3000);
    } catch (err) {
      alert("Erro ao votar: " + err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="urna-machine fade-in">
      <UrnaScreen 
        numbers={numbers.every(n => !isNaN(n)) ? numbers : []} 
        candidate={candidate} 
        isVoted={isVoted}
        message={numbers.includes("B") ? "VOTO EM BRANCO" : null}
      />
      <Keypad 
        onNumberPress={handleNumberPress}
        onBlank={handleBlank}
        onCorrect={handleCorrect}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Urna;
