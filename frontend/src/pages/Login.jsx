import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Radio,
  Lock,
  User,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const [operatorId, setOperatorId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(operatorId, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please verify your ID and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (id, pwd) => {
    setOperatorId(id);
    setPassword(pwd);
    setError('');
    setLoading(true);

    try {
      await login(id, pwd);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/25">
            <Radio className="w-8 h-8 text-cyan-200 animate-pulse" />
          </div>

          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
              Skill India Mission • MSDE / DGT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              VigiloSkill <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              National Real-Time Monitoring System for Attendance & Infrastructure Compliance
            </p>
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="panel-glass p-6 sm:p-8 rounded-2xl border border-[#1d2f55] shadow-2xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Official Operator ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="e.g. ADMIN-001 or TC-BLR-01"
                  className="w-full bg-[#0a1224] border border-[#1f3258] rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a1224] border border-[#1f3258] rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Surveillance Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Demo Evaluation Logins */}
          <div className="pt-4 border-t border-[#1b2b4d] space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              1-Click Demo Logins (Evaluation Mode)
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN-001', 'admin123')}
                className="w-full text-left p-2.5 rounded-xl bg-[#0f1b36] hover:bg-[#16274e] border border-[#1f3460] flex items-center justify-between text-xs text-slate-200 transition-colors"
              >
                <div>
                  <div className="font-semibold text-cyan-300">National Directorate (Admin)</div>
                  <div className="text-[10px] text-slate-400 font-mono">ADMIN-001 • Full National Oversight</div>
                </div>
                <span className="text-cyan-400 font-bold text-xs">Login →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('TC-BLR-01', 'centre123')}
                className="w-full text-left p-2.5 rounded-xl bg-[#0f1b36] hover:bg-[#16274e] border border-[#1f3460] flex items-center justify-between text-xs text-slate-200 transition-colors"
              >
                <div>
                  <div className="font-semibold text-emerald-300">TC Superintendent</div>
                  <div className="text-[10px] text-slate-400 font-mono">TC-BLR-01 • NSTI Bengaluru Feeds</div>
                </div>
                <span className="text-emerald-400 font-bold text-xs">Login →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('AUDIT-99', 'auditor123')}
                className="w-full text-left p-2.5 rounded-xl bg-[#0f1b36] hover:bg-[#16274e] border border-[#1f3460] flex items-center justify-between text-xs text-slate-200 transition-colors"
              >
                <div>
                  <div className="font-semibold text-amber-300">AI Field Vigilance Officer</div>
                  <div className="text-[10px] text-slate-400 font-mono">AUDIT-99 • On-Site Camera Audits</div>
                </div>
                <span className="text-amber-400 font-bold text-xs">Login →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          VigiloSkill AI v2.0 • Secured with 256-bit TLS & Ed25519 Signatures
        </div>
      </div>
    </div>
  );
}
