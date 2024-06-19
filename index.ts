import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const dbPath = path.resolve(__dirname, 'db.json');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initialize the database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
}

// GET /ping
app.get('/ping', (req, res) => {
    res.json(true);
});

// POST /submit
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const newSubmission = { name, email, phone, github_link, stopwatch_time };

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    db.push(newSubmission);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    res.status(201).json({ message: 'Submission saved successfully' });
});

// GET /read
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    if (isNaN(index) || index < 0 || index >= db.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    res.json(db[index]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
