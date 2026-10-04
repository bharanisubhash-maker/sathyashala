const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { hashImage, hashRecord, signRecord, verifySignature } = require('../utils/crypto');

const router = express.Router();

// ── Image Upload Setup (saves to /uploads) ──────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${uuidv4()}.jpg`),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

// ── POST /api/tests  — Create a new test record ────────────────────────────
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const {
      kit_id = 'KIT-A',
      result,
      confidence,
      latitude,
      longitude,
      gps_accuracy_m,
      case_reference = '',
      classifier_version = '1.0.0',
    } = req.body;

    if (!result || !req.file) {
      return res.status(400).json({ error: 'result and image are required.' });
    }

    // Read image bytes → SHA-256 hash
    const imageBuffer = fs.readFileSync(req.file.path);
    const image_hash = hashImage(imageBuffer);

    const test_id = `TEST-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // Build canonical record (fields sorted for deterministic hashing)
    const recordCore = {
      app_version: '1.0.0',
      case_reference,
      classifier_version,
      confidence: parseFloat(confidence) || 0,
      gps_accuracy_m: parseFloat(gps_accuracy_m) || null,
      image_hash,
      kit_id,
      latitude: parseFloat(latitude) || null,
      longitude: parseFloat(longitude) || null,
      operator_id: req.user.operator_id,
      result: result.toUpperCase(),
      test_id,
      timestamp,
    };

    const record_hash = hashRecord(recordCore);

    // Digital signature using server key pair stored in process
    const signature = signRecord(record_hash, global.PRIVATE_KEY);

    const fullRecord = {
      ...recordCore,
      _id: uuidv4(),
      image_filename: req.file.filename,
      record_hash,
      signature,
      public_key_id: 'server-key-v1',
      created_at: new Date().toISOString(),
    };

    const db = getDB();
    await db.collection('tests').insertOne(fullRecord);

    // Write audit log
    await db.collection('audit_logs').insertOne({
      _id: uuidv4(),
      test_id,
      action: 'RECORD_CREATED',
      actor: req.user.operator_id,
      timestamp: new Date().toISOString(),
      integrity_check: 'PASSED',
    });

    res.status(201).json({
      message: 'Test record created successfully.',
      test_id,
      result: recordCore.result,
      confidence: recordCore.confidence,
      image_hash,
      record_hash,
      signature,
      timestamp,
    });
  } catch (err) {
    console.error('Create test error:', err);
    res.status(500).json({ error: 'Failed to create test record.' });
  }
});

// ── GET /api/tests  — List tests (with search & filter) ────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { result, search, page = 1, limit = 20 } = req.query;
    const db = getDB();

    // Officers only see their own tests; admins see all
    const query = {};
    if (req.user.role !== 'admin') query.operator_id = req.user.operator_id;
    if (result && result !== 'ALL') query.result = result.toUpperCase();
    if (search) {
      query.$or = [
        { test_id: { $regex: search, $options: 'i' } },
        { operator_id: { $regex: search, $options: 'i' } },
        { case_reference: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await db.collection('tests').countDocuments(query);
    const tests = await db
      .collection('tests')
      .find(query, { projection: { image_filename: 0, signature: 0 } })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    res.json({ tests, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tests.' });
  }
});

// ── GET /api/tests/stats  — Dashboard stats ────────────────────────────────
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const query = req.user.role !== 'admin' ? { operator_id: req.user.operator_id } : {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayQuery = { ...query, timestamp: { $gte: today.toISOString() } };

    const [total, positive, negative, inconclusive, todayTotal] = await Promise.all([
      db.collection('tests').countDocuments(query),
      db.collection('tests').countDocuments({ ...query, result: 'POSITIVE' }),
      db.collection('tests').countDocuments({ ...query, result: 'NEGATIVE' }),
      db.collection('tests').countDocuments({ ...query, result: 'INCONCLUSIVE' }),
      db.collection('tests').countDocuments(todayQuery),
    ]);

    res.json({ total, positive, negative, inconclusive, today: todayTotal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// ── GET /api/tests/:id  — Single test detail ───────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const test = await db.collection('tests').findOne({ test_id: req.params.id });
    if (!test) return res.status(404).json({ error: 'Test not found.' });

    // Officers can only view their own tests
    if (req.user.role !== 'admin' && test.operator_id !== req.user.operator_id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Log access
    await db.collection('audit_logs').insertOne({
      _id: uuidv4(),
      test_id: req.params.id,
      action: 'RECORD_VIEWED',
      actor: req.user.operator_id,
      timestamp: new Date().toISOString(),
    });

    res.json(test);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test.' });
  }
});

// ── GET /api/tests/:id/verify  — Cryptographic integrity check ─────────────
router.get('/:id/verify', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const test = await db.collection('tests').findOne({ test_id: req.params.id });
    if (!test) return res.status(404).json({ error: 'Test not found.' });

    // Rebuild canonical record (same fields used when signing)
    const recordCore = {
      app_version: test.app_version,
      case_reference: test.case_reference,
      classifier_version: test.classifier_version,
      confidence: test.confidence,
      gps_accuracy_m: test.gps_accuracy_m,
      image_hash: test.image_hash,
      kit_id: test.kit_id,
      latitude: test.latitude,
      longitude: test.longitude,
      operator_id: test.operator_id,
      result: test.result,
      test_id: test.test_id,
      timestamp: test.timestamp,
    };

    const recomputedRecordHash = hashRecord(recordCore);
    const recordHashMatch = recomputedRecordHash === test.record_hash;
    const signatureValid = verifySignature(test.record_hash, test.signature, global.PUBLIC_KEY);

    // Check image file on disk
    const imagePath = path.join(uploadDir, test.image_filename);
    let imageHashMatch = false;
    if (fs.existsSync(imagePath)) {
      const buffer = fs.readFileSync(imagePath);
      const recomputedImageHash = hashImage(buffer);
      imageHashMatch = recomputedImageHash === test.image_hash;
    }

    const overallStatus = recordHashMatch && signatureValid && imageHashMatch
      ? 'VERIFIED'
      : 'INTEGRITY_FAILED';

    res.json({
      test_id: req.params.id,
      record_hash_match: recordHashMatch,
      image_hash_match: imageHashMatch,
      signature_valid: signatureValid,
      overall_status: overallStatus,
      timestamp_present: !!test.timestamp,
      gps_present: !!(test.latitude && test.longitude),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// ── GET /api/tests/:id/image  — Serve test image ──────────────────────────
router.get('/:id/image', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const test = await db.collection('tests').findOne({ test_id: req.params.id });
    if (!test) return res.status(404).json({ error: 'Test not found.' });
    if (req.user.role !== 'admin' && test.operator_id !== req.user.operator_id) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    const imagePath = path.join(uploadDir, test.image_filename);
    if (!fs.existsSync(imagePath)) return res.status(404).json({ error: 'Image file not found.' });
    res.sendFile(imagePath);
  } catch (err) {
    res.status(500).json({ error: 'Failed to serve image.' });
  }
});

module.exports = router;
