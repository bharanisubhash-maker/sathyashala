import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Video,
  Users,
  Building2,
  FileCheck2,
  AlertTriangle,
  LogOut,
  Radio,
  UserCheck,
  Cpu,
  ChevronDown,
  ShieldCheck,
  Activity,
  Wifi
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Navbar() {
  const { user, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const [criticalCount, setCriticalCount] = useState(2);
  const [roleDropdown, setRoleDropdown] = useState(false);

  useEffect(() => {
    // Fetch live alert counts periodically
    const fetchCounts = () => {
      axios.get(`${API}/api/alerts?status=OPEN`)
        .then(res => {
          if (res.data?.counts?.critical !== undefined) {
            setCriticalCount(res.data.counts.critical);
          }
        })
        .catch(() => {});
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Command Center', path: '/dashboard', icon: Video },
    { label: 'Live Attendance', path: '/attendance', icon: Users },
    { label: 'Infra Scanner', path: '/infrastructure', icon: Cpu },
    {
      label: 'Violations',
      path: '/violations',
      icon: AlertTriangle,
      badge: criticalCount > 0 ? criticalCount : null
    },
    { label: 'Privacy Note', path: '/privacy', icon: ShieldCheck },
    { label: 'Model Accuracy', path: '/accuracy', icon: Activity },
    { label: 'Low Bandwidth', path: '/bandwidth', icon: Wifi },
    { label: 'Centres', path: '/centres', icon: Building2 },
    { label: 'Audit Records', path: '/records', icon: FileCheck2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070e1c]/95 border-b border-[#1b2b4d] backdrop-blur-md">
      {/* Top Government Scheme Brand Bar */}
      <div className="bg-[#050914] px-4 py-1 text-xs border-b border-[#15223c] flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-live inline-block"></span>
          <span className="font-semibold tracking-wide text-slate-300">
            MINISTRY OF SKILL DEVELOPMENT & ENTREPRENEURSHIP (MSDE)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-mono">DGT & NSDC PMKVY 4.0 MONITORING SYSTEM</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400">
            AI Engine: <span className="text-emerald-400 font-mono">YOLOv11-Edge + FaceNet Liveness</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Status: <span className="text-cyan-400 font-mono">184 Streams Active</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* App Logo & Title */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-cyan-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                VigiloSkill <span className="text-cyan-400">AI</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-700/50 rounded">
                Live 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Real-Time Attendance & Infrastructure Compliance
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 shadow-sm shadow-cyan-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Role Switcher & User Menu */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdown(!roleDropdown)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111e38] border border-[#22375f] text-slate-200 hover:border-cyan-500/50 flex items-center gap-2 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline text-slate-400">Role:</span>
              <span className="text-cyan-300 font-semibold capitalize">
                {user?.role?.replace('_', ' ') || 'Inspector'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdown && (
              <div
                className="absolute right-0 mt-2 w-64 bg-[#0d162b] border border-[#1f3258] rounded-xl shadow-2xl p-2 z-50"
                onMouseLeave={() => setRoleDropdown(false)}
              >
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Switch Active Portal Role:
                </div>
                <button
                  onClick={() => { switchDemoRole('admin'); setRoleDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[#162548] flex items-center justify-between text-slate-200"
                >
                  <div>
                    <div className="font-medium text-cyan-300">National Directorate</div>
                    <div className="text-[10px] text-slate-400">Full Oversight & Penalty Action</div>
                  </div>
                  {user?.role === 'admin' && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => { switchDemoRole('centre_head'); setRoleDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[#162548] flex items-center justify-between text-slate-200"
                >
                  <div>
                    <div className="font-medium text-emerald-300">TC Superintendent</div>
                    <div className="text-[10px] text-slate-400">NSTI Bengaluru - Local Feeds</div>
                  </div>
                  {user?.role === 'centre_head' && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => { switchDemoRole('auditor'); setRoleDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-[#162548] flex items-center justify-between text-slate-200"
                >
                  <div>
                    <div className="font-medium text-amber-300">Field Vigilance Officer</div>
                    <div className="text-[10px] text-slate-400">Instant AI Camera Audits</div>
                  </div>
                  {user?.role === 'auditor' && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* User Signout */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-[#13203b] gap-2 bg-[#081021]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                isActive
                  ? 'text-cyan-300 bg-cyan-950/80 border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-600 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
