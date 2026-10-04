import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

export default function StudentAttendanceSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student || {
    name: 'Akshay Gowda',
    rollNo: '4XX22AI004',
    totalClasses: 8,
    classesAttended: 5,
    classesAbsent: 3,
    subjects: 2,
    overallRate: 63
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Attendance Summary' }]}>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Header matching Screenshot 2 */}
        <div className="space-y-1">
          <button
            onClick={() => navigate('/attendance-report')}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Report
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Your Attendance Summary
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Subject-wise breakdown and overall statistics
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">{student.name}</div>
              <div className="text-[11px] font-mono text-slate-500">{student.rollNo}</div>
            </div>
          </div>
        </div>

        {/* 4 Stat Boxes with Colored Borders matching Screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Classes */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {student.totalClasses || 8}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Total Classes
            </div>
          </div>

          {/* Classes Attended (Green Border) */}
          <div className="bg-white border-2 border-emerald-400 rounded-xl p-4 shadow-xs">
            <div className="text-2xl font-black text-emerald-600 font-mono">
              {student.classesAttended || 5}
            </div>
            <div className="text-[11px] font-bold text-emerald-700 mt-1 uppercase tracking-wider">
              Classes Attended
            </div>
          </div>

          {/* Classes Absent (Red Border) */}
          <div className="bg-white border-2 border-rose-400 rounded-xl p-4 shadow-xs">
            <div className="text-2xl font-black text-rose-600 font-mono">
              {student.classesAbsent || 3}
            </div>
            <div className="text-[11px] font-bold text-rose-700 mt-1 uppercase tracking-wider">
              Classes Absent
            </div>
          </div>

          {/* Subjects (Orange Border) */}
          <div className="bg-white border-2 border-amber-400 rounded-xl p-4 shadow-xs">
            <div className="text-2xl font-black text-amber-600 font-mono">
              {student.subjects || 2}
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-1 uppercase tracking-wider">
              Subjects
            </div>
          </div>
        </div>

        {/* Overall Attendance Card matching Screenshot 2 */}
        <div className="edutrack-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900">Overall Attendance</div>
              <div className="text-xs text-slate-400">Across all subjects</div>
            </div>
            <div className="text-2xl font-black text-amber-500 font-mono">
              {student.overallRate || 63}%
            </div>
          </div>

          {/* Amber Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${student.overallRate || 63}%` }}
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
            ></div>
          </div>

          {/* Warning Message matching Screenshot 2 */}
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium pt-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Your attendance is between 60-75%. Try to attend more classes to avoid shortage.</span>
          </div>
        </div>

        {/* Subject-wise Breakdown Section matching Screenshot 2 */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Subject-wise Breakdown
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject 1: Operations Research */}
            <div className="edutrack-card p-5 border-l-4 border-l-amber-500 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">
                  Operations Research
                </div>
                <div className="text-lg font-black text-amber-500 font-mono">
                  60%
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[60%]"></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total: <strong className="text-slate-800">5</strong></span>
                <span>Present: <strong className="text-emerald-600">3</strong></span>
                <span>Absent: <strong className="text-rose-600">2</strong></span>
              </div>

              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-semibold p-2 rounded-lg flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Below 75% in this subject</span>
              </div>
            </div>

            {/* Subject 2: DL (Deep Learning) */}
            <div className="edutrack-card p-5 border-l-4 border-l-amber-500 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">
                  DL (Deep Learning)
                </div>
                <div className="text-lg font-black text-amber-500 font-mono">
                  67%
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[67%]"></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total: <strong className="text-slate-800">3</strong></span>
                <span>Present: <strong className="text-emerald-600">2</strong></span>
                <span>Absent: <strong className="text-rose-600">1</strong></span>
              </div>

              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-semibold p-2 rounded-lg flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Below 75% in this subject</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
