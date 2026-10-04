import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserPlus,
  BookOpen,
  CheckSquare,
  FileBarChart,
  AlertTriangle,
  Award,
  FileText,
  Camera,
  Cpu,
  ShieldCheck,
  Wifi,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Sparkles
} from 'lucide-react';

export default function AppLayout({ children, breadcrumbs = [] }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Mark Attendance', path: '/mark-attendance', icon: CheckSquare, highlight: true },
    { label: 'Attendance Report', path: '/attendance-report', icon: FileBarChart },
    { label: 'My Attendance Summary', path: '/student-summary', icon: BookOpen },
    { label: 'Shortage List', path: '/shortage-list', icon: AlertTriangle, badge: '5' },
    { label: 'Grace Management', path: '/grace-management', icon: Award },
    { label: 'Reasons & Certificates', path: '/certificates', icon: FileText },
    { label: 'Live AI Camera Feeds', path: '/attendance', icon: Camera },
    { label: 'Infra AI Scanner', path: '/infrastructure', icon: Cpu },
    { label: 'Privacy & DPDP Note', path: '/privacy', icon: ShieldCheck },
    { label: 'Low-Bandwidth Mode', path: '/bandwidth', icon: Wifi },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        ></div>
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-5">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                Edu<span className="text-blue-600">Track</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">AI Vigilance & Attendance</span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>
            <nav className="space-y-1">
              {navLinks.slice(0, 7).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              AI Vision & Compliance
            </div>
            <nav className="space-y-1">
              {navLinks.slice(7).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Mini Profile & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'N'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Nagaraj'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.role || 'Vigilance Inspector'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 font-bold' : 'hover:text-blue-600'}>
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/mark-attendance"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Camera Attendance</span>
            </Link>

            {/* User Pill from Screenshots */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name[0].toUpperCase() : 'N'}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden md:inline">
                {user?.name || 'Nagaraj'}
              </span>
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Children Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
