import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Clock, MapPin, ArrowRight, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import ResultBadge from '../components/ResultBadge';

const API = import.meta.env.VITE_BACKEND_URL;
const RESULTS = ['ALL', 'POSITIVE', 'NEGATIVE', 'INCONCLUSIVE'];

export default function TestHistory() {
  const [tests, setTests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const limit = 15;

  function fetchTests() {
    setLoading(true);
    const params = new URLSearchParams({ page, limit });
    if (search) params.set('search', search);
    if (resultFilter !== 'ALL') params.set('result', resultFilter);

    axios.get(`${API}/api/tests?${params}`)
      .then(res => { setTests(res.data.tests); setTotal(res.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchTests(); }, [page, resultFilter]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchTests();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ paddingTop: 88 }}>
      <div className="page-container fade-in">
        <div style={{ marginBottom: 28 }}>
          <h1 className="page-title">Test History</h1>
          <p className="page-subtitle">{total} records found · Page {page} of {Math.max(1, totalPages)}</p>
        </div>

        {/* Search & Filter */}
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 10, minWidth: 260 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: 36, paddingTop: 9, paddingBottom: 9 }}
                placeholder="Search by Test ID, Officer, Case..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '9px 18px' }}>
              <Search size={14} /> Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={14} color="var(--color-muted)" />
            {RESULTS.map(r => (
              <button key={r} onClick={() => { setResultFilter(r); setPage(1); }} style={{
                padding: '6px 14px', borderRadius: 100, border: '1px solid',
                borderColor: resultFilter === r ? '#3b82f6' : 'var(--color-border)',
                background: resultFilter === r ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: resultFilter === r ? '#3b82f6' : 'var(--color-muted)',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
              }}>
                {r === 'ALL' ? 'All Results' : r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 12px', width: 28, height: 28 }} />
              <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Loading records...</p>
            </div>
          ) : tests.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Activity size={32} color="var(--color-border)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>No records match your search.</p>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.01)' }}>
                    {['Test ID', 'Result', 'Confidence', 'Kit', 'Officer', 'Timestamp', 'Location', ''].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: 'var(--color-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t, i) => (
                    <tr key={t.test_id} style={{
                      borderBottom: i < tests.length - 1 ? '1px solid rgba(30,47,77,0.4)' : 'none',
                      transition: 'background 0.15s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <code style={{ fontSize: 11, color: 'var(--color-accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {t.test_id.slice(0, 22)}…
                        </code>
                        {t.case_reference && <p style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 2 }}>{t.case_reference}</p>}
                      </td>
                      <td style={{ padding: '13px 16px' }}><ResultBadge result={t.result} /></td>
                      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--color-muted)' }}>
                        {t.confidence ? `${(t.confidence * 100).toFixed(0)}%` : '—'}
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--color-muted)' }}>{t.kit_id}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12 }}>{t.operator_id}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Clock size={11} />
                          {new Date(t.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: 11, color: 'var(--color-muted)' }}>
                        {t.latitude ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={11} color="#10b981" />
                            {parseFloat(t.latitude).toFixed(3)}, {parseFloat(t.longitude).toFixed(3)}
                          </div>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <Link to={`/test/${t.test_id}`} style={{ fontSize: 12, color: 'var(--color-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap' }}>
                          Details <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                    Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: '7px 14px' }} onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <button className="btn-secondary" style={{ padding: '7px 14px' }} onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
