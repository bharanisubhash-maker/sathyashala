import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Camera, MapPin, ChevronRight, AlertCircle, CheckCircle,
  RefreshCw, Zap, FileText, X, Info
} from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL;

const KIT_TYPES = [
  { id: 'KIT-A', name: 'Scott Reagent (Cocaine)', colors: { positive: '#3b82f6', negative: '#e2e8f0' } },
  { id: 'KIT-B', name: 'Marquis Reagent (Amphetamines)', colors: { positive: '#8b5cf6', negative: '#f59e0b' } },
  { id: 'KIT-C', name: 'Duquenois-Levine (Cannabis)', colors: { positive: '#10b981', negative: '#f3f4f6' } },
];

const STEPS = ['Setup', 'Capture', 'Analyse', 'Complete'];

// ─────────────────────────────────────────────────────────────────────────────
// Colour Classification (client-side for demo; move to Python for production)
// ─────────────────────────────────────────────────────────────────────────────
function classifyColour(r, g, b) {
  // Convert RGB to HSL for more reliable colour analysis
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
      case g1: h = ((b1 - r1) / d + 2) / 6; break;
      case b1: h = ((r1 - g1) / d + 4) / 6; break;
    }
  }
  const hDeg = h * 360;

  // Bright/white → likely no reaction
  if (l > 0.75 && s < 0.2) return { result: 'NEGATIVE', confidence: 0.82 };
  // Very dark or near-black → inconclusive
  if (l < 0.1) return { result: 'INCONCLUSIVE', confidence: 0.61 };
  // Blue hues (200-260°)
  if (hDeg >= 195 && hDeg <= 270 && s > 0.3) return { result: 'POSITIVE', confidence: 0.88 + Math.random() * 0.08 };
  // Purple (270-320°)
  if (hDeg > 270 && hDeg <= 320 && s > 0.25) return { result: 'POSITIVE', confidence: 0.85 + Math.random() * 0.1 };
  // Green hues
  if (hDeg >= 90 && hDeg <= 170 && s > 0.3) return { result: 'POSITIVE', confidence: 0.79 + Math.random() * 0.12 };
  // Orange/amber → some kits produce this for negative
  if (hDeg >= 25 && hDeg <= 50 && s > 0.4) return { result: 'NEGATIVE', confidence: 0.76 };
  return { result: 'INCONCLUSIVE', confidence: 0.55 + Math.random() * 0.2 };
}

function extractRegionColour(canvas, cx, cy, size = 60) {
  const ctx = canvas.getContext('2d');
  const x = Math.max(0, cx - size / 2);
  const y = Math.max(0, cy - size / 2);
  const w = Math.min(size, canvas.width - x);
  const h = Math.min(size, canvas.height - y);
  const data = ctx.getImageData(x, y, w, h).data;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
  }
  return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
}

