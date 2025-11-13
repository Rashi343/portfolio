const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const MONGO_URI = 'mongodb+srv://rashi:Rashi123@rashi.qn1zdi7.mongodb.net/portfolio?retryWrites=true&w=majority';

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }
    const client = new MongoClient(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
    await client.connect();
    cachedClient = client;
    return client;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db('portfolio');
        
        const { email, password } = req.body;
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        
        const admin = await db.collection('admins').findOne({ email, password: hashedPassword });
        
        if (admin) {
            return res.status(200).json({ success: true, token: hashedPassword });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};
