import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Send,
  Download,
  Search,
  CheckCircle2,
  Mail,
  PhoneCall,
  ArrowLeft
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

export default function ShortageList() {
  const navigate = useNavigate();
  const [alertDispatched, setAlertDispatched] = useState(false);

  const shortageStudents = [
    {
      id: 4,
      rollNo: '4XX22AI004',
      name: 'Akshay Gowda',
      course: 'Operations Research',
      attended: 3,
      total: 5,
      rate: 60.0,
      classesNeededFor75: 3,
      parentContact: '+91 98452 11029',
      status: 'Critical Shortage'
    },
    {
      id: 6,
      rollNo: '4XX22AI006',
      name: 'Vijay Kumar',
      course: 'Operations Research',
      attended: 1,
      total: 5,
      rate: 20.0,
      classesNeededFor75: 11,
      parentContact: '+91 97410 88201',
      status: 'Severe Defaulter'
    },
    {
      id: 7,
      rollNo: '4XX22AI008',
      name: 'Preeti Deshmukh',
      course: 'Deep Learning Workshop',
      attended: 2,
      total: 4,
      rate: 50.0,
      classesNeededFor75: 4,
      parentContact: '+91 94481 33490',
      status: 'Warning Shortage'
    },
    {
      id: 8,
      rollNo: '4XX22AI012',
      name: 'Rohan Verma',
      course: 'IoT Hardware Lab',
      attended: 4,
      total: 7,
      rate: 57.1,
      classesNeededFor75: 5,
      parentContact: '+91 99002 44781',
      status: 'Warning Shortage'
    },
    {
      id: 9,
      rollNo: '4XX22AI015',
      name: 'Suresh Patil',
      course: 'Robotics Automation',
      attended: 3,
      total: 6,
      rate: 50.0,
      classesNeededFor75: 6,
      parentContact: '+91 98860 12345',
      status: 'Warning Shortage'
    }
  ];

  const handleDispatchWarnings = () => {
    setAlertDispatched(true);
    setTimeout(() => setAlertDispatched(false), 3500);
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Shortage List' }]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              Attendance Shortage List (&lt;75% Mandatory)
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              List of trainees currently failing the mandatory 75% attendance threshold for scheme certification
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDispatchWarnings}
              className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Automated SMS / Email Warning</span>
            </button>
          </div>
        </div>

        {alertDispatched && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Automated shortage notices dispatched to 5 students and registered parents.</span>
          </div>
        )}

        {/* Shortage Summary Table */}
        <div className="edutrack-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Course / Trade</th>
                  <th className="py-3 px-3 text-center">Attended / Total</th>
                  <th className="py-3 px-3 text-center">Attendance %</th>
                  <th className="py-3 px-3 text-center">Classes Needed for 75%</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shortageStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">{s.rollNo}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-3 text-slate-600">{s.course}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                      {s.attended} / {s.total}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-extrabold text-rose-600">
                      {s.rate.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-amber-600 font-bold">
                      +{s.classesNeededFor75} classes
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate('/grace-management', { state: { student: s } })}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        Grant Grace
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
