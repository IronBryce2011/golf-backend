import express, { json } from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(json());

// GET scores (with optional week filter)
app.get('/scores', async (req, res) => {
  const week = req.query.week;

  try {
    let query = `SELECT * FROM golf_data`;
    const params = [];

    if (week) {
      query += ' WHERE week = $1';
      params.push(week);
    }

    query += ' ORDER BY team';

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching scores:', err.message);
    res.status(500).json({ error: 'Server error fetching scores' });
  }
});

// POST new team score (single team per row)
app.post('/scores', async (req, res) => {
  const { course, week, team, scores } = req.body;

  if (!course || !week || !team || !scores || scores.length !== 9) {
    return res.status(400).json({ error: 'Please include course, week, team name, and 9 hole scores' });
  }

  try {
    const totalScore = scores.reduce((a, b) => a + Number(b), 0);

    await pool.query(
      `INSERT INTO golf_data
       (team, course, week, score, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9)
       VALUES
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [team, course, week, totalScore, ...scores.map(Number)]
    );

    res.json({ message: 'Team score added!' });
  } catch (err) {
    console.error('Error adding score:', err.message);
    res.status(500).json({ error: 'Server error adding score' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
