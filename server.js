const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data
let scores = [

];

// GET scores (with optional week filter)
app.get('/scores', (req, res) => {
    const week = req.query.week;

    if (week) {
        const filtered = scores.filter(score => String(score.week) === String(week));
        return res.json(filtered);
    }

    res.json(scores);
});

// POST a new score
app.post('/scores', (req, res) => {
    const { name, course, score, week } = req.body;

    if (!name || !course || !score || !week) {
        return res.status(400).json({ error: 'Please include name, course, score, and week' });
    }

    scores.push({ name, course, score, week });
    res.json({ message: 'Score added!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
