const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://rashi:Rashi123@rashi.qn1zdi7.mongodb.net/portfolio?retryWrites=true&w=majority';
let cachedClient = null;
let db;

async function connectToDatabase() {
    if (cachedClient && db) {
        return db;
    }
    const client = new MongoClient(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
    await client.connect();
    cachedClient = client;
    db = client.db('portfolio');
    return db;
}

// Auth API - must be before other routes
app.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { email, password } = req.body;
        const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex');
        
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

// Route handlers
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/../admin.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/../login.html');
});

// Projects API
app.get('/api/projects', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const projects = await db.collection('projects').find().toArray();
        res.json(projects.map(p => ({ ...p, id: p._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const result = await db.collection('projects').insertOne(req.body);
        res.json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
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
        const db = await connectToDatabase();
        await db.collection('projects').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Skills API
app.get('/api/skills', async (req, res) => {
    try {
        const db = await connectToDatabase();
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
        const db = await connectToDatabase();
        const result = await db.collection('skills').insertOne(req.body);
        res.json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/skills/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        await db.collection('skills').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Messages API
app.get('/api/messages', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const messages = await db.collection('messages').find().sort({ date: -1 }).toArray();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const db = await connectToDatabase();
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
        const db = await connectToDatabase();
        const settings = await db.collection('settings').findOne({ _id: 'main' });
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const db = await connectToDatabase();
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
        const db = await connectToDatabase();
        const about = await db.collection('about').findOne({ _id: 'main' });
        res.json(about || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/about', async (req, res) => {
    try {
        const db = await connectToDatabase();
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

module.exports = app;
