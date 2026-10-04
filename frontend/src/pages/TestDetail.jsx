import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Shield, Clock, MapPin, Hash, FileSignature,
  CheckCircle, XCircle, AlertTriangle, ExternalLink
} from 'lucide-react';
import ResultBadge from '../components/ResultBadge';

const API = import.meta.env.VITE_BACKEND_URL;

function InfoRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid rgba(30,47,77,0.5)' }}>
      <span style={{ fontSize: 12, color: 'var(--color-muted)', flexShrink: 0, marginRight: 16, paddingTop: 2 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, textAlign: 'right', wordBreak: mono ? 'break-all' : 'normal', fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', fontSize: mono ? 11 : 13, color: mono ? 'var(--color-muted)' : 'var(--color-text)' }}>{value}</span>
    </div>
  );
}

function VerifyBadge({ ok, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10,
      background: ok ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
      border: `1px solid ${ok ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
    }}>
      {ok ? <CheckCircle size={15} color="#10b981" /> : <XCircle size={15} color="#f43f5e" />}
      <span style={{ fontSize: 13, fontWeight: 500, color: ok ? '#10b981' : '#f43f5e' }}>{label}</span>
    </div>
  );
}

export default function TestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [verify, setVerify] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/tests/${id}`),
      axios.get(`${API}/api/tests/${id}/verify`),
    ])
      .then(([t, v]) => { setTest(t.data); setVerify(v.data); })
      .catch(err => setError(err.response?.data?.error || 'Failed to load record.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: 88 }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  if (error) return (
    <div style={{ paddingTop: 88 }}>
      <div className="page-container" style={{ maxWidth: 600, textAlign: 'center', paddingTop: 48 }}>
        <XCircle size={40} color="#f43f5e" style={{ margin: '0 auto 12px', display: 'block' }} />
        <p style={{ color: '#f43f5e', fontSize: 16 }}>{error}</p>
        <button className="btn-secondary" style={{ marginTop: 20 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    </div>
  );

  const overallVerified = verify?.overall_status === 'VERIFIED';

  return (
    <div style={{ paddingTop: 88 }}>
      <div className="page-container fade-in" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <button className="btn-secondary" style={{ padding: '8px 12px' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 className="page-title" style={{ fontSize: 20, marginBottom: 2 }}>Test Record</h1>
            <code style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{test?.test_id}</code>
          </div>
          {verify && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10,
              background: overallVerified ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              border: `1px solid ${overallVerified ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
            }}>
              <Shield size={16} color={overallVerified ? '#10b981' : '#f43f5e'} />
              <span style={{ fontSize: 13, fontWeight: 700, color: overallVerified ? '#10b981' : '#f43f5e' }}>
                {overallVerified ? 'VERIFIED' : 'INTEGRITY FAILED'}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left: Test Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Result card */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600 }}>Classification Result</h2>
                <ResultBadge result={test?.result} size="lg" />
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--color-surface-2)', overflow: 'hidden', marginBottom: 8 }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  width: `${(test?.confidence || 0) * 100}%`,
                  background: test?.result === 'POSITIVE' ? '#f43f5e' : test?.result === 'NEGATIVE' ? '#10b981' : '#f59e0b',
                  transition: 'width 1s ease'
                }} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                Confidence: <strong style={{ color: 'var(--color-text)' }}>{test?.confidence ? `${(test.confidence * 100).toFixed(0)}%` : '—'}</strong>
              </p>
              <div className="accent-line" />
              <InfoRow label="Kit" value={test?.kit_id} />
              <InfoRow label="Classifier Version" value={test?.classifier_version} />
              {test?.case_reference && <InfoRow label="Case Reference" value={test.case_reference} />}
            </div>

            {/* Officer & Time */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Record Metadata</h2>
              <InfoRow label="Operator ID" value={test?.operator_id} />
              <InfoRow label="Timestamp" value={test?.timestamp ? new Date(test.timestamp).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'long' }) : '—'} />
              {test?.latitude ? (
                <>
                  <InfoRow label="Latitude" value={test.latitude} />
                  <InfoRow label="Longitude" value={test.longitude} />
                  <InfoRow label="GPS Accuracy" value={test.gps_accuracy_m ? `±${Math.round(test.gps_accuracy_m)}m` : '—'} />
                </>
              ) : (
                <InfoRow label="Location" value="Not available" />
              )}
              <InfoRow label="App Version" value={test?.app_version} />
            </div>
          </div>

          {/* Right: Image + Integrity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Image */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 14, fontWeight: 600 }}>Captured Image</h2>
                <a href={`${API}/api/tests/${id}/image`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Full size <ExternalLink size={12} />
                </a>
              </div>
              <img
                src={`${API}/api/tests/${id}/image`}
                alt="Test result"
                style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Cryptographic Integrity */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Shield size={16} color="#3b82f6" />
                <h2 style={{ fontSize: 14, fontWeight: 600 }}>Cryptographic Integrity</h2>
              </div>

              {verify && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <VerifyBadge ok={verify.image_hash_match} label="Image Hash Verified" />
                  <VerifyBadge ok={verify.record_hash_match} label="Record Hash Verified" />
                  <VerifyBadge ok={verify.signature_valid} label="Digital Signature Valid" />
                  <VerifyBadge ok={verify.timestamp_present} label="Timestamp Present" />
                  <VerifyBadge ok={verify.gps_present} label="GPS Location Present" />
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Hash size={11} /> Image Hash (SHA-256)
                </p>
                <p className="hash-text">{test?.image_hash}</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Hash size={11} /> Record Hash (SHA-256)
                </p>
                <p className="hash-text">{test?.record_hash}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FileSignature size={11} /> Digital Signature (Ed25519)
                </p>
                <p className="hash-text">{test?.signature}</p>
              </div>
            </div>

            <Link to={`/verify?id=${id}`} className="btn-secondary" style={{ justifyContent: 'center' }}>
              <Shield size={15} /> Run Full Verification
            </Link>
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'var(--color-muted)', textAlign: 'center', marginTop: 24, lineHeight: 1.6 }}>
          ⚠ This is a presumptive field test result only. Laboratory confirmatory testing is required before any evidentiary use.
        </p>
      </div>
    </div>
  );
}
