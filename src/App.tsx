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

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;