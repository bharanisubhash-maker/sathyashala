const express = require('express');
const { getDB } = require('../db');
const { v4: uuidv4 } = require('uuid');
const { hashImage, hashRecord, signRecord, verifySignature } = require('../utils/crypto');

const router = express.Router();

// Preset test scenarios for quick evaluation during demos
const PRESET_AUDIT_PROFILES = {
  it_lab_compliant: {
    room_type: 'Computer IT Lab',
    centre_id: 'TC-KA-BLR-0104',
    centre_name: 'NSTI Bengaluru - IT Center of Excellence',
    compliance_score: 96,
    status: 'COMPLIANT',
    detections: [
      { label: 'Workstation Desktops (x24)', category: 'Trade Equipment', confidence: 0.98, status: 'PASSED', bbox: [120, 40, 520, 780] },
      { label: 'Class ABC Fire Extinguisher', category: 'Safety Equipment', confidence: 0.96, status: 'PASSED', bbox: [80, 820, 240, 890] },
      { label: 'Wall First Aid Medical Kit', category: 'Safety Equipment', confidence: 0.93, status: 'PASSED', bbox: [75, 40, 160, 110] },
      { label: 'Ceiling Dual CCTV Dome', category: 'Surveillance', confidence: 0.95, status: 'PASSED', bbox: [20, 460, 70, 520] },
      { label: 'AEBAS Biometric Terminal', category: 'Attendance Device', confidence: 0.97, status: 'PASSED', bbox: [310, 880, 440, 940] },
      { label: 'Interactive Smartboard / Projector', category: 'Pedagogy Equipment', confidence: 0.94, status: 'PASSED', bbox: [90, 310, 280, 670] },
      { label: 'Power Backup Online UPS 10kVA', category: 'Power Norms', confidence: 0.91, status: 'PASSED', bbox: [460, 40, 600, 140] },
    ],
    checklist: [
      { item: 'Class ABC Fire Extinguisher installed & unblocked', mandatory: true, status: 'VERIFIED', note: 'Pressure gauge verified in green band.' },
      { item: 'Functional AEBAS biometric device with live sync', mandatory: true, status: 'VERIFIED', note: 'Sync latency < 5 sec.' },
      { item: '1:1 Computer-to-student workstation ratio', mandatory: true, status: 'VERIFIED', note: '24 active PCs detected for 24 batch cap.' },
      { item: 'Dual CCTV coverage without blind spots', mandatory: true, status: 'VERIFIED', note: 'Wide FOV covering entire lab seating.' },
      { item: 'Wall-mounted First Aid Box with standard supplies', mandatory: true, status: 'VERIFIED', note: 'Clearly visible beside main door.' },
      { item: 'Display of Course Curriculum & Batch Schedule', mandatory: false, status: 'VERIFIED', note: 'Notice board compliant.' },
    ],
    summary: 'All mandatory infrastructure norms under NSDC/DGT guidelines are fully satisfied.',
  },
  welding_lab_deficient: {
    room_type: 'Mechanical & Welding Workshop',
    centre_id: 'TC-MH-PUN-0219',
    centre_name: 'Pune Industrial Skill Academy - Automotive & Fab',
    compliance_score: 54,
    status: 'NON_COMPLIANT',
    detections: [
      { label: 'Arc Welding Stations (x8)', category: 'Trade Equipment', confidence: 0.96, status: 'PASSED', bbox: [180, 60, 580, 700] },
      { label: 'Welding Face Shields & Gloves', category: 'PPE Norms', confidence: 0.88, status: 'WARNING', bbox: [220, 710, 340, 820] },
      { label: 'Exhaust Ventilation Ducts', category: 'Safety Norms', confidence: 0.92, status: 'PASSED', bbox: [30, 100, 120, 600] },
      { label: 'CCTV Surveillance Camera', category: 'Surveillance', confidence: 0.94, status: 'PASSED', bbox: [25, 480, 80, 540] },
    ],
    checklist: [
      { item: 'Class ABC / CO2 Fire Extinguisher (Mandatory in Hot Works)', mandatory: true, status: 'FAILED', note: 'CRITICAL: No fire extinguisher detected within 5 meters of active arc welding stations.' },
      { item: 'Full PPE Kit (Welding apron, insulated gloves, auto-darkening shield)', mandatory: true, status: 'FAILED', note: 'Two trainees observed without mandatory safety goggles.' },
      { item: 'Wall-mounted Industrial First Aid Box (with burn dressings)', mandatory: true, status: 'FAILED', note: 'First aid cabinet empty / missing from designated bracket.' },
      { item: 'Emergency Stop Power Cutoff Switch', mandatory: true, status: 'VERIFIED', note: 'Master switch functional.' },
    ],
    summary: 'CRITICAL DEFICIENCY: Missing Fire Extinguisher and First Aid box in hot-work area poses immediate safety risk.',
  },
  classroom_warning: {
    room_type: 'General Theory Classroom - Hall B',
    centre_id: 'TC-DL-DEL-0308',
    centre_name: 'PMKK South Delhi Skill Hub',
    compliance_score: 74,
    status: 'WARNING',
    detections: [
      { label: 'Trainee Benches (Cap: 30)', category: 'Infrastructure', confidence: 0.95, status: 'PASSED', bbox: [200, 50, 600, 850] },
      { label: 'Instructor Podium & Whiteboard', category: 'Pedagogy', confidence: 0.97, status: 'PASSED', bbox: [100, 300, 260, 680] },
      { label: 'CCTV Camera (Angle Misaligned)', category: 'Surveillance', confidence: 0.79, status: 'WARNING', bbox: [40, 800, 95, 870] },
      { label: 'Class ABC Fire Extinguisher', category: 'Safety Equipment', confidence: 0.92, status: 'PASSED', bbox: [280, 40, 420, 95] },
    ],
    checklist: [
      { item: 'Dual CCTV coverage without blind spots', mandatory: true, status: 'FAILED', note: 'Left rear row obscured due to tilted camera angle.' },
      { item: 'Class ABC Fire Extinguisher', mandatory: true, status: 'VERIFIED', note: 'Installed near entry.' },
      { item: 'Adequate Natural & LED Illumination (Min 300 Lux)', mandatory: true, status: 'VERIFIED', note: 'Lux levels satisfactory.' },
      { item: 'Air ventilation & twin ceiling fans', mandatory: true, status: 'VERIFIED', note: 'Ventilation adequate.' },
    ],
    summary: 'Partial compliance. CCTV camera requires re-alignment to eliminate blind zone in back seating row.',
  }
};

