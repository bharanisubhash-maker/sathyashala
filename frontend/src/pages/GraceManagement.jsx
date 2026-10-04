import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  UserCheck
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

export default function GraceManagement() {
  const location = useLocation();
  const [selectedStudent, setSelectedStudent] = useState(
    location.state?.student?.name || 'Akshay Gowda (4XX22AI004)'
  );
  const [graceHours, setGraceHours] = useState('2');
  const [reason, setReason] = useState('Medical Leave / Health Certificate Verified');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Grace Management' }]}>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            Attendance Grace Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Grant sanctioned attendance condonation for validated medical, bereavement, or authorized official duty absences
          </p>
        </div>

        {submitted && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Attendance grace of {graceHours} classes granted to {selectedStudent}. Updated on ministry portal.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="edutrack-card p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Trainee / Student
            </label>
            <input
              type="text"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Grace Classes / Hours Requested
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={graceHours}
              onChange={(e) => setGraceHours(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Justification & Approval Category
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="Medical Leave / Health Certificate Verified">
                Medical Leave / Government Hospital Certificate Verified
              </option>
              <option value="Authorized Skill Competition Representation">
                Authorized Skill Competition (IndiaSkills / WorldSkills)
              </option>
              <option value="Family Bereavement / Severe Emergency">
                Family Bereavement / Severe Emergency
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Authorize & Approve Grace Hours
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
