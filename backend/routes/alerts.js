const express = require('express');
const { getDB } = require('../db');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// GET /api/alerts - list alerts with optional filters
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { severity, status, centre_id, limit = 50 } = req.query;
    const query = {};

    if (severity && severity !== 'ALL') query.severity = severity;
    if (status && status !== 'ALL') query.status = status;
    if (centre_id) query.centre_id = centre_id;

    const alerts = await db.collection('alerts')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .toArray();

    // Summary counts
    const criticalCount = await db.collection('alerts').countDocuments({ status: 'OPEN', severity: 'CRITICAL' });
    const highCount = await db.collection('alerts').countDocuments({ status: 'OPEN', severity: 'HIGH' });
    const mediumCount = await db.collection('alerts').countDocuments({ status: 'OPEN', severity: 'MEDIUM' });

    res.json({
      alerts,
      total: alerts.length,
      counts: {
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        total_open: criticalCount + highCount + mediumCount,
      }
    });
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: 'Failed to fetch alerts.' });
  }
});

// PATCH /api/alerts/:id/status - resolve or update an alert
router.patch('/:id/status', async (req, res) => {
  try {
    const db = getDB();
    const { status, action_taken, resolution_note } = req.body;

    const result = await db.collection('alerts').updateOne(
      { alert_id: req.params.id },
      {
        $set: {
          status: status || 'RESOLVED',
          action_taken: action_taken || 'Show Cause Notice Issued',
          resolution_note: resolution_note || 'Resolved by inspector review.',
          resolved_at: new Date().toISOString(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Alert not found.' });
    }

    res.json({ message: 'Alert updated successfully.', alert_id: req.params.id });
  } catch (err) {
    console.error('Error updating alert status:', err);
    res.status(500).json({ error: 'Failed to update alert.' });
  }
});

// POST /api/alerts/simulate - inject a live anomaly for demonstration
router.post('/simulate', async (req, res) => {
  try {
    const db = getDB();
    const { type = 'GHOST_CANDIDATE', centre_id = 'TC-KA-BLR-0104' } = req.body;

    const SIMULATION_TEMPLATES = {
      GHOST_CANDIDATE: {
        severity: 'CRITICAL',
        category: 'Attendance Fraud',
        title: 'Proxy / Ghost Candidate Flagged in Batch #AI-402',
        description: 'Biometric punch recorded for 3 candidates whose facial embeddings do not match any detected faces in classroom CCTV feed.',
      },
      TRAINER_ABSENT: {
        severity: 'HIGH',
        category: 'Trainer Compliance',
        title: 'Trainer Absent during Scheduled Practical Lab',
        description: 'Assigned certified trainer (TR-8821) is missing from camera feed for > 22 minutes during active session.',
      },
      FIRE_HAZARD: {
        severity: 'CRITICAL',
        category: 'Safety Violation',
        title: 'Fire Extinguisher Obstructed in Workshop Lab',
        description: 'Computer vision camera detected cardboard boxes piled directly in front of main Class ABC fire extinguisher station.',
      },
      GEOFENCE_BREACH: {
        severity: 'HIGH',
        category: 'Geolocation Compliance',
        title: 'Biometric Punch Outside Geofence Boundary',
        description: '14 attendance punches received from GPS coords 3.2 km outside registered training centre premises boundary.',
      },
      CCTV_OCCLUSION: {
        severity: 'MEDIUM',
        category: 'Surveillance Anomaly',
        title: 'Camera Feed Tampering / Partial Blindness',
        description: 'Classroom CCTV 02 feed brightness drop > 85%. Possible lens covering or camera reorientation detected.',
      }
    };

    const template = SIMULATION_TEMPLATES[type] || SIMULATION_TEMPLATES.GHOST_CANDIDATE;
    const alertId = `ALT-LIVE-${Date.now().toString().slice(-6)}`;

    const newAlert = {
      alert_id: alertId,
      centre_id,
      centre_name: 'National Skill Training Institute - Bengaluru South',
      severity: template.severity,
      category: template.category,
      title: template.title,
      description: template.description,
      timestamp: new Date().toISOString(),
      status: 'OPEN',
      simulated: true,
    };

    await db.collection('alerts').insertOne(newAlert);
    res.json({ message: 'Live anomaly simulated successfully.', alert: newAlert });
  } catch (err) {
    console.error('Error simulating anomaly:', err);
    res.status(500).json({ error: 'Failed to simulate anomaly.' });
  }
});

module.exports = router;
