// App.tsx (Full Updated Script)
import React, { useEffect, useState } from 'react';
import './App.css';

const getRandomItems = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const mainLifts = ['squat', 'bench', 'deadlift', 'press'];
const olympicLifts = ['clean', 'snatch'];

const weeks = Array.from({ length: 9 }, (_, i) => {
  if (i === 8) return { week: 9, type: 'test', percent: 1.0, reps: '1x1' };
  if (i === 7) return { week: 8, type: 'deload', percent: 0.6, reps: '3x5' };

  const waveTemplate = [
    { percents: [0.75, 0.77, 0.84, 0.87, 0.8, 0.75], reps: ['1x7', '1x5', '1x3', '1x3', '1x5', '1x7'] },
    { percents: [0.77, 0.8, 0.86, 0.9, 0.82, 0.77], reps: ['1x7', '1x5', '1x3', '1x2', '1x4', '1x6'] }
  ];

  const baseWeeks = [
    { percent: 0.6, reps: '1x8 (30s rest)' },
    { percent: 0.7, reps: '4x6' },
    { percent: 0.75, reps: '4x5' },
    { percent: 0.8, reps: '4x4' },
    { percent: 0.82, reps: '3x3' },
    { percent: 0.85, reps: '3x3' },
    { percent: 0.9, reps: '3x2' },
    { percent: 0.94, reps: '3x1' },
    { percent: 0.97, reps: '2x1' }
  ];

  const shouldWave = i > 4 && Math.random() < 0.4 && i !== 6; // no back-to-back waves

  if (shouldWave && !weeks?.[i - 1]?.type?.includes('wave')) {
    const wave = waveTemplate[Math.floor(Math.random() * waveTemplate.length)];
    return { week: i + 1, type: 'wave', ...wave };
  }

  const base = baseWeeks[Math.min(i, baseWeeks.length - 1)];
  return { week: i + 1, type: 'base', ...base };
});

