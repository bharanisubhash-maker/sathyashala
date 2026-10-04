import React from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  ExternalLink
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

export default function Certificates() {
  const requests = [
    {
      id: 'CERT-091',
      student: 'Akshay Gowda (4XX22AI004)',
      type: 'Medical Certificate (Viral Illness)',
      dates: '08 Sep 2026 – 10 Sep 2026',
      status: 'Under Review',
      docName: 'medical_fit_cert_dr_rao.pdf'
    },
    {
      id: 'CERT-088',
      student: 'Vijay Kumar (4XX22AI006)',
      type: 'Official Duty / Skill Competition',
      dates: '01 Sep 2026 – 05 Sep 2026',
      status: 'Approved',
      docName: 'district_skill_selection_letter.pdf'
    },
    {
      id: 'CERT-074',
      student: 'Alfiya (4XX22AI005)',
      type: 'Family Emergency Leave',
      dates: '28 Aug 2026',
      status: 'Approved',
      docName: 'parent_leave_application.pdf'
    }
  ];

  return (
    <AppLayout breadcrumbs={[{ label: 'Reasons & Certificates' }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-600" />
            Reasons & Medical Certificates
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Review student absence applications, medical records, and verification documents
          </p>
        </div>

        <div className="edutrack-card overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Req ID</th>
                <th className="py-3 px-3">Trainee</th>
                <th className="py-3 px-3">Absence Justification</th>
                <th className="py-3 px-3">Dates</th>
                <th className="py-3 px-3">Attachment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-500">{r.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{r.student}</td>
                  <td className="py-3 px-3 text-slate-600">{r.type}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{r.dates}</td>
                  <td className="py-3 px-3">
                    <span className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1 cursor-pointer">
                      <FileText className="w-3.5 h-3.5" />
                      {r.docName}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        r.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Reviewing document: ${r.docName}`)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-400 rounded-md transition-colors"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
