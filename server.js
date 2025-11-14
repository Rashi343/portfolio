const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Auth API
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        
        const admin = await db.collection('admins').findOne({ email, password: hashedPassword });
        
        if (admin) {
            res.json({ success: true, token: hashedPassword });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MongoDB setup
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://rashi:Rashi123@rashi.qn1zdi7.mongodb.net/portfolio?retryWrites=true&w=majority';
const client = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('portfolio');
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

connectDB();

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    next();
}

// Projects API
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await db.collection('projects').find().toArray();
        res.json(projects.map(p => ({ ...p, id: p._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const result = await db.collection('projects').insertOne(req.body);
        res.json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        await db.collection('projects').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        await db.collection('projects').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Skills API
app.get('/api/skills', async (req, res) => {
    try {
        const skills = await db.collection('skills').find().toArray();
        const grouped = skills.reduce((acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push({ id: skill._id, name: skill.name });
            return acc;
        }, {});
        res.json(grouped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/skills', async (req, res) => {
    try {
        const result = await db.collection('skills').insertOne(req.body);
        res.json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/skills/:id', async (req, res) => {
    try {
        await db.collection('skills').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Messages API
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await db.collection('messages').find().sort({ date: -1 }).toArray();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const data = { ...req.body, date: new Date().toISOString() };
        const result = await db.collection('messages').insertOne(data);
        res.json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Settings API
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await db.collection('settings').findOne({ _id: 'main' });
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        await db.collection('settings').updateOne(
            { _id: 'main' },
            { $set: req.body },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// About API
app.get('/api/about', async (req, res) => {
    try {
        const about = await db.collection('about').findOne({ _id: 'main' });
        res.json(about || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/about', async (req, res) => {
    try {
        await db.collection('about').updateOne(
            { _id: 'main' },
            { $set: req.body },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
