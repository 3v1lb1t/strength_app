// src/App.tsx
import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1 className="app-title">Dark Themed React Template (No Tailwind)</h1>
      <div className="form-wrapper">
        <form className="form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Write something..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="squat">Back Squat</label>
            <input
              id="squat"
              type="text"
              placeholder="e.g., 5 sets of 3 reps at 80%"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bench">Bench Press</label>
            <input
              id="bench"
              type="text"
              placeholder="e.g., 4 sets of 5 reps at 75%"
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadlift">Deadlift</label>
            <input
              id="deadlift"
              type="text"
              placeholder="e.g., 3 sets of 4 reps at 85%"
            />
          </div>

          <div className="form-group">
            <label htmlFor="press">Overhead Press</label>
            <input
              id="press"
              type="text"
              placeholder="e.g., 5 sets of 2 reps at 90%"
            />
          </div>

          <h2 className="accessory-title">Accessory Work</h2>

          <div className="form-group">
            <label htmlFor="overhead-squat">Overhead Squat</label>
            <input
              id="overhead-squat"
              type="text"
              placeholder="e.g., 3 sets of 6 reps at 60%"
            />
          </div>

          <div className="form-group">
            <label htmlFor="plate-lunge">Plate Overhead Lunge</label>
            <input
              id="plate-lunge"
              type="text"
              placeholder="e.g., 2 rounds of 10 steps each leg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="clean-jerk">Clean and Jerk</label>
            <input
              id="clean-jerk"
              type="text"
              placeholder="e.g., 4 sets of 2 reps at 70%"
            />
          </div>

          <div className="form-group">
            <label htmlFor="burpee-row">Burpee to Renegade Row</label>
            <input
              id="burpee-row"
              type="text"
              placeholder="e.g., 3 rounds of 10 reps"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pullups">Pull-ups</label>
            <input
              id="pullups"
              type="text"
              placeholder="e.g., 3 sets to failure"
            />
          </div>

          <div className="form-group">
            <label htmlFor="renegade-rows">Renegade Rows</label>
            <input
              id="renegade-rows"
              type="text"
              placeholder="e.g., 3 sets of 10 reps"
            />
          </div>

          <div className="form-group">
            <label htmlFor="russian-twists">Russian Twists</label>
            <input
              id="russian-twists"
              type="text"
              placeholder="e.g., 3 rounds of 20 reps (10 each side)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="db-curls">Dumbbell Curls</label>
            <input
              id="db-curls"
              type="text"
              placeholder="e.g., 4 sets of 12 reps"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bodyweight-dips">Bodyweight Dips</label>
            <input
              id="bodyweight-dips"
              type="text"
              placeholder="e.g., 3 sets to failure"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