const App: React.FC = () => {
  const savedMainFocus = localStorage.getItem('mainFocusWeek');
  const savedOlyFocus = localStorage.getItem('olympicFocusWeek');
  const savedWeekIndex = localStorage.getItem('trainingWeek');

  const [mainFocus, setMainFocus] = useState<string>(() => savedMainFocus || getRandomItems(mainLifts, 1)[0]);
  const [olympicFocus, setOlympicFocus] = useState<string>(() => savedOlyFocus || getRandomItems(olympicLifts, 1)[0]);
  const [trainingWeek, setTrainingWeek] = useState<number>(() => savedWeekIndex ? parseInt(savedWeekIndex) : 0);
  const [completedDays, setCompletedDays] = useState<boolean[]>(() => {
    const saved = localStorage.getItem('completedDays');
    return saved ? JSON.parse(saved) : Array(7).fill(false);
  });

  const [currentDay, setCurrentDay] = useState<number>(() => {
    const savedDay = localStorage.getItem('currentDay');
    return savedDay ? parseInt(savedDay) : 0;
  });

  const savedOneRepMax = localStorage.getItem('oneRepMax');
  const [oneRepMax, setOneRepMax] = useState<Record<string, number>>(
    savedOneRepMax ? JSON.parse(savedOneRepMax) : {
      squat: 0, bench: 0, deadlift: 0, press: 0, clean: 0, snatch: 0,
    }
  );
  const [accessoryPool, setAccessoryPool] = useState<{ name: string; description: string; instructions: string; video?: string }[]>([]);

  useEffect(() => {
    fetch('./data/accessories.json')
      .then(res => res.json())
      .then(data => setAccessoryPool(data))
      .catch(err => console.error('Failed to load accessory data:', err));
  }, []);

  
  
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIOSTooltip, setShowIOSTooltip] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(() => !localStorage.getItem('disclaimerAccepted'));

  

  const [selectedAccessories, setSelectedAccessories] = useState<typeof accessoryPool>([]);

  useEffect(() => {
    if (accessoryPool.length > 0) {
      setSelectedAccessories(getRandomItems(accessoryPool, 3));
    }
  }, [accessoryPool]);
  

  

  
  
  const savedMainFocusSet = localStorage.getItem('mainFocusSet');
  const [mainFocusSet, setMainFocusSet] = useState<string[]>(() =>
    savedMainFocusSet ? JSON.parse(savedMainFocusSet) : getRandomItems(mainLifts.filter(l => l !== olympicFocus), 2)
  );
  const todayLabel = `${mainFocusSet.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(' & ')} Focus`;
  const week = weeks[trainingWeek % weeks.length];

  const calculateWeight = (percent: number, lift: string): string => `${Math.round(oneRepMax[lift] * percent)} lbs @ ${Math.round(percent * 100)}%`;

  const renderLift = (name: string, liftKey: string) => {
    if (week.type === 'test') {
      return (
        <div className="form-group">
          <label>{name} – Test 1RM</label>
          <input
            type="number"
            placeholder="Enter your tested 1RM"
            onChange={(e) => {
              const updated = { ...oneRepMax, [liftKey]: parseInt(e.target.value) || 0 };
              setOneRepMax(updated);
              localStorage.setItem('oneRepMax', JSON.stringify(updated));
            }}
            value={oneRepMax[liftKey] || ''}
          />
        </div>
      );
    }
    if (typeof week.percent !== 'number' || typeof week.reps !== 'string') return null;
    const backoff = (week.percent ?? 0) - 0.05;
    return (
      <div className="form-group">
        <label>{name} – {week.reps} @ {Math.round(week.percent * 100)}%</label>
        <p>Top Set: {calculateWeight(week.percent, liftKey)}</p>
        {week.reps.includes('rest') && (
          <p><em>Rest: {week.reps.split('(')[1].replace(')', '')}</em></p>
        )}
        <p>Backoff Sets: 2x{week.reps.split('x')[1]} @ {calculateWeight(backoff, liftKey)}</p>
      </div>
    );
  };

  return (
    <>
      {showIOSTooltip && (
        <div className="ios-tooltip">
          <strong>Install on iOS:</strong>
          <p style={{ margin: 0 }}>Tap the Share icon <span style={{ fontSize: '1.2em' }}>📤</span> and select <strong>"Add to Home Screen"</strong>.</p>
          <button onClick={() => setShowIOSTooltip(false)} style={{ marginTop: '0.5rem' }}>Close</button>
        </div>
      )}
      {showDisclaimerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Disclaimer</h2>
            <p>
              This app is not intended for beginners. Use at your own risk. Always consult a qualified coach or physician before beginning any training program. The developer assumes no responsibility for injury or harm resulting from use of this app.
            </p>
            <button onClick={() => {
              localStorage.setItem('disclaimerAccepted', 'true');
              setShowDisclaimerModal(false);
            }}>I Acknowledge</button>
          </div>
        </div>
      )}

      {!showDisclaimerModal && (
        <div className="app-container">
          <div className="calendar-view">
            <h3>This Week</h3>
            <div className="calendar-row">
              {[...Array(7)].map((_, idx) => {
                const today = new Date();
                const date = new Date(today);
                date.setDate(today.getDate() - today.getDay() + idx);
                const dayLabel = date.toLocaleDateString(undefined, { weekday: 'short' });
                const dateLabel = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                return (
                  <div
                    key={idx}
                    className={`calendar-day-square ${completedDays[idx] ? 'completed' : ''}`}
                    onClick={() => setCurrentDay(idx)}
                  >
                    <div>{dayLabel}</div>
                    <div>{dateLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <h1 className="app-title">Strength App: Day {currentDay + 1} – {todayLabel}</h1>

          

          <div className="form-wrapper">
            <form className="form">
              <h2>Enter Your 1 Rep Max</h2>
              <button
                type="button"
                className="reset-button"
                onClick={() => {
                  const cleared = {
                    squat: 0, bench: 0, deadlift: 0, press: 0, clean: 0, snatch: 0,
                  };
                  setOneRepMax(cleared);
                  localStorage.setItem('oneRepMax', JSON.stringify(cleared));
                }}
              >
                Reset 1RMs
              </button>
              {Object.keys(oneRepMax).map(key => (
                <div className="form-group" key={key}>
                  <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)} 1RM</label>
                  <input
                    id={key}
                    type="number"
                    className="small-input"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const { id, value } = e.target;
                    const updated = { ...oneRepMax, [id]: parseInt(value) || 0 };
                    setOneRepMax(updated);
                    localStorage.setItem('oneRepMax', JSON.stringify(updated));
                  }}
                    value={oneRepMax[key]}
                    placeholder={`e.g., ${key === 'snatch' ? 155 : 225}`}
                  />
                </div>
              ))}

              <h2>Main Movements</h2>
              {mainFocusSet.map((lift) => renderLift(lift, lift))}

              <h2>Olympic Movement</h2>
              {renderLift(olympicFocus, olympicFocus)}

              <h2>Accessory Work</h2>
              <ul>
                {selectedAccessories.map((acc, idx) => (
                  <AccessoryItem key={idx} accessory={acc} />
                ))}
              </ul>

              <button type="button" className="submit-button" onClick={() => {
                setCompletedDays(prev => {
                  const updated = [...prev];
                  updated[currentDay % 7] = true;
                  return updated;
                });
                setCurrentDay(prev => {
                  const next = prev + 1;
                  const newWeek = Math.floor(next / 7);
                  setTrainingWeek(newWeek);

                  const newMain = getRandomItems(mainLifts.filter(l => l !== mainFocus), 1)[0];
                  const newOly = getRandomItems(olympicLifts.filter(l => l !== olympicFocus), 1)[0];

                  const newMainSet = getRandomItems(mainLifts.filter(l => ![...mainFocusSet, newOly].includes(l)), 2);
                  setMainFocusSet(newMainSet);
                  setMainFocus(newMainSet[0]);
                  setOlympicFocus(newOly);

                  localStorage.setItem('mainFocusSet', JSON.stringify(newMainSet));
                  localStorage.setItem('mainFocusWeek', newMain);
                  localStorage.setItem('olympicFocusWeek', newOly);
                  localStorage.setItem('trainingWeek', newWeek.toString());

                  localStorage.setItem('currentDay', next.toString());
                  return next;
                });
              }}>
                Complete Day
              </button>
            </form>
          </div>

          {showInstallButton && (
            <button onClick={() => {
              if (!deferredPrompt) {
                setShowIOSTooltip(true);
                return;
              }
              (deferredPrompt as any).prompt();
              (deferredPrompt as any).userChoice.then(() => {
                setDeferredPrompt(null);
                setShowInstallButton(false);
              });
            }} style={{ position: 'fixed', bottom: 20, right: 20 }}>
              Install App
            </button>
          )}
        </div>
      )}
    </>
  );
};

const AccessoryItem: React.FC<{ accessory: { name: string; description: string; instructions: string; video?: string } }> = ({ accessory }) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <li>
      <strong>{accessory.name} – {accessory.description}</strong>
      <button
        type="button"
        onClick={() => setShowDetail(prev => !prev)}
        style={{ marginLeft: '0.5rem' }}
      >
        {showDetail ? 'Hide' : 'Show'} Instructions
      </button>
      {showDetail && (
        <div style={{ marginTop: '0.25rem' }}>
          <p>{accessory.instructions}</p>
          {accessory.video && (
            <a href={accessory.video} target="_blank" rel="noopener noreferrer">
              Watch Demo
            </a>
          )}
        </div>
      )}
    </li>
  );
};

export default App;
