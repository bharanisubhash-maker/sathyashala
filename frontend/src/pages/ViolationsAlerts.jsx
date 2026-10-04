import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Sparkles,
  ChevronRight,
  XCircle,
  FileText,
  UserX,
  Flame,
  Radio
} from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function ViolationsAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [counts, setCounts] = useState({ critical: 0, high: 0, medium: 0, total_open: 0 });
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeAlertModal, setActiveAlertModal] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [simulating, setSimulating] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API}/api/alerts?severity=${filterSeverity}&status=${filterStatus}`);
      setAlerts(res.data.alerts || []);
      if (res.data.counts) {
        setCounts(res.data.counts);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterSeverity, filterStatus]);

  // Handle resolving or updating alert
  const handleUpdateStatus = async (alertId, newStatus, actionName) => {
    try {
      await axios.patch(`${API}/api/alerts/${alertId}/status`, {
        status: newStatus,
        action_taken: actionName,
        resolution_note: actionNote || `Action taken: ${actionName} by Vigilance Officer.`,
      });
      setActiveAlertModal(null);
      setActionNote('');
      fetchAlerts();
    } catch (err) {
      console.error('Failed to update alert:', err);
    }
  };

  // Simulate live anomaly injection
  const handleSimulate = async (type) => {
    setSimulating(true);
    try {
      await axios.post(`${API}/api/alerts/simulate`, {
        type,
        centre_id: 'TC-KA-BLR-0104',
      });
      fetchAlerts();
    } catch (err) {
      console.error('Failed to simulate anomaly:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#160c18] via-[#1c0f20] to-[#120a16] p-6 rounded-2xl border border-rose-900/60 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 tracking-wider uppercase mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Central Vigilance & Anomaly Management Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Real-Time Anomaly & Violation Alert Center
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Live surveillance detection for attendance fraud, trainer absenteeism, CCTV tampering, and critical infrastructure deficiencies.
          </p>
        </div>

        {/* Counts summary */}
        <div className="flex items-center gap-3">
          <div className="bg-rose-950/80 border border-rose-800/80 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-rose-300 font-mono">{counts.critical}</div>
            <div className="text-[10px] text-rose-400 uppercase font-semibold">Critical</div>
          </div>
          <div className="bg-amber-950/80 border border-amber-800/80 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-amber-300 font-mono">{counts.high}</div>
            <div className="text-[10px] text-amber-400 uppercase font-semibold">High</div>
          </div>
          <div className="bg-blue-950/80 border border-blue-800/80 px-4 py-2 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-cyan-300 font-mono">{counts.total_open}</div>
            <div className="text-[10px] text-cyan-400 uppercase font-semibold">Open Total</div>
          </div>
        </div>
      </div>

      {/* Live Anomaly Simulator Strip (Evaluator Testing Tool) */}
      <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Live Demo Simulator (Inject Real-Time Infraction):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSimulate('GHOST_CANDIDATE')}
            disabled={simulating}
            className="px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-200 hover:bg-rose-900/70 flex items-center gap-1.5 transition-colors font-medium"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Proxy/Ghost Candidate</span>
          </button>
          <button
            onClick={() => handleSimulate('TRAINER_ABSENT')}
            disabled={simulating}
            className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-800 text-amber-200 hover:bg-amber-900/70 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Trainer Absent</span>
          </button>
          <button
            onClick={() => handleSimulate('FIRE_HAZARD')}
            disabled={simulating}
            className="px-3 py-1.5 rounded-lg bg-red-950/70 border border-red-800 text-red-200 hover:bg-red-900/70 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Fire Safety Breach</span>
          </button>
          <button
            onClick={() => handleSimulate('GEOFENCE_BREACH')}
            disabled={simulating}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-800 text-cyan-200 hover:bg-cyan-900/70 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Geofence Mismatch</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterSeverity === s
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#121f3a] text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Status:</span>
          {['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === st
                  ? 'bg-cyan-600 text-white'
                  : 'bg-[#121f3a] text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.alert_id}
            className={`p-5 rounded-2xl border transition-all ${
              alert.status === 'RESOLVED'
                ? 'bg-[#091222]/60 border-[#182645] opacity-75'
                : alert.severity === 'CRITICAL'
                ? 'bg-rose-950/20 border-rose-800/80 shadow-lg shadow-rose-950/20'
                : alert.severity === 'HIGH'
                ? 'bg-amber-950/20 border-amber-800/80'
                : 'bg-[#0b1428] border-[#1b2b4d]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-blue-950 text-cyan-300 border border-blue-800'
                  }`}>
                    {alert.severity}
                  </span>

                  <span className="text-xs font-mono text-slate-400">
                    ID: {alert.alert_id}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">
                    Category: <strong className="text-slate-200">{alert.category}</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{alert.title}</h3>
                <p className="text-xs text-slate-300 max-w-3xl">{alert.description}</p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                  <span>Centre: <strong className="text-cyan-300">{alert.centre_name}</strong></span>
                  {alert.batch_id && (
                    <span>Batch: <strong className="text-slate-200">{alert.batch_id}</strong></span>
                  )}
                  {alert.action_taken && (
                    <span className="text-emerald-400">Action: {alert.action_taken}</span>
                  )}
                </div>
              </div>

              {/* Status & Action Buttons */}
              <div className="flex md:flex-col items-end justify-between gap-2 shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                  alert.status === 'OPEN'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                    : alert.status === 'IN_REVIEW'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {alert.status}
                </span>

                {alert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => setActiveAlertModal(alert)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition-all"
                  >
                    <span>Take Action</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Dialog Modal */}
      {activeAlertModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="panel-glass max-w-lg w-full p-6 rounded-2xl border border-cyan-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b2b4d] pb-3">
              <div>
                <span className="text-xs font-mono text-rose-400 uppercase font-bold">
                  {activeAlertModal.severity} VIOLATION ACTION
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeAlertModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveAlertModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                {activeAlertModal.description}
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Officer Action Notes & Instructions:
                </label>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Enter directive to Training Centre or inspection order..."
                  rows={3}
                  className="w-full bg-[#0a1224] border border-[#1d2f55] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleUpdateStatus(activeAlertModal.alert_id, 'IN_REVIEW', 'Show Cause Notice Issued')}
                  className="px-3 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-800 font-semibold text-center transition-colors"
                >
                  Issue Show-Cause Notice
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeAlertModal.alert_id, 'IN_REVIEW', 'Subsidy Payment Frozen')}
                  className="px-3 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 font-semibold text-center transition-colors"
                >
                  Withhold Subsidy Payment
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeAlertModal.alert_id, 'IN_REVIEW', 'Flying Squad Inspector Dispatched')}
                  className="px-3 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-800 font-semibold text-center transition-colors"
                >
                  Dispatch Flying Squad
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeAlertModal.alert_id, 'RESOLVED', 'Deficiency Rectified & Verified')}
                  className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 font-semibold text-center transition-colors"
                >
                  Mark Rectified & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
