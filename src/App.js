// Strength Program App (Clean UI + Daily View + Clickable Calendar with Phases)
import React, { useState } from 'react';
import './index.css';

const weeks = Array.from({ length: 8 }, (_, i) => i + 1);
const days = ["Day 1", "Day 2", "Day 3"];

const LIFT_INPUTS = [
  { key: 'squat', label: 'Back Squat 1RM' },
  { key: 'bench', label: 'Paused Bench Press 1RM' },
  { key: 'deadlift', label: 'Deadlift 1RM' },
  { key: 'clean', label: 'Power Clean 1RM' },
  { key: 'snatch', label: 'Power Snatch 1RM' }
];

const WAVE_SET_WEEK = 5;
const WAVE_SETS = [75, 77, 84, 87, 80, 75];
const OLY_PERCENTAGES = [0.7, 0.72, 0.74, 0.76, 0.78, 0.8, 0.82, 0.85];
const ACCESSORY_WORK = [
  "Pull-ups: 3x10",
  "Renegade Rows: 3x12",
  "Overhead Plate Lunge: 3x10 each leg",
  "Russian Twists: 3x30sec",
  "Dumbbell RDLs: 3x10"
];

export default function StrengthApp() {
  const [rms, setRms] = useState({ squat: 315, bench: 225, deadlift: 365, clean: 185, snatch: 135 });
  const [log, setLog] = useState({});
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [weekIdx, setWeekIdx] = useState(0);
  const [dayIdx, setDayIdx] = useState(0);
  const [completedDays, setCompletedDays] = useState([]);

  const updateRM = (lift, val) => setRms({ ...rms, [lift]: parseFloat(val || 0) });
  const formatWeight = (percent, rm) => Math.round(percent * rm);

  const runAssistant = async () => {
    setLoading(true);
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a strength coach." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    setResponse(data.choices?.[0]?.message?.content || "No response.");
    setLoading(false);
  };

  const currentWeek = weeks[weekIdx];
  const currentDay = days[dayIdx];
  const liftOrder = ["squat", "bench", "deadlift"];
  const mainLift = liftOrder[(currentWeek + dayIdx) % 3];
  const mainRM = rms[mainLift];
  const olympicLift = dayIdx === 0 ? "clean" : dayIdx === 1 ? "snatch" : null;
  const olympicRM = olympicLift ? rms[olympicLift] : 0;

  const handleCalendarClick = (w, d) => {
    setWeekIdx(w - 1);
    setDayIdx(d);
  };

  const nextDay = () => {
    const key = `${currentWeek}-${currentDay}`;
    setCompletedDays([...completedDays, key]);
    if (dayIdx < 2) {
      setDayIdx(dayIdx + 1);
    } else if (weekIdx < 7) {
      setWeekIdx(weekIdx + 1);
      setDayIdx(0);
    }
  };

  const getPhaseColor = (week) => {
    if (week < 3) return 'bg-blue-200'; // Base
    if (week < 5) return 'bg-yellow-200'; // Build
    if (week === 5) return 'bg-orange-200'; // Wave
    if (week < 8) return 'bg-red-200'; // Peak
    return 'bg-green-200'; // Test
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <div className="card">
        <div className="card-content">
          <h3 className="text-md font-semibold">Progress Calendar</h3>
          <div className="grid grid-cols-3 gap-2">
            {weeks.map(w => (
              <div key={w} className="border rounded p-2">
                <div className="font-semibold mb-1">Week {w}</div>
                <div className="flex flex-col gap-1">
                  {days.map((d, i) => {
                    const key = `${w}-${d}`;
                    const complete = completedDays.includes(key);
                    return (
                      <button
                        key={key}
                        className={`text-sm p-1 rounded ${getPhaseColor(w)} ${complete ? 'border border-green-600' : ''}`}
                        onClick={() => handleCalendarClick(w, i)}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-content">
          <h2 className="text-xl font-semibold mb-2">Enter Your 1RMs</h2>
          {LIFT_INPUTS.map(({ key, label }) => (
            <div key={key} className="mb-2">
              <label className="block text-sm font-medium">{label}</label>
              <input
                type="number"
                value={rms[key] || ''}
                onChange={e => updateRM(key, e.target.value)}
                className="input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-content space-y-2">
          <h3 className="text-lg font-semibold">Week {currentWeek} – {currentDay}</h3>
          <p><strong>Main Lift:</strong> {mainLift.toUpperCase()}</p>
          {currentWeek === WAVE_SET_WEEK ? (
            <p><strong>Wave Set Weights:</strong> {
              WAVE_SETS.map(p => `${p}%: ${formatWeight(p / 100, mainRM)} lbs`).join(" | ")
            }</p>
          ) : (
            <>
              <p><strong>Top Set:</strong> {formatWeight(0.75 + currentWeek * 0.015, mainRM)} lbs</p>
              <p><strong>Backoff Set:</strong> {formatWeight(0.7 + currentWeek * 0.01, mainRM)} lbs</p>
            </>
          )}
          {olympicLift && (
            <p><strong>{olympicLift.toUpperCase()}:</strong> {formatWeight(OLY_PERCENTAGES[currentWeek - 1], olympicRM)} lbs</p>
          )}

          <p><strong>Accessory Work:</strong></p>
          <ul className="list-disc list-inside">
            {ACCESSORY_WORK.map((work, i) => <li key={i}>{work}</li>)}
          </ul>

          <textarea
            placeholder="Notes / RPE / Reps Completed"
            value={log[`${currentWeek}-${currentDay}`] || ''}
            onChange={e => setLog({ ...log, [`${currentWeek}-${currentDay}`]: e.target.value })}
            className="textarea w-full mt-2"
          />

          <button className="btn mt-4" onClick={nextDay}>
            Mark Day as Completed ➡️
          </button>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-content space-y-2">
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          <textarea
            placeholder="Ask to generate a plan or modify a week..."
            className="textarea w-full"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <button className="btn" onClick={runAssistant} disabled={loading}>
            {loading ? "Thinking..." : "Generate Plan or Advice"}
          </button>
          {response && (
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{response}</pre>
          )}
        </div>
      </div>
    </div>
  );
}