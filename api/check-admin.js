const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://rashi:Rashi123@rashi.qn1zdi7.mongodb.net/?appName=rashi';

module.exports = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db('portfolio');
        
        const admins = await db.collection('admins').find().toArray();
        
        res.json({ 
            success: true, 
            count: admins.length,
            admins: admins.map(a => ({ email: a.email }))
        });
        
        await client.close();
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};
