import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Building2,
  Video,
  Users,
  ShieldCheck,
  AlertTriangle,
  IndianRupee,
  Activity,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Radio,
  FileCheck
} from 'lucide-react';
import LiveStreamPlayer from '../components/LiveStreamPlayer';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [stateDistribution, setStateDistribution] = useState([]);
  const [tradeCompliance, setTradeCompliance] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, alertsRes, centresRes] = await Promise.all([
        axios.get(`${API}/api/analytics/overview`),
        axios.get(`${API}/api/alerts?limit=5`),
        axios.get(`${API}/api/centres`),
      ]);

      setMetrics(analyticsRes.data.metrics);
      setStateDistribution(analyticsRes.data.state_distribution || []);
      setTradeCompliance(analyticsRes.data.trade_compliance || []);
      setRecentAlerts(alertsRes.data.alerts || []);
      setCentres(centresRes.data.centres || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleCaptureAudit = (auditInfo) => {
    // Navigate to infrastructure scanner with preset
    navigate('/infrastructure', { state: { preset: auditInfo.preset, feedName: auditInfo.feedName } });
  };

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome & Mission Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d162a] via-[#101e3b] to-[#0d162a] p-6 rounded-2xl border border-[#1b2b4d] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            National Training Centres AI Surveillance Grid
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AI Real-Time Monitoring & Compliance Command Center
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Automated computer vision surveillance for vocational training centres under PMKVY, DGT, and NSDC. Live attendance anti-spoofing and equipment norm audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/infrastructure')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/40 flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Launch AI Scanner</span>
          </button>
          <button
            onClick={() => navigate('/violations')}
            className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 border border-rose-700/60 text-rose-200 text-xs font-bold shadow-lg shadow-rose-950/40 flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Active Violations ({metrics?.critical_alerts || 2})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Monitored Centres */}
        <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Monitored Centres</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">
              {metrics?.total_centres || 48}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              <span>●</span> {metrics?.active_streams || 184} Streams Live
            </div>
          </div>
        </div>

        {/* Live Attendance */}
        <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Live Attendance</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-300">
              {metrics?.average_attendance_rate || 88.9}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Min Threshold: 70%
            </div>
          </div>
        </div>

        {/* Infra Compliance */}
        <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Infra Compliance</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-blue-300">
              {metrics?.compliance_percentage || 94.2}%
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-mono">
              {metrics?.fully_compliant_centres || 42} Grade A+ / A
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Critical Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-rose-400">
              {metrics?.critical_alerts || 2}
            </div>
            <div className="text-[11px] text-rose-300 mt-1 font-mono">
              Requires Inspection
            </div>
          </div>
        </div>

        {/* Ghost Candidates Flagged */}
        <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Ghost Detected</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-300">
              {metrics?.ghost_candidates_prevented || 43}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Proxies Intercepted
            </div>
          </div>
        </div>

        {/* Subsidy Safeguarded */}
        <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Subsidy Saved</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-400">
              ₹{metrics?.subsidy_safeguarded_inr_lakhs || '42.8'}L
            </div>
            <div className="text-[11px] text-emerald-300 mt-1 font-mono">
              Public Funds Saved
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Live Stream CCTV Grid + Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live RTSP Stream Player with AI HUD */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-live"></span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Live AI Video Stream & Computer Vision HUD
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              Inference Mode: 30 FPS • Edge Acceleration
            </span>
          </div>

          <LiveStreamPlayer
            defaultFeed="it_lab"
            onCaptureAudit={handleCaptureAudit}
            centreName="NSTI Bengaluru (TC-KA-BLR-0104)"
          />
        </div>

        {/* Right 1 Col: Real-Time Anomaly Ticker & Live AI Telemetry */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Live Alerts & Infractions Panel */}
          <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d] flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Anomaly Alerts
                </h3>
              </div>
              <button
                onClick={() => navigate('/violations')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.alert_id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-950/40 border-rose-800/70 text-rose-200'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-950/40 border-amber-800/70 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="truncate pr-2">{alert.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-black/40">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{alert.centre_name?.slice(0, 24)}...</span>
                    <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Verification Safeguards */}
          <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              AI Compliance Safeguards Active
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white">Anti-Spoofing 3D Liveness:</strong> Flags photo prints and mobile screen replays at biometric points.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white">Continuous Trainer Presence:</strong> Validates certified trainer presence throughout scheduled session hours.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white">SHA-256 Tamper Proofing:</strong> All audit snapshots cryptographically signed with Ed25519 digital keys.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* State-by-State Compliance Matrix & Sector Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* State Performance */}
        <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              State-Wise Compliance Distribution
            </h3>
            <span className="text-xs text-slate-400">All India</span>
          </div>

          <div className="space-y-3">
            {stateDistribution.map((s) => (
              <div key={s.state} className="bg-[#0b1324] p-3 rounded-xl border border-[#192745]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">{s.state}</span>
                  <span className="text-slate-400 font-mono">
                    {s.centres} Centres • Compliance: <strong className="text-cyan-400">{s.compliance_avg}%</strong>
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.compliance_avg >= 90
                        ? 'bg-emerald-500'
                        : s.compliance_avg >= 80
                        ? 'bg-cyan-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${s.compliance_avg}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector / Trade Compliance */}
        <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Vocational Sector Compliance Norms
            </h3>
            <span className="text-xs text-slate-400">NSDC Sector Councils</span>
          </div>

          <div className="space-y-3">
            {tradeCompliance.map((t) => (
              <div key={t.trade} className="bg-[#0b1324] p-3 rounded-xl border border-[#192745] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">{t.trade}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Attendance Rate: <span className="text-emerald-400 font-mono font-medium">{t.attendance_rate}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-cyan-400 font-mono">
                    {t.compliance_rate}%
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Norm Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
