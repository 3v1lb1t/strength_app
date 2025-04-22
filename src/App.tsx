// App.tsx (enhanced with SugarWOD API, styled calendar, and localStorage persistence)
import React, { useEffect, useState } from 'react';
import './App.css';

const mainLifts = ['squat', 'bench', 'deadlift', 'press'];
const olympicLifts = ['clean', 'snatch'];
const accessoryPool: string[] = [
  'Overhead Press – 3x8 (barbell) @ light to moderate weight',
  'Dumbbell Bench Press – 3x12 @ light to moderate',
  'Incline Bench Press - 3x10 @ light to moderate',
  'Dumbbell Incline Bench - 3x10 @ light to moderate',
  'Chin-ups – 3xMax',
  'Pull-ups – 3xMax',
  'Renegade Rows – 3x10',
  'Russian Twists – 3x20',
  'Plate Overhead Lunge – 2x10/leg',
  'Goblet Squat – 3x12',
  'Bodyweight Dips – 3xMax',
  'Burpee to Renegade Row – 3x10',
  'Dumbbell Lunges – 3x12',
  'Kettlebell Front rack lunge 3x10',
  'Farmers Carry 3x100m',
  'Plank Rows – 3x10',
  'Overhead Plate Carry – 2x30s',
  'Push-ups – 3xMax',
  'Handstand Hold – 3x30sec',
  'Push Press – 3x8 @ moderate weight',
  'Behind Neck (BN) Push Press 3x8 @ moderate weight',
  'Snatch Balance – 5x3 @ light weight',
  'Push Jerk – 3x3 @ moderate weight ',
  'Split Jerk – 3x3 @ moderate weight',
  'L-Sit – 3x10sec',
  'Clean Pulls: 3x10 @ light/moderate weight',
  'Sumo Deadlift High Pulls 3x10 @ light weight',
  'Tabata Burpees 3 rounds',
  'Tabata Pushups 3 rounds'
];

const weeks: (
  | { week: number; type: 'base' | 'deload'; percent: number; reps: string }
  | { week: number; type: 'wave'; percents: number[]; reps: string[] }
)[] = [
  { week: 1, type: 'base', percent: 0.7, reps: '4x6' },
  { week: 2, type: 'base', percent: 0.75, reps: '4x5' },
  { week: 3, type: 'base', percent: 0.8, reps: '4x4' },
  { week: 4, type: 'wave', percents: [0.75, 0.77, 0.84, 0.87, 0.8, 0.75], reps: ['1x7', '1x5', '1x3', '1x3', '1x5', '1x7'] },
  { week: 5, type: 'base', percent: 0.82, reps: '3x3' },
  { week: 6, type: 'wave', percents: [0.77, 0.8, 0.86, 0.9, 0.82, 0.77], reps: ['1x7', '1x5', '1x3', '1x2', '1x4', '1x6'] },
  { week: 7, type: 'base', percent: 0.85, reps: '3x2' },
  { week: 8, type: 'deload', percent: 0.6, reps: '3x5' },
];

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
  const [completedDays, setCompletedDays] = useState<boolean[]>(() => {
    const saved = localStorage.getItem('completedDays');
    return saved ? JSON.parse(saved) : Array(7).fill(false);
  });
  const [wod, setWod] = useState<string>('');
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    fetch('https://api.sugarwod.com/v2/workouts?affiliate_id=demo', {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    })
      .then(res => res.json())
      .then(data => {
        const workout = data?.data?.[0]?.description || 'No WOD available.';
        setWod(workout);
      })
      .catch(() => setWod('Failed to fetch WOD.'));
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    (deferredPrompt as any).prompt();
    (deferredPrompt as any).userChoice.then(() => {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    });
  };

  const markDayComplete = () => {
    setCompletedDays((prev) => {
      const updated = [...prev];
      updated[currentDay % 7] = true;
      return updated;
    });
    setCurrentDay((prev) => prev + 1);
  };

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
      <div className="calendar-view">
        <h3>This Week</h3>
        <div className="calendar-row">
          {[...Array(7)].map((_, idx) => (
            <div
              key={idx}
              className={`calendar-day ${completedDays[idx] ? 'completed' : ''}`}
              onClick={() => setCurrentDay(idx)}
            >
              {`Day ${idx + 1}`}
            </div>
          ))}
        </div>
      </div>

      <h1 className="app-title">Strength App: Day {currentDay + 1} – {todayLabel}</h1>

      <div className="wod-section">
        <h2>Workout of the Day</h2>
        <p>{wod}</p>
      </div>

      <div className="form-wrapper">
        <form className="form">
          <h2>Enter Your 1 Rep Max</h2>
          {Object.keys(oneRepMax).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)} 1RM</label>
              <input
                id={key}
                type="number"
                className="small-input"
                onChange={handleChange}
                placeholder={`e.g., ${key === 'snatch' ? 155 : 225}`}
              />
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
            onClick={markDayComplete}
          >
            Complete Day
          </button>
        </form>
      </div>

      {showInstallButton && (
        <button onClick={handleInstallClick} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Install App
        </button>
      )}
    </div>
  );
};

export default App;
