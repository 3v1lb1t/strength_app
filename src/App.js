// Strength Program App (Restored UI + Calendar + Dark Theme)
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "./components/ui/card.tsx";
import { Button } from "./components/ui/button.tsx";
import { Textarea } from "./components/ui/textarea.tsx";
import { Input } from "./components/ui/input.tsx";
import { BadgeCheck, Dumbbell, ArrowBigRight, Brain, Flame, Hand } from 'lucide-react';
import './index.css';
//import { motion } from 'framer-motion';

const weeks = Array.from({ length: 8 }, (_, i) => i + 1);
const days = ["Day 1", "Day 2", "Day 3"];

const LIFT_INPUTS = [
  { key: 'squat', label: 'Back Squat 1RM' },
  { key: 'bench', label: 'Paused Bench Press 1RM' },
  { key: 'deadlift', label: 'Deadlift 1RM' },
  { key: 'clean', label: 'Power Clean 1RM' },
  { key: 'snatch', label: 'Power Snatch 1RM' },
  { key: 'overhead', label: 'Overhead Press 1RM' }
];

const WAVE_SET_WEEK = 5;
const WAVE_SETS = [75, 77, 84, 87, 80, 75];
const OLY_PERCENTAGES = [0.7, 0.72, 0.74, 0.76, 0.78, 0.8, 0.82, 0.85];

const getAccessoryWork = (week, dayIdx) => {
  const upper = ["Push-ups: 3x20", "Chin-ups: 3xMax", "Dumbbell Bench Press: 3x12", "Arnold Press: 3x10", "Bent-over Rows (Barbell): 3x10"];
  const lower = ["Goblet Squats: 3x15", "Walking Lunges: 3x12 each leg", "Bulgarian Split Squat: 3x8", "Dumbbell Step-ups: 3x10 each leg", "Barbell Hip Thrusts: 3x12"];
  const core = ["Plank: 3x30s", "V-ups: 3x15", "Hanging Knee Raises: 3x12", "Russian Twists (plate): 3x20", "Barbell Rollouts: 3x10"];
  const cardio = ["Jump Rope: 3x1min", "Burpees: 3x10", "Mountain Climbers: 3x30s", "Jump Squats: 3x12", "Farmer's Carry (Dumbbells): 3x40ft"];
  const overhead = ["Overhead Press (Barbell): 3x8", "Z Press: 3x8", "Push Press: 3x10", "Plate Raise: 3x12", "Handstand Hold: 3x30s"];

  const groups = [upper, lower, core, cardio, overhead];
  const icons = [<Dumbbell />, <ArrowBigRight />, <Brain />, <Flame />, <Hand />];
  const seed = Date.now() + week * 3 + dayIdx;
  const rng = seed % 100;
  const accessories = [];

  for (let i = 0; i < 2; i++) {
    const index = (rng + i) % groups.length;
    const group = groups[index];
    const exercise = group[(rng + week + i * 2) % group.length];
    accessories.push({ text: exercise, icon: icons[index] });
  }
  return accessories;
};

export default function StrengthApp() {
  const [rms, setRms] = useState({ squat: 315, bench: 225, deadlift: 365, clean: 185, snatch: 135, overhead: 135 });
  const [log, setLog] = useState({});
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [weekIdx, setWeekIdx] = useState(0);
  const [dayIdx, setDayIdx] = useState(0);
  const [completedDays, setCompletedDays] = useState([]);
  const [accessories, setAccessories] = useState([]);

  const currentWeek = weeks[weekIdx];
  const currentDay = days[dayIdx];
  const liftOrder = ["squat", "bench", "deadlift", "overhead"];
  const mainLift = liftOrder[(currentWeek + dayIdx) % liftOrder.length];
  const mainRM = rms[mainLift];
  const olympicLift = dayIdx === 0 ? "clean" : dayIdx === 1 ? "snatch" : null;
  const olympicRM = olympicLift ? rms[olympicLift] : 0;

  useEffect(() => {
    setAccessories(getAccessoryWork(currentWeek, dayIdx));
  }, [weekIdx, dayIdx]);

  const updateRM = (lift, val) => setRms({ ...rms, [lift]: parseFloat(val || 0) });
  const formatWeight = (percent, rm) => Math.round(percent * rm);

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
    if (week < 3) return 'bg-blue-900';
    if (week < 5) return 'bg-yellow-700';
    if (week === 5) return 'bg-orange-700';
    if (week < 8) return 'bg-red-700';
    return 'bg-green-700';
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 bg-black text-white min-h-screen">
      <Card>
        <CardHeader className="text-xl font-bold">Enter Your 1RMs</CardHeader>
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
                    className={`text-sm p-1 rounded ${getPhaseColor(w)} ${complete ? 'border border-green-500' : ''}`}
                    onClick={() => {
                      setWeekIdx(w - 1);
                      setDayIdx(i);
                    }}
                  >{d}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="text-xl font-semibold">Week {currentWeek} – {currentDay}</CardHeader>
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

          <p className="font-semibold mt-4">Accessory Work</p>
          <ul className="list-disc list-inside text-sm">
            {accessories.map((item, i) => (
              <li key={i} className="flex items-center gap-2">{item.icon}<span>{item.text}</span></li>
            ))}
          </ul>

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
    </div>
  );
}
