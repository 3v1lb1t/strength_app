// src/App.tsx
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [oneRepMax, setOneRepMax] = useState({
    squat: 0,
    bench: 0,
    deadlift: 0,
    press: 0,
    clean: 0,
    snatch: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setOneRepMax({ ...oneRepMax, [id]: parseInt(value) || 0 });
  };

  const calculateWeight = (percent: number, lift: keyof typeof oneRepMax) => {
    return `${Math.round(oneRepMax[lift] * percent)} lbs (${percent * 100}%)`;
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Strength App: Dynamic Program Generator</h1>
      <div className="form-wrapper">
        <form className="form">
          <h2>Enter Your 1 Rep Max</h2>
          <div className="form-group">
            <label htmlFor="squat">Squat 1RM</label>
            <input id="squat" type="number" onChange={handleChange} placeholder="e.g., 315" />
          </div>
          <div className="form-group">
            <label htmlFor="bench">Bench Press 1RM</label>
            <input id="bench" type="number" onChange={handleChange} placeholder="e.g., 225" />
          </div>
          <div className="form-group">
            <label htmlFor="deadlift">Deadlift 1RM</label>
            <input id="deadlift" type="number" onChange={handleChange} placeholder="e.g., 405" />
          </div>
          <div className="form-group">
            <label htmlFor="press">Overhead Press 1RM</label>
            <input id="press" type="number" onChange={handleChange} placeholder="e.g., 135" />
          </div>
          <div className="form-group">
            <label htmlFor="clean">Clean & Jerk 1RM</label>
            <input id="clean" type="number" onChange={handleChange} placeholder="e.g., 205" />
          </div>
          <div className="form-group">
            <label htmlFor="snatch">Snatch 1RM</label>
            <input id="snatch" type="number" onChange={handleChange} placeholder="e.g., 155" />
          </div>

          <h2>Example Week - Auto Generated Loads</h2>
          <div className="form-group">
            <label>Squat (3x5 @ 75%)</label>
            <p>{calculateWeight(0.75, 'squat')}</p>
          </div>
          <div className="form-group">
            <label>Bench Press (4x6 @ 70%)</label>
            <p>{calculateWeight(0.7, 'bench')}</p>
          </div>
          <div className="form-group">
            <label>Deadlift (4x3 @ 85%)</label>
            <p>{calculateWeight(0.85, 'deadlift')}</p>
          </div>
          <div className="form-group">
            <label>Overhead Press (3x8 @ 65%)</label>
            <p>{calculateWeight(0.65, 'press')}</p>
          </div>
          <div className="form-group">
            <label>Clean and Jerk (3x2 @ 75%)</label>
            <p>{calculateWeight(0.75, 'clean')}</p>
          </div>
          <div className="form-group">
            <label>Snatch (4x2 @ 70%)</label>
            <p>{calculateWeight(0.7, 'snatch')}</p>
          </div>

          <button type="submit" className="submit-button">Generate Full Program</button>
        </form>
      </div>
    </div>
  );
};

export default App;