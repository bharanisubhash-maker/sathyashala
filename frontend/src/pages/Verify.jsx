import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Shield, Search, CheckCircle, XCircle, Hash, FileSignature, MapPin, Clock } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || '';

function CheckRow({ ok, label, desc }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
      borderBottom: '1px solid rgba(30,47,77,0.5)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: ok ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${ok ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`
      }}>
        {ok ? <CheckCircle size={18} color="#10b981" /> : <XCircle size={18} color="#f43f5e" />}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, fontSize: 14, color: ok ? '#10b981' : '#f43f5e' }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{desc}</p>}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
        background: ok ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
        color: ok ? '#10b981' : '#f43f5e',
        border: `1px solid ${ok ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`
      }}>
        {ok ? 'PASS' : 'FAIL'}
      </span>
    </div>
  );
}

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [testId, setTestId] = useState(searchParams.get('id') || '');
  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runVerification(id) {
    const tid = id || testId;
    if (!tid.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setTest(null);
    try {
      const [v, t] = await Promise.all([
        axios.get(`${API}/api/tests/${tid.trim()}/verify`),
        axios.get(`${API}/api/tests/${tid.trim()}`),
      ]);
      setResult(v.data);
      setTest(t.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Check the Test ID and try again.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-run if ?id= param provided
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) runVerification(id);
  }, []);

  const verified = result?.overall_status === 'VERIFIED';
  const checks = result ? [
    { ok: result.image_hash_match, label: 'Image Hash Match', desc: 'SHA-256 of stored image matches recorded hash — file not altered' },
    { ok: result.record_hash_match, label: 'Record Hash Match', desc: 'SHA-256 of test record fields matches stored hash — metadata not altered' },
    { ok: result.signature_valid, label: 'Digital Signature Valid', desc: 'Ed25519 signature verifies against server public key' },
    { ok: result.timestamp_present, label: 'Timestamp Present', desc: 'ISO 8601 timestamp recorded at time of test' },
    { ok: result.gps_present, label: 'GPS Location Present', desc: 'Latitude and longitude captured at test location' },
  ] : [];

  return (
    <div style={{ paddingTop: 88 }}>
      <div className="page-container fade-in" style={{ maxWidth: 700 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={28} color="#3b82f6" />
          </div>
          <h1 className="page-title">Record Verification</h1>
          <p className="page-subtitle">Cryptographically verify the integrity of any test record</p>
        </div>

        {/* Search */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <label className="input-label">Test ID</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="input-field"
              placeholder="Enter Test ID (e.g. TEST-1234567890-ABCD1234)"
              value={testId}
              onChange={e => setTestId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runVerification()}
            />
            <button className="btn-primary" onClick={() => runVerification()} disabled={loading || !testId.trim()}>
              {loading ? <div className="spinner" /> : <Search size={16} />}
              {loading ? '' : 'Verify'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 12, marginBottom: 20, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)' }}>
            <XCircle size={16} color="#f43f5e" />
            <span style={{ fontSize: 13, color: '#f43f5e' }}>{error}</span>
          </div>
        )}

        {result && test && (
          <div className="fade-in">
            {/* Overall status banner */}
            <div style={{
              padding: '24px', borderRadius: 16, marginBottom: 20, textAlign: 'center',
              background: verified ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
              border: `2px solid ${verified ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'}`,
              boxShadow: verified ? '0 0 40px rgba(16,185,129,0.08)' : '0 0 40px rgba(244,63,94,0.08)'
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
                background: verified ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {verified ? <CheckCircle size={28} color="#10b981" /> : <XCircle size={28} color="#f43f5e" />}
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: verified ? '#10b981' : '#f43f5e', letterSpacing: '0.05em' }}>
                {verified ? 'RECORD VERIFIED' : 'INTEGRITY FAILED'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 8 }}>
                {verified
                  ? 'All cryptographic checks passed. This record has not been tampered with.'
                  : 'One or more integrity checks failed. This record may have been modified.'}
              </p>
            </div>

            {/* Test summary */}
            <div className="glass-card" style={{ padding: '14px 20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                {[
                  { icon: Hash, label: 'Test ID', value: result.test_id.slice(0, 26) + '…' },
                  { icon: Clock, label: 'Timestamp', value: new Date(test.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) },
                  { icon: MapPin, label: 'Location', value: test.latitude ? `${parseFloat(test.latitude).toFixed(4)}, ${parseFloat(test.longitude).toFixed(4)}` : 'Not available' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={14} color="var(--color-muted)" />
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                      <p style={{ fontSize: 12, fontWeight: 500 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checks */}
            <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={15} color="#3b82f6" />
                <h2 style={{ fontSize: 14, fontWeight: 600 }}>Integrity Checks</h2>
              </div>
              {checks.map(c => <CheckRow key={c.label} {...c} />)}
            </div>

            {/* Hash display */}
            <div className="glass-card" style={{ padding: 20 }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Hash size={14} color="#3b82f6" /> Cryptographic Evidence
              </h2>
              {[
                { label: 'Image Hash (SHA-256)', value: test.image_hash },
                { label: 'Record Hash (SHA-256)', value: test.record_hash },
                { label: 'Digital Signature (Ed25519)', value: test.signature },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 5 }}>{label}</p>
                  <p className="hash-text">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
