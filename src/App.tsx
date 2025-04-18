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

          <h2>Main and Olympic Lifts - Auto Generated Loads</h2>
          <div className="form-group">
            <label>Squat (Wave: 1x7@75%, 1x5@77%, 1x3@84%, 1x3@87%, 1x5@80%, 1x7@75%)</label>
            <p>{calculateWeight(0.75, 'squat')}, {calculateWeight(0.77, 'squat')}, {calculateWeight(0.84, 'squat')}, {calculateWeight(0.87, 'squat')}, {calculateWeight(0.80, 'squat')}, {calculateWeight(0.75, 'squat')}</p>
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
            <label>Power Clean (3x3 @ 70%)</label>
            <p>{calculateWeight(0.7, 'clean')}</p>
          </div>
          <div className="form-group">
            <label>Squat Clean (3x2 @ 80%)</label>
            <p>{calculateWeight(0.8, 'clean')}</p>
          </div>
          <div className="form-group">
            <label>Power Snatch (4x3 @ 65%)</label>
            <p>{calculateWeight(0.65, 'snatch')}</p>
          </div>
          <div className="form-group">
            <label>Squat Snatch (3x2 @ 75%)</label>
            <p>{calculateWeight(0.75, 'snatch')}</p>
          </div>

          <h2>Accessory Work (Fixed Reps & Weight Guidance)</h2>
          <div className="form-group">
            <label>Pull-ups</label>
            <p>3 sets to failure, bodyweight</p>
          </div>
          <div className="form-group">
            <label>Renegade Rows</label>
            <p>3 sets of 10 reps, moderate dumbbells</p>
          </div>
          <div className="form-group">
            <label>Russian Twists</label>
            <p>3 sets of 20 reps, light plate or med ball</p>
          </div>
          <div className="form-group">
            <label>Dumbbell Curls</label>
            <p>4 sets of 12 reps, moderate dumbbells</p>
          </div>
          <div className="form-group">
            <label>Bodyweight Dips</label>
            <p>3 sets to failure</p>
          </div>
          <div className="form-group">
            <label>Burpee to Renegade Row</label>
            <p>3 rounds of 10 reps, light dumbbells</p>
          </div>
          <div className="form-group">
            <label>Plate Overhead Lunge</label>
            <p>2 rounds of 10 steps per leg, 25-45 lb plate</p>
          </div>
          <div className="form-group">
            <label>Overhead Squat</label>
            <p>3 rounds of 6 at moderate weight</p>
          </div>

          <button type="submit" className="submit-button">Generate Full Program</button>
        </form>
      </div>
    </div>
  );
};

export default App;