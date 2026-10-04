import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Video,
  Maximize2,
  Minimize2,
  RefreshCw,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  AlertCircle,
  Lock,
  EyeOff
} from 'lucide-react';

export default function LiveStreamPlayer({
  defaultFeed = 'it_lab',
  onCaptureAudit = null,
  centreName = 'NSTI Bengaluru - Room 204'
}) {
  const [activeFeed, setActiveFeed] = useState(defaultFeed);
  const [useWebcam, setUseWebcam] = useState(false);
  const [showFaceBoxes, setShowFaceBoxes] = useState(true);
  const [showInfraBoxes, setShowInfraBoxes] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [tamperAlert, setTamperAlert] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Handle webcam start / stop
  useEffect(() => {
    if (useWebcam) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 1280, height: 720 } })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.warn('Webcam permission denied or not available:', err);
          setUseWebcam(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [useWebcam]);

  // Feed simulated presets
  const feeds = {
    it_lab: {
      name: 'IoT & AI Computer Lab (CAM-02)',
      type: 'Computer IT Lab',
      room: 'Room 204',
      attendance: '16/20 Present (80%)',
      status: 'COMPLIANT',
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
      faceBoxes: [
        { label: 'Trainee: Aarav Sharma [98%]', top: '38%', left: '18%', width: '12%', height: '18%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Trainee: Priya N. [97%]', top: '40%', left: '38%', width: '12%', height: '18%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Trainee: Rohan V. [96%]', top: '42%', left: '58%', width: '12%', height: '18%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Trainee: Kavita S. [98%]', top: '39%', left: '78%', width: '12%', height: '18%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Instructor: Prof. Kulkarni [99%]', top: '22%', left: '6%', width: '14%', height: '24%', color: 'border-cyan-400 text-cyan-300' },
      ],
      infraBoxes: [
        { label: 'Mandatory Fire Extinguisher [96%]', top: '15%', left: '88%', width: '8%', height: '22%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'AEBAS Biometric Unit [97%]', top: '65%', left: '86%', width: '11%', height: '20%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Smartboard / Projector [94%]', top: '12%', left: '32%', width: '36%', height: '22%', color: 'border-cyan-400 text-cyan-300' },
        { label: 'Workstations 1:1 Ratio [98%]', top: '62%', left: '15%', width: '68%', height: '26%', color: 'border-blue-400 text-blue-300' },
      ]
    },
    classroom: {
      name: 'Smart Classroom 101 (CAM-01)',
      type: 'Theory Classroom',
      room: 'Hall A',
      attendance: '24/28 Present (85.7%)',
      status: 'COMPLIANT',
      bgGradient: 'from-slate-900 via-sky-950 to-slate-900',
      faceBoxes: [
        { label: 'Instructor In-Frame [98%]', top: '25%', left: '42%', width: '15%', height: '26%', color: 'border-cyan-400 text-cyan-300' },
        { label: 'Trainee: Sneha K. [99%]', top: '56%', left: '22%', width: '13%', height: '20%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Trainee: Karthik R. [97%]', top: '58%', left: '44%', width: '13%', height: '20%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Trainee: Divya N. [98%]', top: '57%', left: '66%', width: '13%', height: '20%', color: 'border-emerald-400 text-emerald-300' },
      ],
      infraBoxes: [
        { label: 'Dual CCTV Dome Active [95%]', top: '8%', left: '4%', width: '9%', height: '14%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'First Aid Medical Kit [93%]', top: '20%', left: '88%', width: '8%', height: '16%', color: 'border-emerald-400 text-emerald-300' },
      ]
    },
    workshop: {
      name: 'Automotive & Fab Bay (CAM-03)',
      type: 'Mechanical Practical',
      room: 'Workshop Bay 3',
      attendance: '17/24 Present (70.8%)',
      status: 'WARNING',
      bgGradient: 'from-slate-900 via-amber-950 to-slate-900',
      faceBoxes: [
        { label: 'Trainee: Aarav (PPE Verified) [97%]', top: '44%', left: '26%', width: '14%', height: '22%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Trainee: Deepak (Safety Goggles OK) [96%]', top: '48%', left: '62%', width: '14%', height: '22%', color: 'border-emerald-400 text-emerald-300' },
      ],
      infraBoxes: [
        { label: '⚠️ MISSING Fire Extinguisher [Hot Work Zone]', top: '18%', left: '82%', width: '12%', height: '25%', color: 'border-rose-500 text-rose-300 animate-pulse' },
        { label: 'Welding Exhaust Ventilation [92%]', top: '6%', left: '20%', width: '48%', height: '18%', color: 'border-amber-400 text-amber-300' },
      ]
    },
    entrance: {
      name: 'Main Entrance & Biometric Gate (CAM-04)',
      type: 'Aadhaar AEBAS Point',
      room: 'Reception Lobby',
      attendance: 'Live Inflow Stream',
      status: 'COMPLIANT',
      bgGradient: 'from-slate-900 via-emerald-950 to-slate-900',
      faceBoxes: [
        { label: 'Passing Trainee: Fatima Z. [Matched]', top: '32%', left: '44%', width: '16%', height: '25%', color: 'border-emerald-400 text-emerald-300' }
      ],
      infraBoxes: [
        { label: 'Aadhaar Terminal [ONLINE - Sync 1.2s]', top: '55%', left: '28%', width: '22%', height: '28%', color: 'border-emerald-400 text-emerald-300' },
        { label: 'Entrance CCTV Dome [99%]', top: '10%', left: '75%', width: '12%', height: '16%', color: 'border-cyan-400 text-cyan-300' },
      ]
    }
  };

  const currentFeed = feeds[activeFeed] || feeds.it_lab;

  const handleAuditClick = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (onCaptureAudit) {
        onCaptureAudit({
          feedId: activeFeed,
          feedName: currentFeed.name,
          preset: activeFeed === 'workshop' ? 'welding_lab_deficient' : 'it_lab_compliant',
        });
      }
    }, 1200);
  };

  return (
    <div className="panel-glass overflow-hidden border border-[#1b2b4d] shadow-2xl flex flex-col">
      {/* Stream Player Header */}
      <div className="bg-[#091224] px-4 py-3 border-b border-[#1b2b4d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 pulse-danger"></span>
          <span className="text-xs uppercase tracking-wider font-mono font-bold text-rose-400">
            {useWebcam ? 'WEBCAM INPUT' : 'LIVE RTSP FEED'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-sm font-semibold text-slate-200">{currentFeed.name}</span>
          <span className="text-xs text-slate-400 hidden sm:inline">({centreName})</span>
        </div>

        {/* Feed Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {Object.entries(feeds).map(([key, f]) => (
            <button
              key={key}
              onClick={() => { setActiveFeed(key); setUseWebcam(false); }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                !useWebcam && activeFeed === key
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-[#121f3a] text-slate-400 hover:text-slate-200'
              }`}
            >
              {key === 'it_lab' ? 'IT Lab' : key === 'classroom' ? 'Classroom' : key === 'workshop' ? 'Workshop' : 'Entrance'}
            </button>
          ))}

          {/* Toggle Real Webcam */}
          <button
            onClick={() => setUseWebcam(!useWebcam)}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              useWebcam
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#121f3a] text-slate-300 hover:text-emerald-400 border border-emerald-800/40'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{useWebcam ? 'Using My Cam' : 'Test Webcam'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Stream Container with AI HUD Overlays */}
      <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center select-none">
        {/* Actual Webcam OR Simulated Stream Video Canvas */}
        {useWebcam ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${currentFeed.bgGradient} relative flex items-center justify-center`}>
            {/* Visual Classroom Simulator Graphic */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {/* Room Schematic Simulation Elements */}
            <div className="text-center z-10 p-6 pointer-events-none">
              <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-500/10">
                <Video className="w-10 h-10 animate-pulse" />
              </div>
              <div className="text-base font-bold text-slate-100">{currentFeed.name}</div>
              <div className="text-xs text-cyan-400 font-mono mt-1">RTSP Stream: 192.168.1.104:554/live/ch1</div>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs text-slate-300 font-mono">
                <span>Attendance: <strong className="text-emerald-400">{currentFeed.attendance}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Scanlines Effect */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none"></div>

        {/* Real-Time Scanning Beam Animation if Active */}
        {isScanning && <div className="scanning-beam"></div>}

        {/* Live HUD Corner Watermark */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur border border-slate-700/60 rounded px-2.5 py-1 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-live"></span>
            <span>REC • 1080P @ 30FPS</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400">LATENCY: 26ms</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 z-20 pointer-events-none flex items-center gap-2">
          <div className="bg-slate-950/80 backdrop-blur border border-slate-700/60 rounded px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>GEO-VERIFIED: <strong className="text-emerald-300">12.9716° N, 77.5946° E</strong></span>
          </div>
          {privacyMode && (
            <div className="bg-emerald-950/90 backdrop-blur border border-emerald-700 rounded px-2.5 py-1 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-lg">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>DPDP PRIVACY ACTIVE</span>
            </div>
          )}
        </div>

        {/* AI Bounding Boxes: Facial Recognition OR Aggregate Head Count (Privacy Mode) */}
        {showFaceBoxes && currentFeed.faceBoxes?.map((b, idx) => (
          <div
            key={`face-${idx}`}
            style={{ top: b.top, left: b.left, width: b.width, height: b.height }}
            className={`absolute border-2 rounded ${
              privacyMode
                ? 'backdrop-blur-xl bg-slate-950/60 border-emerald-400 text-emerald-300 shadow-emerald-950/50 shadow-lg'
                : `${b.color}`
            } pointer-events-none flex flex-col justify-between p-1 transition-all`}
          >
            <div className="bg-slate-950/90 text-[10px] font-mono px-1 py-0.5 rounded shadow self-start whitespace-nowrap flex items-center gap-1">
              {privacyMode ? (
                <>
                  <Lock className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Head #{idx + 1} (De-Identified)</span>
                </>
              ) : (
                <span>{b.label}</span>
              )}
            </div>
            <div className="text-[9px] font-mono self-end text-emerald-400 bg-slate-950/90 px-1 rounded">
              {privacyMode ? 'Aggregate Presence: OK' : 'Liveness: 99.2%'}
            </div>
          </div>
        ))}

        {/* AI Bounding Boxes: Infrastructure & Equipment */}
        {showInfraBoxes && currentFeed.infraBoxes?.map((b, idx) => (
          <div
            key={`infra-${idx}`}
            style={{ top: b.top, left: b.left, width: b.width, height: b.height }}
            className={`absolute border-2 border-dashed rounded ${b.color} pointer-events-none p-1 transition-all`}
          >
            <div className="bg-slate-950/90 text-[10px] font-mono px-1 py-0.5 rounded shadow self-start whitespace-nowrap">
              {b.label}
            </div>
          </div>
        ))}

        {/* Tamper Warning Overlay if triggered */}
        {tamperAlert && (
          <div className="absolute inset-0 bg-rose-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <AlertCircle className="w-12 h-12 text-rose-500 animate-bounce mb-3" />
            <h3 className="text-lg font-bold text-white">CCTV FEED TAMPERING / OCCLUSION DETECTED</h3>
            <p className="text-xs text-rose-200 max-w-md mt-1">
              AI Vision engine flagged sudden lens blockage or video frame freeze exceeding 15 seconds. Alert dispatched to district vigilance cell.
            </p>
            <button
              onClick={() => setTamperAlert(false)}
              className="mt-4 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold"
            >
              Dismiss Tamper Alert
            </button>
          </div>
        )}
      </div>

      {/* Real-time Discrepancy Cross-Check Strip */}
      <div className="bg-[#060c18] px-4 py-2 border-t border-[#15223c] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Portal Sanctioned Roster: <strong className="text-slate-200">20 Students</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">CCTV Aggregate Head Count: <strong className="text-emerald-400 font-bold">16 Present</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400">Discrepancy: -4 (-20%)</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Equipment Operability: <strong className="text-emerald-400">4/4 Norms Satisfied</strong>
        </div>
      </div>

      {/* Stream Controls & AI Detection Toggles */}
      <div className="bg-[#0a1428] px-4 py-3 border-t border-[#1b2b4d] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          {/* Privacy Mode Toggle */}
          <button
            onClick={() => setPrivacyMode(!privacyMode)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              privacyMode
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600 shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            {privacyMode ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{privacyMode ? 'Privacy: Aggregate Headcount (Face Blur ON)' : 'Privacy: Unmasked (Audit View)'}</span>
          </button>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={showInfraBoxes}
              onChange={(e) => setShowInfraBoxes(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
            />
            <span className="font-medium">Infrastructure Norm Objects</span>
          </label>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTamperAlert(true)}
            className="px-2.5 py-1.5 rounded bg-rose-950/60 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60 transition-colors"
          >
            Test Tamper Alert
          </button>

          <button
            onClick={handleAuditClick}
            disabled={isScanning}
            className="px-4 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isScanning ? 'AI Inspecting...' : 'Run Instant AI Audit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
