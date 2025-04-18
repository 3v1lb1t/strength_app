// Starter React Web App for the 8-Week Strength Program with Olympic + Powerlifting + Chat Assistant
// Features:
// - User enters 1RMs (Squat, Bench, Deadlift, Clean, Snatch)
// - Auto-calculates weights per week, per lift
// - Tracks reps, RPE, and notes
// - Responsive for mobile use
// - GPT-powered assistant for generating new weeks or modifying plans

import React, { useState } from 'react';
import './index.css';

const weeks = Array.from({ length: 8 }, (_, i) => i + 1);

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

export default function StrengthApp() {
  const [rms, setRms] = useState({ squat: 315, bench: 225, deadlift: 365, clean: 185, snatch: 135 });
  const [log, setLog] = useState({});
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const updateRM = (lift, val) => setRms({ ...rms, [lift]: parseFloat(val || 0) });
  const formatWeight = (percent, rm) => Math.round(percent * rm);

  const runAssistant = async () => {
    setLoading(true);
    const systemPrompt = `You are a strength coach. Generate a strength training progression or modification.`;
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    setResponse(data.choices?.[0]?.message?.content || "No response.");
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <div className="card-content">
          <h2 className="text-xl font-semibold">Enter Your 1RMs</h2>
          {LIFT_INPUTS.map(({ key, label }) => (
            <input
              key={key}
              type="number"
              placeholder={label}
              value={rms[key] || ''}
              onChange={e => updateRM(key, e.target.value)}
              className="input"
            />
          ))}
        </div>
      </div>

      {weeks.map(week => (
        <div key={week}>
          <h2 className="text-lg font-bold mb-2">Week {week}</h2>
          {["Day 1", "Day 2", "Day 3"].map((day, idx) => {
            const liftOrder = ["squat", "bench", "deadlift"];
            const mainLift = liftOrder[(week + idx) % 3];
            const mainRM = rms[mainLift];
            const olympicLift = idx === 0 ? "clean" : idx === 1 ? "snatch" : null;
            const olympicRM = olympicLift ? rms[olympicLift] : 0;

            return (
              <div className="card mb-4" key={day}>
                <div className="card-content">
                  <h3 className="text-md font-semibold">{day}</h3>
                  <p><strong>Main Lift:</strong> {mainLift.toUpperCase()}</p>
                  {week === WAVE_SET_WEEK ? (
                    <p><strong>Wave Set Weights:</strong> {
                      WAVE_SETS.map(p => `${p}%: ${formatWeight(p / 100, mainRM)} lbs`).join(" | ")
                    }</p>
                  ) : (
                    <>
                      <p><strong>Top Set:</strong> {formatWeight(0.75 + week * 0.015, mainRM)} lbs</p>
                      <p><strong>Backoff Set:</strong> {formatWeight(0.7 + week * 0.01, mainRM)} lbs</p>
                    </>
                  )}
                  {olympicLift && (
                    <p><strong>{olympicLift.toUpperCase()}:</strong> {formatWeight(OLY_PERCENTAGES[week - 1], olympicRM)} lbs</p>
                  )}
                  <textarea
                    placeholder="Notes / RPE / Reps Completed"
                    value={log[`${week}-${day}`] || ''}
                    onChange={e => setLog({ ...log, [`${week}-${day}`]: e.target.value })}
                    className="textarea"
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="card mt-8">
        <div className="card-content space-y-2">
          <h3 className="text-lg font-semibold">AI Assistant (Program Generator)</h3>
          <textarea
            placeholder="Describe your goal, problem, or what you want to change..."
            className="textarea"
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