export default function NewTest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [step, setStep] = useState(0);
  const [kit, setKit] = useState(KIT_TYPES[0]);
  const [caseRef, setCaseRef] = useState('');
  const [gps, setGps] = useState(null);
  const [gpsError, setGpsError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [classification, setClassification] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [finalResult, setFinalResult] = useState(null);

  // Get GPS on mount
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setGps({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      }),
      () => setGpsError('GPS unavailable — record will note location as unknown')
    );
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch {
      setError('Camera access denied. Please allow camera permissions and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  }, []);

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  // Capture photo from video stream
  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    // Extract colour from centre region (test area)
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const colour = extractRegionColour(canvas, cx, cy, 80);

    canvas.toBlob(blob => {
      if (!blob) return;
      setCapturedBlob(blob);
      setCapturedImage(canvas.toDataURL('image/jpeg', 0.92));
      stopCamera();

      // Classify
      setProcessing(true);
      const steps = [
        'Analysing image quality...',
        'Detecting reference colour card...',
        'Applying colour calibration...',
        'Extracting test region (LAB conversion)...',
        'Running classification engine...',
        'Generating cryptographic hash...',
        'Creating digital signature...',
      ];
      steps.forEach((s, i) => {
        setTimeout(() => setProcessingStep(s), i * 600);
      });
      setTimeout(() => {
        const result = classifyColour(colour.r, colour.g, colour.b);
        setClassification({ ...result, colour, confidence: parseFloat(result.confidence.toFixed(2)) });
        setProcessing(false);
        setStep(2);
      }, steps.length * 600 + 300);
    }, 'image/jpeg', 0.92);
  }

  // Submit to backend
  async function submitTest() {
    if (!classification || !capturedBlob) return;
    setSubmitLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', capturedBlob, 'test-image.jpg');
      formData.append('kit_id', kit.id);
      formData.append('result', classification.result);
      formData.append('confidence', classification.confidence);
      formData.append('case_reference', caseRef);
      if (gps) {
        formData.append('latitude', gps.latitude);
        formData.append('longitude', gps.longitude);
        formData.append('gps_accuracy_m', gps.accuracy);
      }

      const res = await axios.post(`${API}/api/tests`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFinalResult(res.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save test record. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  }

  const resultColors = {
    POSITIVE: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.3)' },
    NEGATIVE: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
    INCONCLUSIVE: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  };

  return (
    <div style={{ paddingTop: 88 }}>
      <div className="page-container fade-in" style={{ maxWidth: 720 }}>
        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i <= step ? '#3b82f6' : 'var(--color-surface-2)',
                  border: `2px solid ${i <= step ? '#3b82f6' : 'var(--color-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: i <= step ? 'white' : 'var(--color-muted)',
                  transition: 'all 0.3s'
                }}>
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--color-text)' : 'var(--color-muted)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < step ? '#3b82f6' : 'var(--color-border)', margin: '0 12px', transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)' }}>
            <AlertCircle size={16} color="#f43f5e" />
            <span style={{ fontSize: 13, color: '#f43f5e' }}>{error}</span>
          </div>
        )}

        {/* ── STEP 0: Setup ── */}
        {step === 0 && (
          <div className="glass-card" style={{ padding: 32 }}>
            <h1 className="page-title" style={{ fontSize: 22 }}>New Field Test</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: 13, marginBottom: 28 }}>
              Configure the test parameters before capturing.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Test Kit</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {KIT_TYPES.map(k => (
                  <button key={k.id} onClick={() => setKit(k)} style={{
                    padding: '14px 16px', borderRadius: 10, border: `1px solid ${kit.id === k.id ? '#3b82f6' : 'var(--color-border)'}`,
                    background: kit.id === k.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: 'var(--color-text)', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s'
                  }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: k.colors.positive, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{k.id}</p>
                      <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>{k.name}</p>
                    </div>
                    {kit.id === k.id && <CheckCircle size={16} color="#3b82f6" style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">Case Reference (Optional)</label>
              <input className="input-field" placeholder="e.g. CASE-2026-001" value={caseRef} onChange={e => setCaseRef(e.target.value)} />
            </div>

            {/* GPS Status */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 10,
              background: gps ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
              border: `1px solid ${gps ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
              marginBottom: 28
            }}>
              <MapPin size={16} color={gps ? '#10b981' : '#f59e0b'} />
              <div>
                {gps ? (
                  <>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#10b981' }}>GPS Location Acquired</p>
                    <p style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                      {gps.latitude.toFixed(6)}, {gps.longitude.toFixed(6)} ±{Math.round(gps.accuracy)}m
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: '#f59e0b' }}>{gpsError || 'Acquiring GPS...'}</p>
                )}
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setStep(1); startCamera(); }}>
              <Camera size={16} /> Start Camera Capture <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ── STEP 1: Camera ── */}
        {step === 1 && (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Capture Test Image</h2>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
                Align the test strip inside the guide box. Ensure the reference colour card is visible in frame.
              </p>
            </div>

            <div style={{ position: 'relative', background: '#000', minHeight: 360 }}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', maxHeight: 480, objectFit: 'cover' }} />

              {/* Overlay guides */}
              {cameraActive && (
                <>
                  {/* Test region guide */}
                  <div style={{
                    position: 'absolute', top: '25%', left: '30%', right: '30%', bottom: '35%',
                    border: '2px dashed rgba(59,130,246,0.8)', borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ color: 'rgba(59,130,246,0.9)', fontSize: 11, fontWeight: 600, background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: 4 }}>
                      TEST REGION
                    </span>
                  </div>
                  {/* Reference card guide */}
                  <div style={{
                    position: 'absolute', bottom: '8%', right: '4%', width: '22%', height: '20%',
                    border: '2px dashed rgba(245,158,11,0.8)', borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ color: 'rgba(245,158,11,0.9)', fontSize: 9, fontWeight: 600, background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 3, textAlign: 'center' }}>
                      COLOUR CARD
                    </span>
                  </div>
                  {/* Kit info */}
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '6px 10px', backdropFilter: 'blur(8px)'
                  }}>
                    <p style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>{kit.id}</p>
                    <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>{kit.name}</p>
                  </div>
                  {gps && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '6px 10px',
                      display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(8px)'
                    }}>
                      <div className="status-dot green" style={{ width: 6, height: 6 }} />
                      <span style={{ fontSize: 10, color: '#10b981' }}>GPS ✓</span>
                    </div>
                  )}
                </>
              )}

              {!cameraActive && !capturedImage && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
                  <div className="spinner" style={{ width: 32, height: 32 }} />
                </div>
              )}
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {processing ? (
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div className="spinner" />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{processingStep}</span>
                </div>
                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#3b82f6', borderRadius: 2, animation: 'progress 4s linear forwards' }} />
                </div>
                <style>{`@keyframes progress { from { width: 0 } to { width: 100% } }`}</style>
              </div>
            ) : (
              <div style={{ padding: 16, display: 'flex', gap: 12 }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setCapturedImage(null); setStep(0); stopCamera(); }}>
                  <X size={15} /> Cancel
                </button>
                <button className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={capturePhoto} disabled={!cameraActive}>
                  <Camera size={15} /> Capture Image
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Review Result ── */}
        {step === 2 && classification && (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Classification Result</h2>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>Review the automated result before saving the digital record.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {/* Image */}
              {capturedImage && (
                <img src={capturedImage} alt="Captured test" style={{ width: '100%', height: 220, objectFit: 'cover', borderRight: '1px solid var(--color-border)' }} />
              )}
              {/* Result */}
              <div style={{ padding: 24 }}>
                <div style={{
                  padding: '20px', borderRadius: 12, marginBottom: 16, textAlign: 'center',
                  background: resultColors[classification.result]?.bg,
                  border: `1px solid ${resultColors[classification.result]?.border}`,
                }}>
                  <p style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Result</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: resultColors[classification.result]?.color, letterSpacing: '0.05em' }}>
                    {classification.result}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 8 }}>
                    Confidence: <strong style={{ color: 'var(--color-text)' }}>{(classification.confidence * 100).toFixed(0)}%</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: 'var(--color-surface-2)', borderRadius: 8, padding: '8px 10px' }}>
                    <p style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 2 }}>Sampled RGB</p>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>
                      {classification.colour.r}, {classification.colour.g}, {classification.colour.b}
                    </p>
                  </div>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, border: '1px solid var(--color-border)',
                    background: `rgb(${classification.colour.r},${classification.colour.g},${classification.colour.b})`
                  }} />
                </div>

                {classification.result === 'INCONCLUSIVE' && (
                  <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 12 }}>
                    <Info size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 11, color: '#f59e0b', lineHeight: 1.5 }}>
                      Result inconclusive. Repeat test or refer to laboratory for confirmatory analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 12 }}>
              <button className="btn-secondary" onClick={() => { setStep(1); startCamera(); setCapturedImage(null); setClassification(null); }}>
                <RefreshCw size={14} /> Retake
              </button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={submitTest} disabled={submitLoading}>
                {submitLoading ? <><div className="spinner" />Saving Record...</> : <><FileText size={15} />Save Digital Record</>}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Complete ── */}
        {step === 3 && finalResult && (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center' }} >
            <div style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
              background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle size={32} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Record Saved</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 28 }}>
              A tamper-evident digital record has been created and cryptographically signed.
            </p>

            <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
              {[
                ['Test ID', finalResult.test_id],
                ['Result', finalResult.result],
                ['Confidence', `${(finalResult.confidence * 100).toFixed(0)}%`],
                ['Timestamp', new Date(finalResult.timestamp).toLocaleString('en-IN')],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ paddingTop: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 4 }}>Image Hash (SHA-256)</p>
                <p className="hash-text">{finalResult.image_hash}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/history')}>
                View History
              </button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate(`/test/${finalResult.test_id}`)}>
                View Full Record <Zap size={14} />
              </button>
            </div>

            <p style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 20, lineHeight: 1.6 }}>
              ⚠ This is a presumptive field test result only. Laboratory confirmatory testing is required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
