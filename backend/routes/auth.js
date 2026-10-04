const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register  (admin creates officers)
router.post('/register', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, operator_id, password, role = 'officer' } = req.body;
    if (!name || !operator_id || !password) {
      return res.status(400).json({ error: 'name, operator_id and password are required.' });
    }

    const db = getDB();
    const existing = await db.collection('users').findOne({ operator_id });
    if (existing) return res.status(409).json({ error: 'Operator ID already exists.' });

    const password_hash = await bcrypt.hash(password, 12);
    const user = {
      _id: uuidv4(),
      operator_id,
      name,
      role,
      password_hash,
      created_at: new Date().toISOString(),
    };

    await db.collection('users').insertOne(user);
    res.status(201).json({ message: 'Officer registered successfully.', operator_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { operator_id, password } = req.body;
    if (!operator_id || !password) {
      return res.status(400).json({ error: 'operator_id and password are required.' });
    }

    const db = getDB();
    const user = await db.collection('users').findOne({ operator_id });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign(
      { operator_id: user.operator_id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: { operator_id: user.operator_id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// GET /api/auth/me  — verify token & get current user
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// GET /api/auth/users  — admin: list all officers
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const db = getDB();
    const users = await db
      .collection('users')
      .find({}, { projection: { password_hash: 0 } })
      .toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

module.exports = router;
