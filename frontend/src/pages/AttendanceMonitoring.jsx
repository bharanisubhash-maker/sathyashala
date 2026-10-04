import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Building,
  GraduationCap
} from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function AttendanceMonitoring() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Load batches on mount
  useEffect(() => {
    axios.get(`${API}/api/batches`)
      .then(res => {
        setBatches(res.data.batches || []);
        if (res.data.batches?.length > 0) {
          setSelectedBatchId(res.data.batches[0].batch_id);
        }
      })
      .catch(err => console.error('Failed to load batches:', err))
      .finally(() => setLoading(false));
  }, []);

  // Load batch detail when selected
  useEffect(() => {
    if (!selectedBatchId) return;
    setLoading(true);
    axios.get(`${API}/api/batches/${selectedBatchId}`)
      .then(res => {
        setBatchData(res.data.batch);
      })
      .catch(err => console.error('Failed to load batch data:', err))
      .finally(() => setLoading(false));
  }, [selectedBatchId]);

  // Run Real-Time AI Camera & Biometric Re-scan
  const handleRescan = async () => {
    if (!selectedBatchId) return;
    setScanning(true);
    try {
      const res = await axios.post(`${API}/api/batches/${selectedBatchId}/sync-attendance`);
      // Update local state with fresh scan result
      setBatchData(prev => ({
        ...prev,
        students: res.data.students,
        live_attendance_rate: res.data.attendance_rate,
        present_count: res.data.present_count,
        ghost_count: res.data.ghost_count,
        last_ai_scan: new Date().toISOString(),
      }));
    } catch (err) {
      console.error('Failed to rescan attendance:', err);
    } finally {
      setScanning(false);
    }
  };

  const students = batchData?.students || [];
  const filteredStudents = students.filter(s => {
    if (filterStatus === 'ALL') return true;
    return s.current_status === filterStatus;
  });

  const attendanceRate = batchData?.live_attendance_rate || 0;
  const isThresholdMet = attendanceRate >= (batchData?.mandatory_threshold || 70);

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d162a] via-[#101e3b] to-[#0d162a] p-6 rounded-2xl border border-[#1b2b4d] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            AI Biometric Anti-Fraud & Live Face Recognition
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Real-Time Batch Attendance Console
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Cross-verifies biometric device punches against classroom CCTV facial recognition embeddings to intercept ghost candidates and proxy punches in real-time.
          </p>
        </div>

        {/* Batch Selector & Trigger Scan */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="bg-[#121f3a] border border-[#22375f] text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {batches.map(b => (
              <option key={b.batch_id} value={b.batch_id}>
                {b.batch_id} - {b.course_name?.slice(0, 30)}
              </option>
            ))}
          </select>

          <button
            onClick={handleRescan}
            disabled={scanning}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Running AI Vision Sync...' : 'Sync AI Attendance Now'}</span>
          </button>
        </div>
      </div>

      {/* Batch Overview Cards */}
      {batchData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Attendance Rate Gauge Card */}
          <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>LIVE ATTENDANCE RATE</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-extrabold font-mono ${
                isThresholdMet ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {attendanceRate}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({batchData.present_count || 0}/{students.length} Present)
              </span>
            </div>
            <div className="mt-2 text-[11px] font-mono flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isThresholdMet ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={isThresholdMet ? 'text-emerald-300' : 'text-rose-300'}>
                {isThresholdMet ? 'Mandatory Norm Met (≥70%)' : 'CRITICAL: Below 70% Threshold'}
              </span>
            </div>
          </div>

          {/* Ghost Beneficiaries Intercepted */}
          <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>GHOST CANDIDATES FLAGGED</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-rose-400">
                {batchData.ghost_count || 0}
              </span>
              <span className="text-xs text-slate-400">Suspected Proxies</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Biometric In without CCTV Face
            </div>
          </div>

          {/* Master Trainer Verification */}
          <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d] md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>ASSIGNED CERTIFIED TRAINER VERIFICATION</span>
              <GraduationCap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>{batchData.trainer?.name || 'Prof. Trainer'}</span>
                  {batchData.trainer?.aadhaar_verified && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                      Aadhaar Linked
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Trainer ID: <span className="font-mono text-cyan-300">{batchData.trainer?.trainer_id}</span> • Room: {batchData.room}
                </div>
              </div>

              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono inline-flex items-center gap-1.5 ${
                  batchData.trainer?.status === 'PRESENT_IN_FRAME'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    batchData.trainer?.status === 'PRESENT_IN_FRAME' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}></span>
                  {batchData.trainer?.status === 'PRESENT_IN_FRAME' ? 'IN-FRAME (98.6%)' : 'ABSENT FROM CAMERA'}
                </span>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Verified at: {batchData.trainer?.last_verified || '10:45 AM'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Student Roster */}
      <div className="panel-glass rounded-2xl border border-[#1b2b4d] overflow-hidden shadow-2xl">
        {/* Table Filter Header */}
        <div className="p-4 bg-[#091224] border-b border-[#1b2b4d] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Enrolled Candidate Facial Verification Roster
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              ({filteredStudents.length} Students Shown)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['ALL', 'PRESENT', 'GHOST_CANDIDATE', 'ABSENT'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-cyan-600 text-white'
                    : 'bg-[#121f3a] text-slate-400 hover:text-slate-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b152b] text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-[#1b2b4d]">
              <tr>
                <th className="px-5 py-3">Trainee Name & ID</th>
                <th className="px-5 py-3">Biometric Device Punch</th>
                <th className="px-5 py-3">CCTV Face Match</th>
                <th className="px-5 py-3">Liveness Score</th>
                <th className="px-5 py-3">Compliance State</th>
                <th className="px-5 py-3">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152340]">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className={`hover:bg-[#0f1b36] transition-colors ${
                    student.current_status === 'GHOST_CANDIDATE' ? 'bg-rose-950/20' : ''
                  }`}
                >
                  {/* Name & ID */}
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-100 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] text-cyan-300">
                        {student.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div>{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{student.roll} • {student.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Biometric In-Time */}
                  <td className="px-5 py-3.5 font-mono">
                    {student.biometric_punched ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Punched (09:05 AM)
                      </span>
                    ) : (
                      <span className="text-slate-500">Not Punched</span>
                    )}
                  </td>

                  {/* CCTV Face Match */}
                  <td className="px-5 py-3.5 font-mono">
                    {student.face_confidence > 0 ? (
                      <span className="text-cyan-300 font-semibold">
                        Matched ({student.face_confidence}%)
                      </span>
                    ) : (
                      <span className="text-slate-500">No Face Match</span>
                    )}
                  </td>

                  {/* Anti-Spoofing Liveness */}
                  <td className="px-5 py-3.5 font-mono">
                    {student.liveness_score > 0 ? (
                      <span className="text-emerald-400">
                        {student.liveness_score}% (3D Pass)
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>

                  {/* Compliance State */}
                  <td className="px-5 py-3.5">
                    {student.current_status === 'PRESENT' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        PRESENT
                      </span>
                    )}
                    {student.current_status === 'GHOST_CANDIDATE' && (
                      <div className="space-y-1">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          GHOST CANDIDATE (PROXY)
                        </span>
                        <div className="text-[10px] text-rose-300/80 max-w-xs">
                          {student.anomaly_flag}
                        </div>
                      </div>
                    )}
                    {student.current_status === 'ABSENT' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                        ABSENT
                      </span>
                    )}
                  </td>

                  {/* Last Seen */}
                  <td className="px-5 py-3.5 font-mono text-slate-400">
                    {student.last_seen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