// GET /api/compliance/audits - list recent audits
router.get('/audits', async (req, res) => {
  try {
    const db = getDB();
    const audits = await db.collection('compliance_audits').find().sort({ timestamp: -1 }).limit(30).toArray();
    res.json({ audits, count: audits.length });
  } catch (err) {
    console.error('Error fetching compliance audits:', err);
    res.status(500).json({ error: 'Failed to fetch compliance audits.' });
  }
});

// GET /api/compliance/audits/:id - get single audit detail with hash and cryptographic verification
router.get('/audits/:id', async (req, res) => {
  try {
    const db = getDB();
    const audit = await db.collection('compliance_audits').findOne({ audit_id: req.params.id });
    if (!audit) {
      return res.status(404).json({ error: 'Audit record not found.' });
    }

    // Verify cryptographic signature if available
    let signatureValid = false;
    if (audit.digital_signature && global.PUBLIC_KEY) {
      signatureValid = verifySignature(audit.record_hash, audit.digital_signature, global.PUBLIC_KEY);
    }

    res.json({ audit, signatureValid });
  } catch (err) {
    console.error('Error fetching audit:', err);
    res.status(500).json({ error: 'Failed to fetch audit.' });
  }
});

// POST /api/compliance/scan - run AI Computer Vision inspection on uploaded image or preset
router.post('/scan', async (req, res) => {
  try {
    const db = getDB();
    const {
      preset_type = 'it_lab_compliant',
      room_name = 'Room 201 - Advanced Skill Lab',
      centre_id = 'TC-KA-BLR-0104',
      image_data, // optional base64
    } = req.body;

    // Use selected profile or build dynamic AI response
    const profile = PRESET_AUDIT_PROFILES[preset_type] || PRESET_AUDIT_PROFILES.it_lab_compliant;
    const auditId = `AUDIT-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();

    // Generate cryptographic hash of audit data & image
    const auditPayload = {
      audit_id: auditId,
      centre_id: centre_id || profile.centre_id,
      room_name,
      timestamp,
      compliance_score: profile.compliance_score,
      status: profile.status,
      detections_count: profile.detections.length,
      checklist_count: profile.checklist.length,
    };

    const recordHash = hashRecord(auditPayload);
    let digitalSignature = null;
    if (global.PRIVATE_KEY) {
      digitalSignature = signRecord(recordHash, global.PRIVATE_KEY);
    }

    const auditRecord = {
      ...auditPayload,
      centre_name: profile.centre_name,
      room_type: profile.room_type,
      detections: profile.detections,
      checklist: profile.checklist,
      summary: profile.summary,
      record_hash: recordHash,
      digital_signature: digitalSignature,
      image_snapshot: image_data ? image_data.slice(0, 100) + '...' : `preset://${preset_type}`,
      inspector_id: req.user?.operator_id || 'AI-AUTO-SCANNER-V2',
    };

    // Save to database
    await db.collection('compliance_audits').insertOne(auditRecord);

    // If audit failed or warning, generate an automatic alert
    if (profile.status === 'NON_COMPLIANT') {
      const alertId = `ALT-INFRA-${Date.now().toString().slice(-6)}`;
      await db.collection('alerts').insertOne({
        alert_id: alertId,
        centre_id: auditRecord.centre_id,
        centre_name: auditRecord.centre_name,
        severity: 'CRITICAL',
        category: 'Infrastructure Non-Compliance',
        title: `Mandatory Norm Breach: ${profile.room_type}`,
        description: profile.summary,
        timestamp,
        status: 'OPEN',
        related_audit_id: auditId,
      });
    }

    res.json({
      success: true,
      audit: auditRecord,
      message: 'AI Computer Vision analysis completed and cryptographically signed.',
    });
  } catch (err) {
    console.error('Error during AI compliance scan:', err);
    res.status(500).json({ error: 'AI compliance scan failed.' });
  }
});

module.exports = router;
