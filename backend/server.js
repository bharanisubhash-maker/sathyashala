require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');
const { generateKeyPair } = require('./utils/crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/centres', require('./routes/centres'));
app.use('/api/batches', require('./routes/batches'));
app.use('/api/compliance', require('./routes/compliance'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/analytics', require('./routes/analytics'));

// Root route
app.get('/', (req, res) => {
  res.json({
    project: 'VigiloSkill AI - Real-Time Monitoring of Training Centres for Attendance and Infrastructure Compliance',
    status: 'online',
    frontend: 'http://localhost:5173',
    version: '2.0.0-SIH',
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'VigiloSkill AI Compliance & Attendance Engine v2.0',
    ed25519_active: !!global.PUBLIC_KEY,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

// ── Start ────────────────────────────────────────────────────────────────────
async function start() {
  // Generate Ed25519 key pair for tamper-proof audit signing
  const { privateKey, publicKey } = generateKeyPair();
  global.PRIVATE_KEY = privateKey;
  global.PUBLIC_KEY = publicKey;
  console.log('🔑 Ed25519 cryptographic key pair generated for tamper-proof audit trails.');

  // Connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 VigiloSkill AI API server running on port ${PORT}`);
    console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
  });
}

start().catch(console.error);
