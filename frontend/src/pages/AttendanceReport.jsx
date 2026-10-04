import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Search,
  Filter,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  ChevronRight,
  Printer
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

export default function AttendanceReport() {
  const navigate = useNavigate();

  // Filters from Screenshot 1
  const [semester, setSemester] = useState('Semester 7');
  const [subject, setSubject] = useState('Operations Research - AI&DS');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Students');
  const [searchQuery, setSearchQuery] = useState('');

  // 6 Students from Screenshot 1
  const allStudents = [
    {
      id: 1,
      rollNo: '4XX22AI001',
      name: 'abdul shafik',
      totalClasses: 5,
      effectivePresent: 4,
      absent: 1,
      percentage: 80.0,
      status: 'Warning',
      color: 'amber'
    },
    {
      id: 2,
      rollNo: '4XX22AI002',
      name: 'abhinandan',
      totalClasses: 5,
      effectivePresent: 4,
      absent: 1,
      percentage: 80.0,
      status: 'Warning',
      color: 'amber'
    },
    {
      id: 3,
      rollNo: '4XX22AI003',
      name: 'abhishek',
      totalClasses: 5,
      effectivePresent: 5,
      absent: 0,
      percentage: 100.0,
      status: 'Good',
      color: 'emerald'
    },
    {
      id: 4,
      rollNo: '4XX22AI004',
      name: 'akshay',
      totalClasses: 5,
      effectivePresent: 3,
      absent: 2,
      percentage: 60.0,
      status: 'Shortage',
      color: 'rose'
    },
    {
      id: 5,
      rollNo: '4XX22AI005',
      name: 'alfiya',
      totalClasses: 5,
      effectivePresent: 4,
      absent: 1,
      percentage: 80.0,
      status: 'Warning',
      color: 'amber'
    },
    {
      id: 6,
      rollNo: '4XX22AI006',
      name: 'vijay',
      totalClasses: 5,
      effectivePresent: 1,
      absent: 4,
      percentage: 20.0,
      status: 'Shortage',
      color: 'rose'
    }
  ];

  const filteredStudents = allStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Students' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout breadcrumbs={[{ label: 'Attendance Report' }]}>
      <div className="space-y-6">
        {/* Top Title & Export Action Bar matching Screenshot 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Attendance Report
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Detailed attendance analytics for students
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => alert('Exporting Attendance Report to Excel...')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Bar Controls matching Screenshot 1 */}
        <div className="edutrack-card p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-end">
            {/* Semester */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 5">Semester 5</option>
              </select>
            </div>

            {/* Class / Subject */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Class / Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Operations Research - AI&DS">Operations Research - AI&DS</option>
                <option value="Deep Learning & Neural Nets">Deep Learning & Neural Nets</option>
                <option value="IoT & Industrial Automation">IoT & Industrial Automation</option>
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                From Date
              </label>
              <input
                type="text"
                placeholder="dd - mm - yyyy"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                To Date
              </label>
              <input
                type="text"
                placeholder="dd - mm - yyyy"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status & Generate Button */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Status
              </label>
              <div className="flex gap-1.5">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="All Students">All Students</option>
                  <option value="Good">Good (&gt;=85%)</option>
                  <option value="Warning">Warning (75-85%)</option>
                  <option value="Shortage">Shortage (&lt;75%)</option>
                </select>

                <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 KPI Summary Cards matching Screenshot 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="edutrack-card p-4 text-center">
            <div className="text-2xl font-black text-slate-900 font-mono">6</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              TOTAL STUDENTS
            </div>
          </div>

          <div className="edutrack-card p-4 text-center">
            <div className="text-2xl font-black text-slate-900 font-mono">5</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              TOTAL CLASSES
            </div>
          </div>

          <div className="edutrack-card p-4 text-center">
            <div className="text-2xl font-black text-emerald-600 font-mono">4</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              &gt;= 75% ATTENDANCE
            </div>
          </div>

          <div className="edutrack-card p-4 text-center">
            <div className="text-2xl font-black text-rose-600 font-mono">2</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              BELOW 75%
            </div>
          </div>

          <div className="edutrack-card p-4 text-center">
            <div className="text-2xl font-black text-slate-900 font-mono">70%</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              CLASS AVERAGE
            </div>
          </div>
        </div>

        {/* Legend bar matching Screenshot 1 */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>&gt;= 85% — Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>75% - 85% — Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>&lt; 75% — Shortage</span>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Showing {filteredStudents.length} students
          </div>
        </div>

        {/* Search Student Input matching Screenshot 1 */}
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-8 pr-3 py-1.5 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        {/* Main Attendance Analytics Table matching Screenshot 1 */}
        <div className="edutrack-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">ROLL NO.</th>
                  <th className="py-3 px-3">STUDENT NAME</th>
                  <th className="py-3 px-3 text-center">TOTAL CLASSES</th>
                  <th className="py-3 px-3 text-center">EFFECTIVE PRESENT</th>
                  <th className="py-3 px-3 text-center">ABSENT</th>
                  <th className="py-3 px-3 min-w-[130px]">PERCENTAGE</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, idx) => {
                  const isWarning = s.status === 'Warning';
                  const isShortage = s.status === 'Shortage';
                  const isGood = s.status === 'Good';

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isShortage ? 'bg-rose-50/20' : isWarning ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">{s.rollNo}</td>
                      <td className="py-3 px-3 font-bold text-slate-800 capitalize">{s.name}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">{s.totalClasses}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">{s.effectivePresent}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">{s.absent}</td>

                      {/* Percentage & Progress Bar matching Screenshot 1 */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${s.percentage}%` }}
                              className={`h-full rounded-full ${
                                isGood
                                  ? 'bg-emerald-500'
                                  : isWarning
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            ></div>
                          </div>
                          <span
                            className={`font-mono font-bold ${
                              isGood
                                ? 'text-emerald-600'
                                : isWarning
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {s.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Status Badge matching Screenshot 1 */}
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                            isGood
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isWarning
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isGood ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                          ></span>
                          {s.status}
                        </span>
                      </td>

                      {/* Action Detail Button */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => navigate('/student-summary', { state: { student: s } })}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-300 hover:border-blue-400 rounded-md transition-all shadow-xs"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
