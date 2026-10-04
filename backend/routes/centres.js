const express = require('express');
const { getDB } = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/centres - list all monitored training centres with optional filters
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { state, search, status } = req.query;
    const query = {};

    if (state && state !== 'All') {
      query.state = state;
    }
    if (status && status !== 'All') {
      query.compliance_status = status;
    }
    if (search) {
      query.$or = [
        { centre_id: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { affiliation: { $regex: search, $options: 'i' } },
      ];
    }

    const centres = await db.collection('centres').find(query).sort({ compliance_score: -1 }).toArray();
    res.json({ centres, count: centres.length });
  } catch (err) {
    console.error('Error fetching centres:', err);
    res.status(500).json({ error: 'Failed to fetch training centres.' });
  }
});

// GET /api/centres/:id - get single centre details with its batches and cameras
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const centre = await db.collection('centres').findOne({ centre_id: req.params.id });
    if (!centre) {
      return res.status(404).json({ error: 'Training centre not found.' });
    }

    // Get active batches for this centre
    const batches = await db.collection('batches').find({ centre_id: req.params.id }).toArray();
    // Get recent open alerts for this centre
    const alerts = await db.collection('alerts').find({ centre_id: req.params.id }).sort({ timestamp: -1 }).limit(10).toArray();
    // Get recent audits
    const audits = await db.collection('compliance_audits').find({ centre_id: req.params.id }).sort({ timestamp: -1 }).limit(5).toArray();

    res.json({ centre, batches, alerts, audits });
  } catch (err) {
    console.error('Error fetching centre detail:', err);
    res.status(500).json({ error: 'Failed to fetch centre details.' });
  }
});

// PATCH /api/centres/:id/geofence - update geofence configuration
router.patch('/:id/geofence', authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const { latitude, longitude, radius_meters } = req.body;
    const result = await db.collection('centres').updateOne(
      { centre_id: req.params.id },
      {
        $set: {
          'geofence.latitude': Number(latitude),
          'geofence.longitude': Number(longitude),
          'geofence.radius_meters': Number(radius_meters || 150),
          updated_at: new Date().toISOString(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Centre not found.' });
    }

    res.json({ message: 'Geofence updated successfully.' });
  } catch (err) {
    console.error('Error updating geofence:', err);
    res.status(500).json({ error: 'Failed to update geofence.' });
  }
});

module.exports = router;
