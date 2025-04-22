// src/App.tsx
import React, { useState } from 'react';
import './App.css';

type Week =
  | { week: number; type: 'base' | 'deload'; percent: number; reps: string }
  | { week: number; type: 'wave'; percents: number[]; reps: string[] };

const weeks: Week[] = [
  { week: 1, type: 'base', percent: 0.7, reps: '4x6' },
  { week: 2, type: 'base', percent: 0.75, reps: '4x5' },
  { week: 3, type: 'base', percent: 0.8, reps: '4x4' },
  { week: 4, type: 'wave', percents: [0.75, 0.77, 0.84, 0.87, 0.8, 0.75], reps: ['1x7', '1x5', '1x3', '1x3', '1x5', '1x7'] },
  { week: 5, type: 'base', percent: 0.82, reps: '3x3' },
  { week: 6, type: 'wave', percents: [0.77, 0.8, 0.86, 0.9, 0.82, 0.77], reps: ['1x7', '1x5', '1x3', '1x2', '1x4', '1x6'] },
  { week: 7, type: 'base', percent: 0.85, reps: '3x2' },
  { week: 8, type: 'deload', percent: 0.6, reps: '3x5' },
];

const accessoryPool: string[] = [
  'Overhead Press – 3x8 (barbell)',
  'Dumbbell Bench Press – 3x12',
  'Chin-ups – 3xMax',
  'Pull-ups – 3xMax',
  'Renegade Rows – 3x10',
  'Russian Twists – 3x20',
  'Plate Overhead Lunge – 2x10/leg',
  'Goblet Squat – 3x12',
  'Bodyweight Dips – 3xMax',
  'Burpee to Renegade Row – 3x10',
  'Dumbbell Lunges – 3x12',
  'Plank Rows – 3x10',
  'Overhead Plate Carry – 2x30s',
  'Push-ups – 3xMax',
  'Dumbbell Bench Press - 3x8',
  'Handstand Hold - 3x30sec',
  'Push Press - 3x8 @ moderate weight',
  'Snatch Balance - 5x3 @ light weight',
  'Push Jerk - 3x3 @ moderate weight ',
  'Split Jerk - 3x3 @ moderate weight',
  'L-Sit - 3x10sec'
];

const mainLifts = ['squat', 'bench', 'deadlift', 'press'];
const olympicLifts = ['clean', 'snatch'];

const App: React.FC = () => {
  const [oneRepMax, setOneRepMax] = useState<Record<string, number>>({
    squat: 0,
    bench: 0,
    deadlift: 0,
    press: 0,
    clean: 0,
    snatch: 0,
  });

  const [currentDay, setCurrentDay] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setOneRepMax({ ...oneRepMax, [id]: parseInt(value) || 0 });
  };

  const calculateWeight = (percent: number, lift: string): string => {
    return `${Math.round(oneRepMax[lift] * percent)} lbs @ ${Math.round(percent * 100)}%`;
  };

  const renderLift = (name: string, liftKey: string) => {
    const week = weeks[currentDay % weeks.length];

    if (week.type === 'wave') {
      return (
        <div className="form-group">
          <label>{name} – Wave Week</label>
          <ul>
            {accessories.map((acc, idx) => (
              <li key={idx}>{acc}</li>
            ))}
          </ul>
        </div>
      );
    }

    const backoffPercent = week.percent - 0.05;
    return (
      <div className="form-group">
        <label>{name} – {week.reps} @ {Math.round(week.percent * 100)}%</label>
        <p>Top Set: {calculateWeight(week.percent, liftKey)}</p>
        <p>Backoff Sets: 2x{week.reps.split('x')[1]} @ {calculateWeight(backoffPercent, liftKey)}</p>
      </div>
    );
  };

  const getRandomItems = (arr: string[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const mainFocus = mainLifts[currentDay % mainLifts.length];
const olympicFocus = olympicLifts[currentDay % olympicLifts.length];
const accessories = getRandomItems(accessoryPool, 3);
const todayLabel = `${mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1)} Focus`;

  return (
    <div className="app-container">
      <h1 className="app-title">Strength App: Day {currentDay + 1} – {todayLabel}</h1>
      <div className="form-wrapper">
        <form className="form">
          <h2>Enter Your 1 Rep Max</h2>
          {Object.keys(oneRepMax).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)} 1RM</label>
              <input id={key} type="number" onChange={handleChange} placeholder={`e.g., ${key === 'snatch' ? 155 : 225}`} />
            </div>
          ))}

          <h2>Main Movement</h2>
          {renderLift(mainFocus.charAt(0).toUpperCase() + mainFocus.slice(1), mainFocus)}

          <h2>Olympic Movement</h2>
          {renderLift(olympicFocus.charAt(0).toUpperCase() + olympicFocus.slice(1), olympicFocus)}

          <h2>Accessory Work</h2>
          <ul>
            {accessories.map((acc, idx) => (
              <li key={idx}>{acc}</li>
            ))}
          </ul>

          <button
            type="button"
            className="submit-button"
            onClick={() => setCurrentDay((prev) => prev + 1)}
          >
            Next Day
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
