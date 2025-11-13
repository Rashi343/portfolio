const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb+srv://rashi:Rashi123@rashi.qn1zdi7.mongodb.net/portfolio?retryWrites=true&w=majority';

module.exports = async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
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
