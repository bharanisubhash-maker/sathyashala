const { MongoClient } = require('mongodb');

let db;
let client;

async function connectDB() {
  if (db) return db;
  try {
    const mongoUri = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    client = await MongoClient.connect(mongoUri);
    // Use database named vigiloskill
    db = client.db('vigiloskill');
    console.log('✅ Connected to MongoDB: vigiloskill');

    // Create indexes for efficient queries
    await db.collection('centres').createIndex({ centre_id: 1 }, { unique: true });
    await db.collection('centres').createIndex({ state: 1 });
    await db.collection('centres').createIndex({ compliance_score: -1 });

    await db.collection('batches').createIndex({ batch_id: 1 }, { unique: true });
    await db.collection('batches').createIndex({ centre_id: 1 });
    await db.collection('batches').createIndex({ status: 1 });

    await db.collection('alerts').createIndex({ alert_id: 1 }, { unique: true });
    await db.collection('alerts').createIndex({ centre_id: 1 });
    await db.collection('alerts').createIndex({ severity: 1 });
    await db.collection('alerts').createIndex({ status: 1 });
    await db.collection('alerts').createIndex({ timestamp: -1 });

    await db.collection('compliance_audits').createIndex({ audit_id: 1 }, { unique: true });
    await db.collection('compliance_audits').createIndex({ centre_id: 1 });
    await db.collection('compliance_audits').createIndex({ timestamp: -1 });

    await db.collection('users').createIndex({ operator_id: 1 }, { unique: true });

    return db;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    // Don't exit immediately in case of transient local issues; allow in-memory fallback if needed
    throw err;
  }
}

function getDB() {
  if (!db) throw new Error('Database not initialized. Call connectDB() first.');
  return db;
}

module.exports = { connectDB, getDB };
