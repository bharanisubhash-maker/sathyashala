import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Fingerprint,
  Cpu,
  Server,
  Key,
  Layers,
  Sparkles,
  HelpCircle,
  BadgeCheck
} from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function PrivacyArchitecture() {
  const [activeView, setActiveView] = useState('ANONYMIZED'); // 'RAW' | 'ANONYMIZED' | 'HEADCOUNT_ONLY'
  const [auditData, setAuditData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/analytics/privacy-audit`)
      .then(res => setAuditData(res.data))
      .catch(err => console.error('Failed to load privacy audit:', err));
  }, []);

  const downloadComplianceCertificate = () => {
    setDownloading(true);
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = `VigiloSkill-DPDP-Privacy-Compliance-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d162a] via-[#101e3b] to-[#0d162a] p-6 rounded-2xl border border-[#1b2b4d] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            DPDP Act 2023 & ISO/IEC 27701 Compliant Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Privacy-Preserving Video Analytics & Design Note
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Ethical AI architecture utilizing aggregate presence detection rather than individual facial recognition. Edge-level de-identification ensures no biometric markers leave the centre premises.
          </p>
        </div>

        <button
          onClick={downloadComplianceCertificate}
          disabled={downloading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-transform hover:scale-[1.02]"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Exporting...' : 'Export DPDP Compliance Certificate'}</span>
        </button>
      </div>

      {/* Interactive Live Privacy Filter Simulator */}
      <div className="bg-[#0b1329] border border-[#1b2b4d] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b2b4d] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-emerald-400" />
              Live Edge De-Identification Visualizer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrates how the local edge micro-gateway strips identifiable biometric pixels before mathematical tallies are generated.
            </p>
          </div>

          {/* View Filter Switcher */}
          <div className="flex items-center bg-[#070e1c] p-1 rounded-xl border border-[#1b2b4d]">
            <button
              onClick={() => setActiveView('RAW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'RAW'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Camera Stream (Unfiltered)
            </button>
            <button
              onClick={() => setActiveView('ANONYMIZED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'ANONYMIZED'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Edge Gaussian Face Masking (Active Mode)
            </button>
            <button
              onClick={() => setActiveView('HEADCOUNT_ONLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'HEADCOUNT_ONLY'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Aggregate Headcount & Density Only
            </button>
          </div>
        </div>

        {/* Simulated Camera Canvas with Real-time Filters */}
        <div className="relative aspect-[16/9] max-h-[460px] w-full bg-slate-950 rounded-xl overflow-hidden border border-[#1b2b4d] flex items-center justify-center">
          {/* Background Laboratory Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 opacity-90"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

          {/* Classroom Trainee Figures Simulation */}
          <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
            {/* HUD Status Bar */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1 rounded-md text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>NSTI-BLR / CAM-02-ITLAB</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400">EDGE BUFFER: RAM-ONLY</span>
              </div>
              <div className="bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1 rounded-md text-emerald-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PRIVACY SHIELD: {activeView === 'RAW' ? 'OFF (AUDIT DEV ONLY)' : 'STRICT ACTIVE'}</span>
              </div>
            </div>

            {/* Simulated Trainee Stations Overlay */}
            <div className="grid grid-cols-4 gap-4 my-auto">
              {[
                { id: 'TRN-01', head: '38%', desk: 'Station #01', occupied: true },
                { id: 'TRN-02', head: '42%', desk: 'Station #02', occupied: true },
                { id: 'TRN-03', head: '35%', desk: 'Station #03', occupied: true },
                { id: 'TRN-04', head: '0%', desk: 'Station #04', occupied: false }
              ].map((s, idx) => (
                <div key={idx} className="relative bg-[#0e1a38]/80 border border-cyan-500/20 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] text-center">
                  {s.occupied ? (
                    <>
                      {/* Trainee Head Representation */}
                      <div className="relative mb-2">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          activeView === 'RAW'
                            ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-300'
                            : activeView === 'ANONYMIZED'
                            ? 'bg-slate-700/80 backdrop-blur-xl border-2 border-dashed border-emerald-400 text-emerald-400 shadow-inner'
                            : 'bg-cyan-950/80 border-2 border-cyan-400 text-cyan-300'
                        }`}>
                          {activeView === 'RAW' ? (
                            <Eye className="w-7 h-7 text-amber-400" />
                          ) : activeView === 'ANONYMIZED' ? (
                            <div className="flex flex-col items-center">
                              <EyeOff className="w-6 h-6 text-emerald-400" />
                              <span className="text-[8px] font-mono tracking-tighter uppercase mt-0.5">Gaussian Blur</span>
                            </div>
                          ) : (
                            <span className="font-mono text-xs font-bold text-cyan-300">#0{idx + 1}</span>
                          )}
                        </div>

                        {/* Privacy Shield Badge */}
                        {activeView !== 'RAW' && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-950 border border-emerald-600 text-emerald-300 p-0.5 rounded-full">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Station Info */}
                      <div className="text-xs font-bold text-slate-200">{s.desk}</div>
                      <div className="text-[10px] font-mono mt-0.5">
                        {activeView === 'RAW' ? (
                          <span className="text-amber-400 font-semibold">[Face Landmarked: 98.4%]</span>
                        ) : activeView === 'ANONYMIZED' ? (
                          <span className="text-emerald-400">[De-Identified Head Target]</span>
                        ) : (
                          <span className="text-cyan-400">[Present: 1 Head Unit]</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-slate-500 text-xs font-mono flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center">
                        <span className="text-[10px]">VACANT</span>
                      </div>
                      <span>{s.desk}</span>
                      <span className="text-[10px] text-slate-600">[0 Head Detected]</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Aggregate Counter HUD */}
            <div className="bg-slate-900/95 backdrop-blur border border-slate-700/80 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400">Aggregate Physical Count: </span>
                  <strong className="text-emerald-400 font-mono text-sm">3 Trainees Detected</strong>
                </div>
                <div className="hidden sm:inline text-slate-600">|</div>
                <div className="hidden sm:block">
                  <span className="text-slate-400">Portal Sanctioned Cap: </span>
                  <strong className="text-slate-200 font-mono">4 Seats</strong>
                </div>
              </div>
              <div className="text-slate-400 text-[11px] font-mono flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Facial Embeddings Saved to Disk or Cloud</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Note Explainer Callout */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-3 text-xs leading-relaxed text-emerald-200">
          <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-300 font-bold">Why Aggregate Detection Matters:</strong> Government vocational skilling schemes require verification that sanctioned seats are occupied and trainees are actively attending. Individual facial recognition introduces severe privacy concerns, consent overhead, and biometric risk under India's Digital Personal Data Protection (DPDP) Act 2023. VigiloSkill solves this by running an **aggregate head/person detection algorithm** on-edge, verifying headcounts without storing any facial identities.
          </div>
        </div>
      </div>

      {/* Side-by-Side: What Is Detected vs What Is Never Stored */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What IS Processed */}
        <div className="bg-[#0b1329] border border-emerald-900/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-[#1b2b4d] pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>What VigiloSkill AI ACTUALLY Identifies</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Aggregate Trainee Head Count:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Total count of persons present in classrooms or workshop bays compared against the approved batch roster.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Approved Infrastructure Inventory Items:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Presence and bounding box validation of workstations, arc welders, 3D printers, workbenches, and tools against sanction records.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Safety Norms & Emergency Hardware:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Presence of Class ABC fire extinguishers, first aid kits, emergency cutoff switches, and required PPE gear (helmets, gloves, eye shields).</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Biometric Device Availability:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Operational status and sync latency of wall-mounted AEBAS biometric punch units.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Cryptographic SHA-256 Frame Proofs:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Digital hash of audit keyframe for dispute-proof verification without exposing video footage.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* What IS NOT Stored */}
        <div className="bg-[#0b1329] border border-rose-900/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base border-b border-[#1b2b4d] pb-3">
            <XCircle className="w-5 h-5 text-rose-400" />
            <span>What Is NEVER Identified, Stored, or Exported</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">No Trainee Facial Biometric Vectors:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">No 128-d or 512-d facial embedding vectors are ever generated, stored in databases, or matched against candidate registries.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">No Personally Identifiable Imagery:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">High-resolution face snapshots of students are never stored unmasked. Edge micro-gateways blur facial pixels in temporary volatile memory.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">No Continuous Video Streaming to Cloud:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">Continuous raw 1080p RTSP video streams remain strictly on the local centre LAN. Only lightweight JSON numerical tallies leave the gateway.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">No Demographic or Behavioral Profiling:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">The system forbids emotion tracking, gender classification, demographic tagging, or student attention scoring.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">No Third-Party Cloud Data Sharing:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">All telemetry is cryptographically signed via Ed25519 and sent directly to government ministry servers over mTLS.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Edge-First Zero-Knowledge Architecture Pillars */}
      <div className="bg-[#0b1329] border border-[#1b2b4d] rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Architectural Privacy Guarantees
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#070e1c] p-4 rounded-xl border border-[#1b2b4d] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">Edge-Inference Isolation</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Video decoding and neural network forward-passes execute strictly inside the training centre on an edge micro-gateway (e.g. Raspberry Pi 5 or Jetson Orin Nano). Video frames are held exclusively in volatile RAM and destroyed after each inference cycle.
            </p>
          </div>

          <div className="bg-[#070e1c] p-4 rounded-xl border border-[#1b2b4d] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <Server className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">Data Minimization Principle</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              In accordance with Section 6 of DPDP Act 2023, only the minimum data required to satisfy compliance verification is transmitted: <code className="text-cyan-300 font-mono font-bold">headcount: 22</code> and <code className="text-cyan-300 font-mono font-bold">equipment_valid: true</code>.
            </p>
          </div>

          <div className="bg-[#070e1c] p-4 rounded-xl border border-[#1b2b4d] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-400">
              <Key className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white">Cryptographic Non-Repudiation</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each telemetry record is signed on-edge using an asymmetric Ed25519 private key burnt into the edge hardware TPM. Central monitoring units can verify the authenticity of the audit without ever inspecting raw camera footage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
