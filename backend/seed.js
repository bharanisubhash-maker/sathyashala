require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const { hashRecord, generateKeyPair, signRecord } = require('./utils/crypto');

async function seed() {
  const client = await MongoClient.connect(process.env.MONGODB_URL);
  const db = client.db('vigiloskill');
  console.log('🌱 Seeding database: vigiloskill ...');

  // Clear existing collections for a clean, deterministic seed
  await db.collection('users').deleteMany({});
  await db.collection('centres').deleteMany({});
  await db.collection('batches').deleteMany({});
  await db.collection('alerts').deleteMany({});
  await db.collection('compliance_audits').deleteMany({});

  // 1. Seed Users
  const adminHash = await bcrypt.hash('admin123', 10);
  const centreHash = await bcrypt.hash('centre123', 10);
  const auditorHash = await bcrypt.hash('auditor123', 10);

  const users = [
    {
      _id: uuidv4(),
      operator_id: 'ADMIN-001',
      name: 'Dr. Rajeshwar Sharma',
      designation: 'Joint Director (Monitoring & Compliance) - DGT / MSDE',
      role: 'admin',
      email: 'rajeshwar.msde@gov.in',
      password_hash: adminHash,
      created_at: new Date().toISOString(),
    },
    {
      _id: uuidv4(),
      operator_id: 'TC-BLR-01',
      name: 'Sunita Rao',
      designation: 'Centre Superintendent - NSTI Bengaluru',
      role: 'centre_head',
      centre_id: 'TC-KA-BLR-0104',
      email: 'sunita.rao@nsti-blr.org',
      password_hash: centreHash,
      created_at: new Date().toISOString(),
    },
    {
      _id: uuidv4(),
      operator_id: 'AUDIT-99',
      name: 'Vikramaditya Sengupta',
      designation: 'Senior AI Field Vigilance Officer',
      role: 'auditor',
      email: 'vikram.audit@nsdcindia.org',
      password_hash: auditorHash,
      created_at: new Date().toISOString(),
    },
  ];
  await db.collection('users').insertMany(users);

  // 2. Seed Training Centres
  const centres = [
    {
      centre_id: 'TC-KA-BLR-0104',
      name: 'National Skill Training Institute (NSTI) - Bengaluru',
      affiliation: 'DGT / PMKVY 4.0 Center of Excellence',
      address: 'Outer Ring Road, Near Hebbal Lake, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560024',
      superintendent: 'Sunita Rao',
      phone: '+91 80 2341 5500',
      compliance_score: 96,
      compliance_grade: 'A+',
      compliance_status: 'COMPLIANT',
      geofence: {
        latitude: 12.9716,
        longitude: 77.5946,
        radius_meters: 150,
      },
      stats: {
        active_batches: 6,
        total_students: 144,
        present_today: 136,
        attendance_percentage: 94.4,
        cameras_active: 8,
        cameras_total: 8,
      },
      cameras: [
        { id: 'CAM-01', name: 'Smart Classroom 101', type: 'Classroom', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'classroom' },
        { id: 'CAM-02', name: 'IoT & AI Computer Lab', type: 'Computer Lab', fps: 28, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'it_lab' },
        { id: 'CAM-03', name: 'Solar PV Workshop', type: 'Practical Lab', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'workshop' },
        { id: 'CAM-04', name: 'Biometric Main Entrance', type: 'Gate / Attendance', fps: 25, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'entrance' },
      ],
      equipment_checklist: [
        { name: 'Fire Extinguisher ABC Type', status: 'VERIFIED', last_inspected: '2026-09-28' },
        { name: 'AEBAS Biometric Devices (x2)', status: 'VERIFIED', last_inspected: '2026-10-01' },
        { name: 'Dual CCTV with DVR Cloud Link', status: 'VERIFIED', last_inspected: '2026-10-02' },
        { name: 'Workstation PCs (1:1 Ratio)', status: 'VERIFIED', last_inspected: '2026-10-01' },
        { name: 'Industrial First Aid Cabinet', status: 'VERIFIED', last_inspected: '2026-09-30' },
      ]
    },
    {
      centre_id: 'TC-MH-PUN-0219',
      name: 'Pune Industrial Skill Academy - Automotive & Fab',
      affiliation: 'NSDC Affiliated Partner - Auto Sector Skill Council',
      address: 'Plot 44, MIDC Bhosari Industrial Area, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411026',
      superintendent: 'Anand Deshpande',
      phone: '+91 20 2712 8840',
      compliance_score: 78,
      compliance_grade: 'B',
      compliance_status: 'WARNING',
      geofence: {
        latitude: 18.6298,
        longitude: 73.8131,
        radius_meters: 180,
      },
      stats: {
        active_batches: 5,
        total_students: 120,
        present_today: 92,
        attendance_percentage: 76.6,
        cameras_active: 5,
        cameras_total: 6,
      },
      cameras: [
        { id: 'CAM-01', name: 'Theory Hall A', type: 'Classroom', fps: 25, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'classroom' },
        { id: 'CAM-02', name: 'Automotive Fitting Bay', type: 'Workshop', fps: 22, resolution: '720p', status: 'ONLINE', rtsp_sim: 'workshop' },
        { id: 'CAM-03', name: 'Welding & Cutting Lab', type: 'Practical Lab', fps: 0, resolution: '1080p', status: 'OCCLUDED', rtsp_sim: 'deficient_lab' },
        { id: 'CAM-04', name: 'Biometric Access Gate', type: 'Attendance', fps: 28, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'entrance' },
      ],
      equipment_checklist: [
        { name: 'Fire Extinguisher ABC Type', status: 'WARNING', last_inspected: '2026-09-15' },
        { name: 'AEBAS Biometric Devices', status: 'VERIFIED', last_inspected: '2026-10-02' },
        { name: 'Welding Safety Shields & Aprons', status: 'WARNING', last_inspected: '2026-09-29' },
        { name: 'First Aid Kit (Burn supplies)', status: 'FAILED', last_inspected: '2026-10-01' },
      ]
    },
    {
      centre_id: 'TC-DL-DEL-0308',
      name: 'Pradhan Mantri Kaushal Kendra (PMKK) - South Delhi',
      affiliation: 'PMKVY 4.0 Special Projects Hub',
      address: 'Okhla Industrial Area Phase-III, New Delhi',
      city: 'New Delhi',
      state: 'Delhi NCR',
      pincode: '110020',
      superintendent: 'Meenakshi Sundaram',
      phone: '+91 11 4160 9901',
      compliance_score: 92,
      compliance_grade: 'A',
      compliance_status: 'COMPLIANT',
      geofence: {
        latitude: 28.5355,
        longitude: 77.2600,
        radius_meters: 140,
      },
      stats: {
        active_batches: 8,
        total_students: 210,
        present_today: 194,
        attendance_percentage: 92.3,
        cameras_active: 8,
        cameras_total: 8,
      },
      cameras: [
        { id: 'CAM-01', name: 'Digital Media & Design Studio', type: 'Computer Lab', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'it_lab' },
        { id: 'CAM-02', name: 'Retail Simulation Counter', type: 'Practical Lab', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'classroom' },
        { id: 'CAM-03', name: 'Reception & Biometric Point', type: 'Attendance', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'entrance' },
      ],
      equipment_checklist: [
        { name: 'Fire Extinguisher ABC Type', status: 'VERIFIED', last_inspected: '2026-10-01' },
        { name: 'AEBAS Biometric Devices', status: 'VERIFIED', last_inspected: '2026-10-02' },
        { name: 'Smartboard & Projectors', status: 'VERIFIED', last_inspected: '2026-09-25' },
        { name: 'First Aid Kit Wall Box', status: 'VERIFIED', last_inspected: '2026-09-30' },
      ]
    },
    {
      centre_id: 'TC-UP-LKO-0412',
      name: 'Jan Shikshan Sansthan (JSS) - Lucknow Rural Outreach',
      affiliation: 'MSDE Jan Shikshan Sansthan Scheme',
      address: 'Sitapur Road, Sector 8, Jankipuram, Lucknow',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226021',
      superintendent: 'Harish Chandra Verma',
      phone: '+91 522 273 1188',
      compliance_score: 54,
      compliance_grade: 'C (Defaulter)',
      compliance_status: 'NON_COMPLIANT',
      geofence: {
        latitude: 26.8467,
        longitude: 80.9462,
        radius_meters: 200,
      },
      stats: {
        active_batches: 4,
        total_students: 96,
        present_today: 48,
        attendance_percentage: 50.0,
        cameras_active: 2,
        cameras_total: 4,
      },
      cameras: [
        { id: 'CAM-01', name: 'Sewing & Tailoring Hall', type: 'Workshop', fps: 15, resolution: '720p', status: 'ONLINE', rtsp_sim: 'classroom' },
        { id: 'CAM-02', name: 'Basic Computer Literacy Lab', type: 'Computer Lab', fps: 0, resolution: '1080p', status: 'OFFLINE', rtsp_sim: 'deficient_lab' },
        { id: 'CAM-03', name: 'Corridor & Attendance Punch', type: 'Attendance', fps: 20, resolution: '720p', status: 'ONLINE', rtsp_sim: 'entrance' },
      ],
      equipment_checklist: [
        { name: 'Fire Extinguisher ABC Type', status: 'FAILED', last_inspected: '2026-08-10' },
        { name: 'AEBAS Biometric Devices', status: 'WARNING', last_inspected: '2026-09-28' },
        { name: 'Power Inverter / UPS Backup', status: 'FAILED', last_inspected: '2026-09-12' },
        { name: 'First Aid Kit Wall Box', status: 'FAILED', last_inspected: '2026-08-15' },
      ]
    },
    {
      centre_id: 'TC-TN-CHE-0520',
      name: 'Apex Vocational Training Institute - Chennai Guindy',
      affiliation: 'DGT Affiliated Industrial Training Centre',
      address: 'Industrial Estate, Guindy, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600032',
      superintendent: 'K. Balasubramanian',
      phone: '+91 44 2250 1920',
      compliance_score: 98,
      compliance_grade: 'A+',
      compliance_status: 'COMPLIANT',
      geofence: {
        latitude: 13.0067,
        longitude: 80.2023,
        radius_meters: 150,
      },
      stats: {
        active_batches: 7,
        total_students: 175,
        present_today: 168,
        attendance_percentage: 96.0,
        cameras_active: 8,
        cameras_total: 8,
      },
      cameras: [
        { id: 'CAM-01', name: 'CNC Simulation & Automation Lab', type: 'Practical Lab', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'workshop' },
        { id: 'CAM-02', name: 'Electronics Assembly Lab', type: 'Practical Lab', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'it_lab' },
        { id: 'CAM-03', name: 'Biometric Entrance Lobby', type: 'Attendance', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'entrance' },
      ],
      equipment_checklist: [
        { name: 'Fire Extinguisher ABC Type', status: 'VERIFIED', last_inspected: '2026-10-02' },
        { name: 'AEBAS Biometric Devices', status: 'VERIFIED', last_inspected: '2026-10-02' },
        { name: 'CNC Simulation Hardware', status: 'VERIFIED', last_inspected: '2026-10-01' },
        { name: 'First Aid & Emergency Stretcher', status: 'VERIFIED', last_inspected: '2026-09-29' },
      ]
    },
    {
      centre_id: 'TC-TS-HYD-0631',
      name: 'Hyderabad Tech & Renewable Energy Skill Academy',
      affiliation: 'PMKVY 4.0 Green Skills Mission',
      address: 'Gachibowli Financial District, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      superintendent: 'P. V. Ramana',
      phone: '+91 40 6677 8899',
      compliance_score: 88,
      compliance_grade: 'A',
      compliance_status: 'COMPLIANT',
      geofence: {
        latitude: 17.4401,
        longitude: 78.3489,
        radius_meters: 160,
      },
      stats: {
        active_batches: 5,
        total_students: 125,
        present_today: 110,
        attendance_percentage: 88.0,
        cameras_active: 6,
        cameras_total: 6,
      },
      cameras: [
        { id: 'CAM-01', name: 'Solar Rooftop Simulator', type: 'Practical Lab', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'workshop' },
        { id: 'CAM-02', name: 'Grid Integration IT Lab', type: 'Computer Lab', fps: 28, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'it_lab' },
        { id: 'CAM-03', name: 'Main Gate AEBAS Terminal', type: 'Attendance', fps: 30, resolution: '1080p', status: 'ONLINE', rtsp_sim: 'entrance' },
      ],
      equipment_checklist: [
        { name: 'Fire Extinguisher ABC Type', status: 'VERIFIED', last_inspected: '2026-09-30' },
        { name: 'AEBAS Biometric Devices', status: 'VERIFIED', last_inspected: '2026-10-02' },
        { name: 'Solar Photovoltaic Inverters & Tools', status: 'VERIFIED', last_inspected: '2026-09-28' },
        { name: 'Safety Harness & Fall Protection PPE', status: 'VERIFIED', last_inspected: '2026-10-01' },
      ]
    }
  ];
  await db.collection('centres').insertMany(centres);

  // 3. Seed Batches with Real-Time AI Student Rosters & Biometric Verification
  const sampleStudents = [
    { id: 'STU-101', name: 'Aarav Sharma', roll: '2026/AI/01', biometric_punched: true, current_status: 'PRESENT', liveness_score: 98.4, face_confidence: 96.8, last_seen: '10:45 AM' },
    { id: 'STU-102', name: 'Priya Narayanan', roll: '2026/AI/02', biometric_punched: true, current_status: 'PRESENT', liveness_score: 99.1, face_confidence: 97.2, last_seen: '10:46 AM' },
    { id: 'STU-103', name: 'Mohammed Farooq', roll: '2026/AI/03', biometric_punched: true, current_status: 'PRESENT', liveness_score: 97.5, face_confidence: 95.1, last_seen: '10:44 AM' },
    { id: 'STU-104', name: 'Ananya Deshmukh', roll: '2026/AI/04', biometric_punched: true, current_status: 'GHOST_CANDIDATE', liveness_score: 0, face_confidence: 0, last_seen: 'Never (Biometric Only)', anomaly_flag: 'Biometric entry stamped at 09:05 AM, but face has not been detected by CCTV for 90+ mins' },
    { id: 'STU-105', name: 'Rohan Verma', roll: '2026/AI/05', biometric_punched: true, current_status: 'PRESENT', liveness_score: 96.2, face_confidence: 94.7, last_seen: '10:42 AM' },
    { id: 'STU-106', name: 'Kavita Sengupta', roll: '2026/AI/06', biometric_punched: true, current_status: 'PRESENT', liveness_score: 98.9, face_confidence: 98.0, last_seen: '10:45 AM' },
    { id: 'STU-107', name: 'Deepak Patel', roll: '2026/AI/07', biometric_punched: false, current_status: 'ABSENT', liveness_score: 0, face_confidence: 0, last_seen: '-' },
    { id: 'STU-108', name: 'Sneha Kulkarni', roll: '2026/AI/08', biometric_punched: true, current_status: 'PRESENT', liveness_score: 99.4, face_confidence: 97.6, last_seen: '10:46 AM' },
    { id: 'STU-109', name: 'Karthik Raja', roll: '2026/AI/09', biometric_punched: true, current_status: 'PRESENT', liveness_score: 97.8, face_confidence: 96.3, last_seen: '10:43 AM' },
    { id: 'STU-110', name: 'Fatima Zohra', roll: '2026/AI/10', biometric_punched: true, current_status: 'PRESENT', liveness_score: 98.6, face_confidence: 97.4, last_seen: '10:45 AM' },
    { id: 'STU-111', name: 'Vikas Meena', roll: '2026/AI/11', biometric_punched: false, current_status: 'ABSENT', liveness_score: 0, face_confidence: 0, last_seen: '-' },
    { id: 'STU-112', name: 'Divya Nair', roll: '2026/AI/12', biometric_punched: true, current_status: 'PRESENT', liveness_score: 99.0, face_confidence: 98.2, last_seen: '10:46 AM' },
    { id: 'STU-113', name: 'Siddharth Rao', roll: '2026/AI/13', biometric_punched: true, current_status: 'PRESENT', liveness_score: 96.5, face_confidence: 95.8, last_seen: '10:41 AM' },
    { id: 'STU-114', name: 'Pooja Jaiswal', roll: '2026/AI/14', biometric_punched: true, current_status: 'PRESENT', liveness_score: 98.1, face_confidence: 96.9, last_seen: '10:44 AM' },
    { id: 'STU-115', name: 'Gaurav Joshi', roll: '2026/AI/15', biometric_punched: true, current_status: 'PRESENT', liveness_score: 97.9, face_confidence: 96.1, last_seen: '10:45 AM' },
    { id: 'STU-116', name: 'Megha Iyer', roll: '2026/AI/16', biometric_punched: true, current_status: 'PRESENT', liveness_score: 98.7, face_confidence: 97.3, last_seen: '10:46 AM' },
    { id: 'STU-117', name: 'Rahul Choudhary', roll: '2026/AI/17', biometric_punched: true, current_status: 'PRESENT', liveness_score: 97.2, face_confidence: 95.4, last_seen: '10:40 AM' },
    { id: 'STU-118', name: 'Aishwarya Patil', roll: '2026/AI/18', biometric_punched: true, current_status: 'PRESENT', liveness_score: 99.3, face_confidence: 98.5, last_seen: '10:45 AM' },
    { id: 'STU-119', name: 'Nikhil Saxena', roll: '2026/AI/19', biometric_punched: false, current_status: 'ABSENT', liveness_score: 0, face_confidence: 0, last_seen: '-' },
    { id: 'STU-120', name: 'Swati Bisht', roll: '2026/AI/20', biometric_punched: true, current_status: 'PRESENT', liveness_score: 98.4, face_confidence: 97.0, last_seen: '10:45 AM' },
  ];

  const batches = [
    {
      batch_id: 'BATCH-2026-AI-401',
      centre_id: 'TC-KA-BLR-0104',
      centre_name: 'National Skill Training Institute - Bengaluru',
      course_name: 'Python, Machine Learning & AI Applications',
      sector: 'IT-ITeS',
      room: 'IoT & AI Computer Lab (Room 204)',
      timing: '09:00 AM - 01:00 PM (Morning Shift)',
      status: 'ACTIVE',
      trainer: {
        trainer_id: 'TR-KA-7712',
        name: 'Prof. Ramesh Kulkarni',
        aadhaar_verified: true,
        certified_by: 'NSDC Trainer Assessor Academy',
        status: 'PRESENT_IN_FRAME',
        face_confidence: 98.6,
        last_verified: '10:45 AM',
      },
      enrolled_count: 20,
      present_count: 16,
      ghost_count: 1,
      live_attendance_rate: 80,
      mandatory_threshold: 70,
      students: sampleStudents,
      last_ai_scan: new Date().toISOString(),
    },
    {
      batch_id: 'BATCH-2026-SOL-202',
      centre_id: 'TC-KA-BLR-0104',
      centre_name: 'National Skill Training Institute - Bengaluru',
      course_name: 'Solar PV Rooftop System Installer',
      sector: 'Renewable Energy',
      room: 'Solar Practical Yard & Lab 1',
      timing: '01:30 PM - 05:30 PM (Afternoon Shift)',
      status: 'SCHEDULED',
      trainer: {
        trainer_id: 'TR-KA-8890',
        name: 'Venkatesh Murthy',
        aadhaar_verified: true,
        certified_by: 'Skill Council for Green Jobs',
        status: 'AWAITING_SHIFT',
      },
      enrolled_count: 24,
      present_count: 0,
      ghost_count: 0,
      live_attendance_rate: 0,
      mandatory_threshold: 70,
      students: sampleStudents.slice(0, 15),
      last_ai_scan: null,
    },
    {
      batch_id: 'BATCH-2026-AUT-105',
      centre_id: 'TC-MH-PUN-0219',
      centre_name: 'Pune Industrial Skill Academy',
      course_name: 'Automotive Fitting & EV Assembly Technician',
      sector: 'Automotive',
      room: 'Automotive Workshop Bay 3',
      timing: '09:30 AM - 01:30 PM',
      status: 'ACTIVE',
      trainer: {
        trainer_id: 'TR-MH-3301',
        name: 'Santosh Ghorpade',
        aadhaar_verified: true,
        status: 'ABSENT_FROM_FRAME',
        last_verified: '09:42 AM',
        anomaly: 'Trainer missing from camera stream for > 20 mins',
      },
      enrolled_count: 24,
      present_count: 17,
      ghost_count: 2,
      live_attendance_rate: 70.8,
      mandatory_threshold: 70,
      students: sampleStudents,
      last_ai_scan: new Date().toISOString(),
    },
    {
      batch_id: 'BATCH-2026-JSS-088',
      centre_id: 'TC-UP-LKO-0412',
      centre_name: 'Jan Shikshan Sansthan - Lucknow',
      course_name: 'Apparel Pattern Making & Computerized Sewing',
      sector: 'Apparel & Handicrafts',
      room: 'Tailoring Practical Workshop',
      timing: '10:00 AM - 02:00 PM',
      status: 'ACTIVE',
      trainer: {
        trainer_id: 'TR-UP-4491',
        name: 'Shabana Parveen',
        aadhaar_verified: true,
        status: 'PRESENT_IN_FRAME',
        face_confidence: 96.1,
      },
      enrolled_count: 24,
      present_count: 12,
      ghost_count: 4,
      live_attendance_rate: 50.0,
      mandatory_threshold: 70,
      students: sampleStudents,
      last_ai_scan: new Date().toISOString(),
    }
  ];
  await db.collection('batches').insertMany(batches);

  // 4. Seed Real-Time Alerts
  const alerts = [
    {
      alert_id: 'ALT-CRIT-9011',
      centre_id: 'TC-UP-LKO-0412',
      centre_name: 'Jan Shikshan Sansthan - Lucknow',
      batch_id: 'BATCH-2026-JSS-088',
      severity: 'CRITICAL',
      category: 'Attendance Shortfall & Ghost Candidates',
      title: 'Attendance Below Subsidy Threshold (50% vs 70%)',
      description: 'AI Face recognition verified only 12 students present out of 24 enrolled. 4 candidates have biometric punches without facial presence in CCTV stream.',
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      status: 'OPEN',
      evidence_type: 'FACIAL_RECOGNITION_MISMATCH',
    },
    {
      alert_id: 'ALT-CRIT-9012',
      centre_id: 'TC-MH-PUN-0219',
      centre_name: 'Pune Industrial Skill Academy',
      batch_id: 'BATCH-2026-AUT-105',
      severity: 'CRITICAL',
      category: 'Safety Violation',
      title: 'Missing Fire Extinguisher in Hot-Work Zone',
      description: 'AI Computer Vision audit detected no Class ABC / CO2 fire extinguisher within 5 meters of active arc welding stations in Bay 3.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'OPEN',
      evidence_type: 'INFRASTRUCTURE_DEFICIENCY',
    },
    {
      alert_id: 'ALT-HIGH-9013',
      centre_id: 'TC-MH-PUN-0219',
      centre_name: 'Pune Industrial Skill Academy',
      batch_id: 'BATCH-2026-AUT-105',
      severity: 'HIGH',
      category: 'Trainer Compliance',
      title: 'Trainer Absent during Active Workshop Session',
      description: 'Certified Trainer Santosh Ghorpade (TR-MH-3301) has not been detected in classroom or workshop cameras for 24 continuous minutes.',
      timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      status: 'OPEN',
      evidence_type: 'TRAINER_FACIAL_ABSENCE',
    },
    {
      alert_id: 'ALT-MED-9014',
      centre_id: 'TC-KA-BLR-0104',
      centre_name: 'National Skill Training Institute - Bengaluru',
      batch_id: 'BATCH-2026-AI-401',
      severity: 'MEDIUM',
      category: 'Attendance Anomaly',
      title: 'Single Ghost Entry Detected in AI Lab',
      description: 'Candidate Ananya Deshmukh (STU-104) has biometric entry logged at 09:05 AM, but CCTV face detection failed to locate candidate in room 204.',
      timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      status: 'IN_REVIEW',
      action_taken: 'Biometric log quarantined for verification',
      resolution_note: 'Center Head contacted. Candidate reported sick after punch-in.',
      evidence_type: 'FACIAL_RECOGNITION_MISMATCH',
    },
    {
      alert_id: 'ALT-LOW-9015',
      centre_id: 'TC-DL-DEL-0308',
      centre_name: 'PMKK South Delhi Skill Hub',
      batch_id: null,
      severity: 'LOW',
      category: 'Camera Infrastructure',
      title: 'Classroom 02 CCTV Angle Partially Tilted',
      description: 'Computer vision camera calibration detects a 12-degree tilt away from default FOV, causing slight occlusion of rear row benches.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'RESOLVED',
      action_taken: 'Camera realigned by technician',
      resolution_note: 'Physical realignment completed at 10:15 AM.',
    },
  ];
  await db.collection('alerts').insertMany(alerts);

  // 5. Seed Baseline Cryptographic Audits
  const keyPair = generateKeyPair();
  const sampleAuditPayload = {
    audit_id: 'AUDIT-KA-2026-001',
    centre_id: 'TC-KA-BLR-0104',
    centre_name: 'National Skill Training Institute - Bengaluru',
    room_name: 'Room 204 - Advanced AI & IoT Lab',
    room_type: 'Computer IT Lab',
    compliance_score: 96,
    status: 'COMPLIANT',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    detections: [
      { label: 'Workstation Desktops (x24)', category: 'Trade Equipment', confidence: 0.98, status: 'PASSED' },
      { label: 'Class ABC Fire Extinguisher', category: 'Safety Equipment', confidence: 0.96, status: 'PASSED' },
      { label: 'AEBAS Biometric Terminal', category: 'Attendance Device', confidence: 0.97, status: 'PASSED' },
      { label: 'Wall First Aid Medical Kit', category: 'Safety Equipment', confidence: 0.93, status: 'PASSED' },
    ],
    checklist: [
      { item: 'Class ABC Fire Extinguisher installed & unblocked', mandatory: true, status: 'VERIFIED' },
      { item: 'Functional AEBAS biometric device with live sync', mandatory: true, status: 'VERIFIED' },
      { item: '1:1 Computer-to-student workstation ratio', mandatory: true, status: 'VERIFIED' },
      { item: 'Dual CCTV coverage without blind spots', mandatory: true, status: 'VERIFIED' },
    ],
    summary: 'All mandatory infrastructure norms under NSDC/DGT guidelines are fully satisfied.',
    inspector_id: 'AUDIT-99',
  };

  const recordHash = hashRecord(sampleAuditPayload);
  const digitalSignature = signRecord(recordHash, keyPair.privateKey);

  await db.collection('compliance_audits').insertOne({
    ...sampleAuditPayload,
    record_hash: recordHash,
    digital_signature: digitalSignature,
  });

  console.log('✅ Seeding completed successfully!');
  console.log('   Users:');
  console.log('     Admin/Directorate: ADMIN-001 / admin123');
  console.log('     Centre Head:       TC-BLR-01 / centre123');
  console.log('     AI Field Auditor:  AUDIT-99  / auditor123');
  console.log('   Centres: 6');
  console.log('   Batches: 4');
  console.log('   Alerts:  5');
  console.log('   Audits:  1 (Cryptographically Signed)');

  await client.close();
}

seed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
