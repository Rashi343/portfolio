const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const MONGO_URI = 'mongodb+srv://rashi:Rashi123@rashi.qn1zdi7.mongodb.net/?appName=rashi';
const client = new MongoClient(MONGO_URI);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await client.connect();
        const db = client.db('portfolio');
        
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
};
