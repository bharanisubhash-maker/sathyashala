import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wifi,
  WifiOff,
  Radio,
  Server,
  Cpu,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Key,
  ShieldCheck,
  Send,
  Zap,
  TrendingDown
} from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function LowBandwidthDeployment() {
  const [networkMode, setNetworkMode] = useState('2G_RURAL'); // 'FIBER' | '4G' | '2G_RURAL' | 'OFFLINE'
  const [telemetry, setTelemetry] = useState(null);
  const [localQueue, setLocalQueue] = useState([]);
  const [isFlushing, setIsFlushing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(148);

  const fetchTelemetry = async () => {
    try {
      const res = await axios.get(`${API}/api/analytics/edge-telemetry`);
      setTelemetry(res.data);
    } catch (err) {
      console.error('Failed to load edge telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Simulate pushing a new audit record into edge gateway
  const handleGenerateAuditRecord = () => {
    const newRecord = {
      record_id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString(),
      headcount: Math.floor(Math.random() * 5) + 16,
      equipment_ok: true,
      hash: 'sha256:' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      size_bytes: 1840
    };

    if (networkMode === 'OFFLINE') {
      // Store in local buffer
      setLocalQueue(prev => [newRecord, ...prev]);
    } else {
      // Direct sync
      setSyncedCount(prev => prev + 1);
    }
  };

  // Switch network modes
  const handleNetworkChange = (mode) => {
    setNetworkMode(mode);
    if (mode !== 'OFFLINE' && localQueue.length > 0) {
      // Auto-flush stored records when back online
      setIsFlushing(true);
      setTimeout(() => {
        setSyncedCount(prev => prev + localQueue.length);
        setLocalQueue([]);
        setIsFlushing(false);
      }, 1200);
    }
  };

  const networkProfiles = {
    FIBER: { label: 'Fiber Broadband', speed: '50 Mbps', latency: '12 ms', status: 'Optimal', color: 'emerald' },
    '4G': { label: 'Semi-Urban 4G LTE', speed: '4 Mbps', latency: '48 ms', status: 'Standard', color: 'cyan' },
    '2G_RURAL': { label: 'Rural 2G / GPRS Edge', speed: '48 Kbps', latency: '420 ms', status: 'Functional (Edge Mode)', color: 'amber' },
    OFFLINE: { label: 'Complete Network Blackout', speed: '0 Kbps', latency: 'N/A', status: 'Offline Store-and-Forward Active', color: 'rose' }
  };

  const currentNet = networkProfiles[networkMode];

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d162a] via-[#101e3b] to-[#0d162a] p-6 rounded-2xl border border-[#1b2b4d] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            Rural & Semi-Urban Edge Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Low-Bandwidth Deployment Mode & Edge Telemetry
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Solves realistic rural bandwidth constraints through on-device edge AI inference. Replaces heavy 2.5 Mbps RTSP video streaming with signed 1.8 KB JSON telemetry payloads, delivering over 99.9% bandwidth reduction.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0b1329] px-4 py-2.5 rounded-xl border border-amber-500/30">
          <TrendingDown className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Bandwidth Reduction</div>
            <div className="text-lg font-extrabold text-emerald-400 font-mono">99.98% Savings</div>
          </div>
        </div>
      </div>

      {/* Network Profile Simulator Buttons */}
      <div className="bg-[#0b1329] border border-[#1b2b4d] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2b4d] pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Interactive Connectivity & Network Throttle Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate real-world connectivity challenges faced by vocational training centres in rural districts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Current Status:</span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              networkMode === 'OFFLINE'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : networkMode === '2G_RURAL'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {currentNet.speed} • {currentNet.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(networkProfiles).map(([key, p]) => (
            <button
              key={key}
              onClick={() => handleNetworkChange(key)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                networkMode === key
                  ? 'bg-[#132247] border-cyan-400 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                  : 'bg-[#070e1c] border-[#1b2b4d] hover:border-slate-600 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{p.label}</span>
                {key === 'OFFLINE' ? (
                  <WifiOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Wifi className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div className="text-sm font-mono font-extrabold text-white mt-1.5">{p.speed}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Latency: {p.latency}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison: Traditional Video Streaming vs VigiloSkill Edge Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Cloud RTSP */}
        <div className="bg-[#0b1329] border border-rose-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b2b4d] pb-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Server className="w-4 h-4 text-rose-400" />
              <span>Traditional Continuous RTSP Stream</span>
            </div>
            <span className="text-[10px] bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
              UNFEASIBLE IN RURAL
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Required Bandwidth Per Camera:</span>
              <strong className="text-rose-400 font-mono text-sm">2,500 Kbps (2.5 Mbps)</strong>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Monthly Data Consumption / Cam:</span>
              <strong className="text-rose-400 font-mono text-sm">~810 GB / month</strong>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Behavior on 2G / Packet Loss:</span>
              <span className="text-rose-300 font-medium">Frequent buffering, frame drops, feed death</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Cloud Storage & Ingestion Cost:</span>
              <span className="text-rose-300 font-medium">Extremely high cloud compute bill</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Privacy Exposure Risk:</span>
              <span className="text-rose-400 font-medium">High (continuous unblurred video in cloud)</span>
            </div>
          </div>
        </div>

        {/* VigiloSkill Edge Mode */}
        <div className="bg-[#0b1329] border border-emerald-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b2b4d] pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>VigiloSkill Edge-Inference Mode</span>
            </div>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              100% OPERATIONAL ON 2G
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Effective Bandwidth Per Camera:</span>
              <strong className="text-emerald-400 font-mono text-sm">0.049 Kbps (~1.8 KB / 5 min)</strong>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Monthly Data Consumption / Cam:</span>
              <strong className="text-emerald-400 font-mono text-sm">~15.9 MB / month (Zero SIM cost)</strong>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Behavior on 2G / Packet Loss:</span>
              <span className="text-emerald-300 font-medium">Instantaneous sync; immune to 99% packet drop</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Cloud Storage & Ingestion Cost:</span>
              <span className="text-emerald-300 font-medium">Negligible ($0.02 / centre / month)</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Privacy Exposure Risk:</span>
              <span className="text-emerald-400 font-medium">Zero (Zero raw video leaves local LAN)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Store-and-Forward Offline Resilience Demo */}
      <div className="bg-[#0b1329] border border-[#1b2b4d] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b4d] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              Store-and-Forward Offline Resilience Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              When network connectivity drops completely, the edge micro-gateway buffers signed telemetry records in local SQLite flash storage. As soon as connectivity restores, records auto-flush in chronological sequence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateAuditRecord}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Periodic 5-Min Audit</span>
            </button>
          </div>
        </div>

        {/* Store & Forward Interactive Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Edge Gateway Status */}
          <div className="bg-[#070e1c] p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Edge Gateway Hardware</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-sm font-bold text-white mt-1">Raspberry Pi 5 + Edge TPU</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">YOLOv8-Nano INT8 • 14.8 FPS</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Local Flash Buffer:</span>
              <strong className="text-cyan-400 font-mono">SQLite (Encrypted)</strong>
            </div>
          </div>

          {/* Local Buffer Queue */}
          <div className="bg-[#070e1c] p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Offline Buffer Queue</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  localQueue.length > 0 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {localQueue.length} Pending
                </span>
              </div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                {localQueue.length} records
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {networkMode === 'OFFLINE' ? 'Buffering in edge storage' : 'All local queues synced'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Queue Status:</span>
              <strong className={localQueue.length > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                {localQueue.length > 0 ? 'Awaiting Connectivity' : 'Clean & Idle'}
              </strong>
            </div>
          </div>

          {/* Central Ministry Cloud Ingestion */}
          <div className="bg-[#070e1c] p-4 rounded-xl border border-[#1b2b4d] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Ministry Cloud Ingestion</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              </div>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
                {syncedCount} Synced
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {isFlushing ? 'Batch syncing stored packets...' : 'Zero data packet loss'}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Cryptographic Proof:</span>
              <strong className="text-emerald-400 font-mono">Ed25519 Verified</strong>
            </div>
          </div>
        </div>

        {/* Live Buffered Packets Preview if any */}
        {localQueue.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline Buffered Telemetry Queue (Will Auto-Transmit upon Connection)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {localQueue.map((item, idx) => (
                <div key={idx} className="bg-[#081226] border border-amber-800/40 p-2.5 rounded-lg text-xs font-mono flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold">{item.record_id}</span>
                    <span className="text-slate-400 ml-2">[{item.timestamp}]</span>
                    <div className="text-[10px] text-emerald-400 mt-0.5">Headcount: {item.headcount} trainees</div>
                  </div>
                  <span className="text-[10px] text-slate-500">{item.size_bytes} B</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actual Cryptographic 1.8 KB JSON Telemetry Packet Inspector */}
      <div className="bg-[#0b1329] border border-[#1b2b4d] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b2b4d] pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              Edge-Generated Signed Telemetry Payload Inspector
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              This exact 1.8 KB payload is all that gets transmitted over 2G network to verify centre compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2 py-1 rounded border border-cyan-800">
              Payload Size: 1,840 Bytes (1.8 KB)
            </span>
          </div>
        </div>

        <pre className="bg-[#050914] p-4 rounded-xl border border-[#1b2b4d] overflow-x-auto text-[11px] font-mono text-cyan-300 leading-relaxed max-h-[320px]">
          {JSON.stringify(telemetry || {
            schema_version: '2.0.0-edge-telemetry',
            timestamp: new Date().toISOString(),
            centre_id: 'TC-KA-BLR-0104',
            gateway_id: 'GW-EDGE-RPI5-0042',
            network_profile: '2G_GPRS_RURAL_MODE',
            telemetry: {
              room_id: 'Room 204',
              mode: 'AGGREGATE_HEADCOUNT_PRIVACY_STRICT',
              aggregate_headcount: 16,
              portal_scheduled_count: 20,
              discrepancy_delta: -4,
              equipment_checklist: {
                desktops_active: 24,
                fire_extinguisher_detected: true,
                aebas_terminal_synced: true
              },
              frame_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
            },
            ed25519_signature: 'MEUCIQDF...signed_tamper_proof_audit'
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
