import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/accessories', async (req, res) => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/exercises?type=strength&difficulty=beginner', {
      method: 'GET',
      headers: {
        'X-Api-Key': process.env.NINJA_API_KEY,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from API Ninjas' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});