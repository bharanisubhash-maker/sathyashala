const express = require('express');
const { getDB } = require('../db');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// GET /api/batches - list batches with optional filter by centre_id or status
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { centre_id, status } = req.query;
    const query = {};
    if (centre_id) query.centre_id = centre_id;
    if (status && status !== 'All') query.status = status;

    const batches = await db.collection('batches').find(query).toArray();
    res.json({ batches, count: batches.length });
  } catch (err) {
    console.error('Error fetching batches:', err);
    res.status(500).json({ error: 'Failed to fetch batches.' });
  }
});

// GET /api/batches/:id - get single batch with detailed student roster & attendance
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const batch = await db.collection('batches').findOne({ batch_id: req.params.id });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    // Get centre info for context
    const centre = await db.collection('centres').findOne({ centre_id: batch.centre_id });

    res.json({ batch, centre });
  } catch (err) {
    console.error('Error fetching batch detail:', err);
    res.status(500).json({ error: 'Failed to fetch batch.' });
  }
});

// POST /api/batches/:id/sync-attendance - simulate AI camera & biometric correlation
router.post('/:id/sync-attendance', async (req, res) => {
  try {
    const db = getDB();
    const batch = await db.collection('batches').findOne({ batch_id: req.params.id });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    // Simulate AI real-time re-scan of camera stream:
    // Update student presence, liveness scores, and check for ghost candidate / proxy
    const updatedStudents = (batch.students || []).map((student) => {
      // 90% chance to be present if already present, occasional variation
      const isPresent = Math.random() > 0.12;
      const livenessScore = isPresent ? (94 + Math.random() * 5.8).toFixed(1) : 0;
      const faceMatchConfidence = isPresent ? (92 + Math.random() * 7.5).toFixed(1) : 0;
      
      // Anomaly detection: Biometric marked but face missing = GHOST
      const bioPunched = student.biometric_punched || (isPresent && Math.random() > 0.05);
      let status = 'ABSENT';
      let anomaly = null;

      if (isPresent && bioPunched) {
        status = 'PRESENT';
      } else if (!isPresent && bioPunched) {
        status = 'GHOST_CANDIDATE';
        anomaly = 'Biometric recorded at 09:02 AM, but CCTV face detection absent for 25+ mins';
      } else if (isPresent && !bioPunched) {
        status = 'UNAUTHORIZED_ENTRY';
        anomaly = 'Face detected in classroom but no biometric punch registered';
      }

      return {
        ...student,
        current_status: status,
        liveness_score: Number(livenessScore),
        face_confidence: Number(faceMatchConfidence),
        last_seen: isPresent ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : student.last_seen,
        anomaly_flag: anomaly,
      };
    });

    const presentCount = updatedStudents.filter(s => s.current_status === 'PRESENT').length;
    const ghostCount = updatedStudents.filter(s => s.current_status === 'GHOST_CANDIDATE').length;
    const attendanceRate = Math.round((presentCount / updatedStudents.length) * 100);

    // Update batch in DB
    await db.collection('batches').updateOne(
      { batch_id: req.params.id },
      {
        $set: {
          students: updatedStudents,
          live_attendance_rate: attendanceRate,
          present_count: presentCount,
          ghost_count: ghostCount,
          last_ai_scan: new Date().toISOString(),
        }
      }
    );

    // If ghost candidates found, trigger or update alert
    if (ghostCount > 0) {
      await db.collection('alerts').insertOne({
        alert_id: `ALT-GHOST-${Date.now().toString().slice(-6)}`,
        centre_id: batch.centre_id,
        centre_name: batch.centre_name,
        batch_id: batch.batch_id,
        course_name: batch.course_name,
        severity: 'CRITICAL',
        category: 'Attendance Fraud',
        title: `Ghost Candidate Detected in ${batch.batch_id}`,
        description: `${ghostCount} student(s) have biometric entry logged but are not present in AI CCTV face feed. Suspected proxy punch.`,
        timestamp: new Date().toISOString(),
        status: 'OPEN',
        evidence_type: 'FACIAL_RECOGNITION_MISMATCH',
      });
    }

    res.json({
      message: 'AI attendance scan completed successfully.',
      batch_id: batch.batch_id,
      attendance_rate: attendanceRate,
      present_count: presentCount,
      ghost_count: ghostCount,
      total_students: updatedStudents.length,
      students: updatedStudents,
    });
  } catch (err) {
    console.error('Error syncing attendance:', err);
    res.status(500).json({ error: 'Failed to sync AI attendance.' });
  }
});

module.exports = router;
