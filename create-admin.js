const { MongoClient } = require('mongodb');
const readline = require('readline');
const crypto = require('crypto');

const MONGO_URI = 'mongodb+srv://rashi:Rashi123@rashi.qn1zdi7.mongodb.net/?appName=rashi';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function createAdmin() {
    const client = new MongoClient(MONGO_URI);
    
    try {
        await client.connect();
        const db = client.db('portfolio');
        
        const email = await question('Email: ');
        const password = await question('Password: ');
        
        const hashedPassword = hashPassword(password);
        
        await db.collection('admins').updateOne(
            { email },
            { $set: { email, password: hashedPassword } },
            { upsert: true }
        );
        
        console.log('\n✓ Admin user created successfully!');
        console.log(`Email: ${email}`);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        rl.close();
        await client.close();
    }
}

createAdmin();
