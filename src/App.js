// Strength Program App (Visual Refresh with ShadCN + Tailwind Enhancements)
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BadgeCheck, Dumbbell } from 'lucide-react';
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

const getAccessoryWork = (week, dayIdx) => {
  const upper = [
    "Push-ups: 3x20",
    "Chin-ups: 3xMax",
    "Dumbbell Bench Press: 3x12",
    "Arnold Press: 3x10",
    "Bent-over Rows (Barbell): 3x10"
  ];
  const lower = [
    "Goblet Squats: 3x15",
    "Walking Lunges: 3x12 each leg",
    "Bulgarian Split Squat: 3x8",
    "Dumbbell Step-ups: 3x10 each leg",
    "Barbell Hip Thrusts: 3x12"
  ];
  const core = [
    "Plank: 3x30s",
    "V-ups: 3x15",
    "Hanging Knee Raises: 3x12",
    "Russian Twists (plate): 3x20",
    "Barbell Rollouts: 3x10"
  ];
  const cardio = [
    "Jump Rope: 3x1min",
    "Burpees: 3x10",
    "Mountain Climbers: 3x30s",
    "Jump Squats: 3x12",
    "Farmer's Carry (Dumbbells): 3x40ft"
  ];

  const groups = [upper, lower, core, cardio];
  const seed = (week * 3 + dayIdx) % groups.length;
  const accessories = [];

  for (let i = 0; i < 2; i++) {
    const group = groups[(seed + i) % groups.length];
    const exercise = group[(week + dayIdx + i * 3) % group.length];
    accessories.push(exercise);
  }

  return accessories;
};

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

  const weeks = Array.from({ length: 8 }, (_, i) => i + 1);
  const days = ["Day 1", "Day 2", "Day 3"];
  const currentWeek = weeks[weekIdx];
  const currentDay = days[dayIdx];
  const liftOrder = ["squat", "bench", "deadlift"];
  const mainLift = liftOrder[(currentWeek + dayIdx) % 3];
  const mainRM = rms[mainLift];
  const olympicLift = dayIdx === 0 ? "clean" : dayIdx === 1 ? "snatch" : null;
  const olympicRM = olympicLift ? rms[olympicLift] : 0;
  const accessories = getAccessoryWork(currentWeek, dayIdx);

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
    if (week < 3) return 'bg-blue-200';
    if (week < 5) return 'bg-yellow-200';
    if (week === 5) return 'bg-orange-200';
    if (week < 8) return 'bg-red-200';
    return 'bg-green-200';
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-xl font-bold">Progress Calendar</CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-xl font-semibold">Enter Your 1RMs</CardHeader>
        <CardContent className="grid gap-3">
          {LIFT_INPUTS.map(({ key, label }) => (
            <div key={key} className="grid gap-1">
              <label className="text-sm font-medium">{label}</label>
              <Input
                type="number"
                value={rms[key] || ''}
                onChange={e => updateRM(key, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-xl font-semibold flex items-center gap-2">
          <Dumbbell className="w-5 h-5" /> Week {currentWeek} – {currentDay}
        </CardHeader>
        <CardContent className="space-y-2">
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
          <div>
            <p className="font-semibold mt-4">Accessory Work</p>
            <ul className="list-disc list-inside text-sm">
              {accessories.map((work, i) => <li key={i}>{work}</li>)}
            </ul>
          </div>
          <Textarea
            placeholder="Notes / RPE / Reps Completed"
            value={log[`${currentWeek}-${currentDay}`] || ''}
            onChange={e => setLog({ ...log, [`${currentWeek}-${currentDay}`]: e.target.value })}
          />
          <Button onClick={nextDay} className="mt-2 w-full">
            <BadgeCheck className="mr-2 h-4 w-4" /> Mark Day as Completed
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-xl font-semibold">AI Assistant</CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder="Ask to generate a plan or modify a week..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <Button onClick={runAssistant} disabled={loading}>
            {loading ? "Thinking..." : "Generate Plan or Advice"}
          </Button>
          {response && (
            <pre className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">{response}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
