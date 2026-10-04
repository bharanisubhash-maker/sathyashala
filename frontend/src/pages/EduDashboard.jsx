import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  Users,
  AlertTriangle,
  Zap,
  UserPlus,
  Layers,
  CheckSquare,
  FileBarChart,
  Award,
  FileText,
  Camera,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function EduDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalClasses: 3,
    totalStudents: 10,
    shortageAlerts: 5,
    avgAttendance: 69.0
  });

  return (
    <AppLayout breadcrumbs={[]}>
      <div className="space-y-6">
        {/* Blue Gradient Welcome Banner from Screenshot */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative z-10 space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Good Morning, NAGARAJ
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">
              Artificial Intelligence and Data Science Department • NSDC Training Center
            </p>
            <div className="text-[11px] text-blue-200/90 flex items-center gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Wednesday, 30 September 2026</span>
            </div>
          </div>

          {/* Date Badge on Right */}
          <div className="relative z-10 self-start md:self-auto bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-center shadow-xs">
            <div className="text-2xl font-black font-mono leading-none">30</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-blue-100 mt-0.5">
              Sept 2026
            </div>
          </div>

          {/* Soft background shape */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* 4 Stat KPI Boxes from Screenshot */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Classes */}
          <div className="edutrack-card p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {metrics.totalClasses}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Total Classes</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          {/* Total Students */}
          <div className="edutrack-card p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {metrics.totalStudents}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Total Students</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Shortage Alerts */}
          <div className="edutrack-card p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
                {metrics.shortageAlerts}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Shortage Alerts</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          {/* Avg Attendance */}
          <div className="edutrack-card p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono">
                {metrics.avgAttendance}%
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Avg Attendance</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Quick Access - Modules Grid from Screenshot */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            Quick Access - Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Add Student */}
            <div
              onClick={() => navigate('/add-student')}
              className="edutrack-card edutrack-card-hover p-4 cursor-pointer flex flex-col justify-between min-h-[110px]"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Add Student</div>
                <div className="text-[11px] text-slate-500">Enroll students to specific classes and semesters</div>
              </div>
            </div>

            {/* Manage Classes */}
            <div
              onClick={() => navigate('/classes')}
              className="edutrack-card edutrack-card-hover p-4 cursor-pointer flex flex-col justify-between min-h-[110px]"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Manage Classes</div>
                <div className="text-[11px] text-slate-500">Create, edit and organize class sections</div>
              </div>
            </div>

            {/* Mark Attendance (AI Camera & Manual) */}
            <div
              onClick={() => navigate('/mark-attendance')}
              className="edutrack-card edutrack-card-hover p-4 cursor-pointer flex flex-col justify-between min-h-[110px] border-blue-300 ring-2 ring-blue-500/10 bg-gradient-to-br from-white to-blue-50/30"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  Live Camera
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Mark Attendance</div>
                <div className="text-[11px] text-slate-500">Record daily attendance via live camera or roster</div>
              </div>
            </div>

            {/* Attendance Report */}
            <div
              onClick={() => navigate('/attendance-report')}
              className="edutrack-card edutrack-card-hover p-4 cursor-pointer flex flex-col justify-between min-h-[110px]"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <FileBarChart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Attendance Report</div>
                <div className="text-[11px] text-slate-500">View and export detailed attendance analytics</div>
              </div>
            </div>

            {/* Shortage List */}
            <div
              onClick={() => navigate('/shortage-list')}
              className="edutrack-card edutrack-card-hover p-4 cursor-pointer flex flex-col justify-between min-h-[110px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Shortage List</span>
                  <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 rounded-full">5</span>
                </div>
                <div className="text-[11px] text-slate-500">Students with attendance below 75% threshold</div>
              </div>
            </div>

            {/* Grace Management */}
            <div
              onClick={() => navigate('/grace-management')}
              className="edutrack-card edutrack-card-hover p-4 cursor-pointer flex flex-col justify-between min-h-[110px]"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Grace Management</div>
                <div className="text-[11px] text-slate-500">Grant attendance grace to eligible reasons</div>
              </div>
            </div>

            {/* Reasons & Certificates */}
            <div
              onClick={() => navigate('/certificates')}
              className="edutrack-card edutrack-card-hover p-4 cursor-pointer flex flex-col justify-between min-h-[110px]"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Reasons & Certificates</div>
                <div className="text-[11px] text-slate-500">Review student-submitted absence justifications</div>
              </div>
            </div>

            {/* AI Infrastructure Scanner */}
            <div
              onClick={() => navigate('/infrastructure')}
              className="edutrack-card edutrack-card-hover p-4 cursor-pointer flex flex-col justify-between min-h-[110px] bg-gradient-to-br from-white to-emerald-50/30"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Infra & CCTV Scanner</div>
                <div className="text-[11px] text-slate-500">Audit workshop machinery, PCs, fire safety norms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table from Screenshot */}
        <div className="edutrack-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Recent Activity</h2>
            <button
              onClick={() => navigate('/attendance-report')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    Attendance Marked
                    <div className="text-[11px] text-slate-400 font-normal">Attendance marked for Operations Research (04 Sep 2026: 4 present, 2 absent)</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">Operations Research (Sem 7)</td>
                  <td className="py-3 px-3 text-slate-500">10 Sep 2026, 04:44 AM</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Closed
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    AI Camera Batch Scan
                    <div className="text-[11px] text-slate-400 font-normal">Classroom CCTV head-count verified (16/20 seats occupied)</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">IoT & AI Systems Lab</td>
                  <td className="py-3 px-3 text-slate-500">10 Sep 2026, 08:15 AM</td>
                  <td className="py-3 px-3">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    Biometric Proxy Cross-Audit
                    <div className="text-[11px] text-slate-400 font-normal">Biometric terminal timestamp matched against physical camera presence</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">Robotics Practical Bay</td>
                  <td className="py-3 px-3 text-slate-500">09 Sep 2026, 02:30 PM</td>
                  <td className="py-3 px-3">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Audited
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
