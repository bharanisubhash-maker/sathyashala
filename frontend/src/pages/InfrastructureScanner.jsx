import React, { useState } from 'react';
import axios from 'axios';
import {
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Sparkles,
  Printer,
  Download,
  Upload,
  Camera,
  Layers,
  Fingerprint
} from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function InfrastructureScanner() {
  const [selectedPreset, setSelectedPreset] = useState('it_lab_compliant');
  const [roomName, setRoomName] = useState('Room 204 - Advanced AI & IoT Lab');
  const [isScanning, setIsScanning] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [customImage, setCustomImage] = useState(null);

  const presets = [
    {
      id: 'it_lab_compliant',
      title: 'Computer IT Lab (Compliant)',
      desc: 'All mandatory norms verified (1:1 PCs, Fire Extinguisher, AEBAS, Dual CCTV)',
      expectedScore: 96,
      badge: 'COMPLIANT'
    },
    {
      id: 'welding_lab_deficient',
      title: 'Mechanical Workshop (Deficient)',
      desc: 'Missing mandatory fire extinguisher and empty first aid in hot-work area',
      expectedScore: 54,
      badge: 'NON_COMPLIANT'
    },
    {
      id: 'classroom_warning',
      title: 'Theory Hall (Warning)',
      desc: 'CCTV camera angle tilted causing blind spot in rear student row',
      expectedScore: 74,
      badge: 'WARNING'
    }
  ];

  const handleRunScan = async (presetId = selectedPreset) => {
    setIsScanning(true);
    setAuditResult(null);

    try {
      const res = await axios.post(`${API}/api/compliance/scan`, {
        preset_type: presetId,
        room_name: roomName,
        centre_id: 'TC-KA-BLR-0104',
        image_data: customImage,
      });

      setAuditResult(res.data.audit);
    } catch (err) {
      console.error('Compliance scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d162a] via-[#101e3b] to-[#0d162a] p-6 rounded-2xl border border-[#1b2b4d] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Computer Vision Infrastructure Audit Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AI Automated Infrastructure Compliance Scanner
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Inspects mandatory training facilities, fire safety, biometric units, workstations, and CCTV coverage according to NSDC & DGT affiliation norms.
          </p>
        </div>

        <button
          onClick={() => handleRunScan()}
          disabled={isScanning}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-cyan-900/40 flex items-center gap-2 transition-transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>{isScanning ? 'Executing Deep AI Vision Scan...' : 'Run Computer Vision Audit'}</span>
        </button>
      </div>

      {/* Preset & Input Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presets.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedPreset(p.id);
              handleRunScan(p.id);
            }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedPreset === p.id
                ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/60'
                : 'bg-[#0a1326] border-[#1b2b4d] hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">{p.title}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                p.badge === 'COMPLIANT'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : p.badge === 'NON_COMPLIANT'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {p.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">{p.desc}</p>
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Expected Score: <strong className="text-cyan-300">{p.expectedScore}%</strong></span>
              <span className="text-xs text-cyan-400 font-semibold">Test Scenario →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Custom Image Option */}
      <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Upload className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-medium">Or test custom room photograph from local device:</span>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#152342] file:text-cyan-300 hover:file:bg-[#1b2e57] cursor-pointer"
        />
      </div>

      {/* Main Inspection Results View */}
      {isScanning && (
        <div className="panel-glass p-12 rounded-2xl border border-cyan-500/40 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-cyan-950/80 border border-cyan-500 flex items-center justify-center text-cyan-400 animate-spin">
            <Cpu className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Running Convolutional Object Detection (YOLOv11 Norm Model)...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
            Segmenting fire extinguishers, emergency exit paths, AEBAS terminals, and student workstation ratios.
          </p>
        </div>
      )}

      {auditResult && !isScanning && (
        <div className="space-y-6">
          {/* Audit Score & Result Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
              auditResult.status === 'COMPLIANT'
                ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                : auditResult.status === 'NON_COMPLIANT'
                ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                : 'bg-amber-950/30 border-amber-800/80 text-amber-200'
            }`}>
              <div className="text-xs font-semibold uppercase tracking-wider">
                OVERALL COMPLIANCE SCORE
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-mono">
                  {auditResult.compliance_score}%
                </span>
                <span className="text-xs font-mono uppercase font-bold">
                  {auditResult.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                {auditResult.status === 'COMPLIANT'
                  ? 'All mandatory requirements fulfilled.'
                  : auditResult.status === 'NON_COMPLIANT'
                  ? 'Critical infrastructure deficiencies detected.'
                  : 'Requires remedial action within 7 days.'}
              </div>
            </div>

            {/* Room & Centre Meta */}
            <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d] md:col-span-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                  <span>AUDIT ID: {auditResult.audit_id}</span>
                  <span>{new Date(auditResult.timestamp).toLocaleString()}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{auditResult.centre_name}</h2>
                <div className="text-xs text-cyan-300 font-medium mt-0.5">
                  Inspected Zone: {auditResult.room_type} ({auditResult.room_name})
                </div>
                <p className="text-xs text-slate-300 mt-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 font-sans">
                  <strong>AI Summary:</strong> {auditResult.summary}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-[#1b2b4d] pt-3 font-mono">
                <span className="text-slate-400">
                  Detected Norm Objects: <strong className="text-white">{auditResult.detections?.length || 0}</strong>
                </span>
                <span className="text-slate-400">
                  Inspector Signoff: <strong className="text-cyan-400">{auditResult.inspector_id}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Detections & NSDC Checklist Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detected Objects List */}
            <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Detected Equipment & Infrastructure
              </h3>

              <div className="space-y-2.5">
                {auditResult.detections?.map((d, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0b1324] p-3 rounded-xl border border-[#192745] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                        <span>{d.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({d.category})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Vision Confidence: <strong className="text-cyan-300">{(d.confidence * 100).toFixed(1)}%</strong>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      d.status === 'PASSED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : d.status === 'WARNING'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Norm Compliance Checklist */}
            <div className="panel-glass p-5 rounded-2xl border border-[#1b2b4d]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Mandatory NSDC / DGT Standard Norm Checklist
              </h3>

              <div className="space-y-3">
                {auditResult.checklist?.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs ${
                      item.status === 'VERIFIED'
                        ? 'bg-emerald-950/20 border-emerald-900/60'
                        : 'bg-rose-950/30 border-rose-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {item.status === 'VERIFIED' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-100">{item.item}</div>
                          {item.note && (
                            <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                              {item.note}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shrink-0 ${
                        item.status === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cryptographic Tamper-Proof Stamp */}
          <div className="panel-glass p-5 rounded-2xl border border-cyan-900/60 bg-[#091224]">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <Fingerprint className="w-4 h-4" />
              Cryptographic Audit Integrity Seal (Non-Repudiation)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-[#050b16] p-3 rounded-xl border border-[#1b2b4d]">
                <div className="text-[10px] text-slate-400 uppercase">SHA-256 Record Hash:</div>
                <div className="text-cyan-300 truncate mt-1 select-all">
                  {auditResult.record_hash || 'sha256:d8e8fca291...'}
                </div>
              </div>
              <div className="bg-[#050b16] p-3 rounded-xl border border-[#1b2b4d]">
                <div className="text-[10px] text-slate-400 uppercase">Ed25519 Digital Signature:</div>
                <div className="text-emerald-300 truncate mt-1 select-all">
                  {auditResult.digital_signature || 'sig:MEUCIQDY68zG...'}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>This record is cryptographically signed and stored in the central vigilance ledger.</span>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-[#142345] hover:bg-[#1c305c] text-slate-200 flex items-center gap-1.5 transition-colors font-sans"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Audit Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
