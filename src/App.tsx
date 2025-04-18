// src/App.tsx
import React, { useState } from 'react';
import './App.css';

const weeks = [
  { week: 1, type: 'base', percent: 0.7, reps: '4x6' },
  { week: 2, type: 'base', percent: 0.75, reps: '4x5' },
  { week: 3, type: 'base', percent: 0.8, reps: '4x4' },
  { week: 4, type: 'wave', percents: [0.75, 0.77, 0.84, 0.87, 0.80, 0.75], reps: ['1x7', '1x5', '1x3', '1x3', '1x5', '1x7'] },
  { week: 5, type: 'base', percent: 0.82, reps: '3x3' },
  { week: 6, type: 'wave', percents: [0.77, 0.8, 0.86, 0.9, 0.82, 0.77], reps: ['1x7', '1x5', '1x3', '1x2', '1x4', '1x6'] },
  { week: 7, type: 'base', percent: 0.85, reps: '3x2' },
  { week: 8, type: 'deload', percent: 0.6, reps: '3x5' },
];

const App = () => {
  const [oneRepMax, setOneRepMax] = useState({
    squat: 0,
    bench: 0,
    deadlift: 0,
    press: 0,
    clean: 0,
    snatch: 0,
  });
  const [currentWeek, setCurrentWeek] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setOneRepMax({ ...oneRepMax, [id]: parseInt(value) || 0 });
  };

  const calculateWeight = (percent: number, lift: keyof typeof oneRepMax) => {
    return `${Math.round(oneRepMax[lift] * percent)} lbs @ ${percent * 100}%`;
  };

  const renderLift = (name: string, liftKey: keyof typeof oneRepMax) => {
    const week = weeks[currentWeek];
    if (
      week.type === 'wave' &&
      Array.isArray((week as any).percents) &&
      Array.isArray((week as any).reps)
    ) {
      return (
        <div className="form-group">
          <label>{name} (Wave Week)</label>
          {(week as any).percents.map((p: number, i: number) => (
            <p key={i}>{(week as any).reps[i]} – {calculateWeight(p, liftKey)}</p>
          ))}
        </div>
      );
    } else {
      if (typeof week.percent === 'number') {
      return (
        <div className="form-group">
          <label>{name} ({week.reps} @ {week.percent * 100}%)</label>
          <p>{calculateWeight(week.percent, liftKey)}</p>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          <label>{name} – Data not available for this week</label>
        </div>
      );
    }
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Strength App: Week {weeks[currentWeek].week} - {weeks[currentWeek].type.toUpperCase()}</h1>
      <div className="form-wrapper">
        <form className="form">
          <h2>Enter Your 1 Rep Max</h2>
          {Object.keys(oneRepMax).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)} 1RM</label>
              <input id={key} type="number" onChange={handleChange} placeholder={`e.g., ${key === 'snatch' ? 155 : 225}`}/>
            </div>
          ))}

          <h2>Main & Olympic Lifts</h2>
          {renderLift('Squat', 'squat')}
          {renderLift('Bench Press', 'bench')}
          {renderLift('Deadlift', 'deadlift')}
          {renderLift('Overhead Press', 'press')}
          {renderLift('Clean & Jerk', 'clean')}
          {renderLift('Snatch', 'snatch')}

          <h2>Accessory Work</h2>
          <ul>
            <li>Pull-ups – 3 sets to failure</li>
            <li>Renegade Rows – 3x10 reps (moderate DB)</li>
            <li>Russian Twists – 3x20 reps (light plate)</li>
            <li>Dumbbell Curls – 4x12 reps</li>
            <li>Bodyweight Dips – 3 sets to failure</li>
            <li>Burpee to Renegade Row – 3x10 reps</li>
            <li>Plate Overhead Lunge – 2x10 steps/leg</li>
          </ul>

          <button type="button" className="submit-button" onClick={() => setCurrentWeek((prev) => (prev + 1) % weeks.length)}>
            Next Week
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
