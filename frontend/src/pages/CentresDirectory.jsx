import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Building2,
  MapPin,
  Camera,
  ShieldCheck,
  Search,
  ExternalLink,
  Users,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function CentresDirectory() {
  const [centres, setCentres] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeCentreModal, setActiveCentreModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCentres = async () => {
    try {
      const res = await axios.get(`${API}/api/centres?search=${search}&state=${selectedState}&status=${selectedStatus}`);
      setCentres(res.data.centres || []);
    } catch (err) {
      console.error('Failed to fetch centres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentres();
  }, [search, selectedState, selectedStatus]);

  return (
    <div className="min-h-screen bg-[#060b16] text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0d162a] via-[#101e3b] to-[#0d162a] p-6 rounded-2xl border border-[#1b2b4d] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <Building2 className="w-4 h-4 text-cyan-400" />
            National Training Provider Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Monitored Training Centres & Geofence Directory
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Live surveillance coverage, GPS geofencing radius, installed CCTV cameras, and compliance grades for vocational training institutes across India.
          </p>
        </div>

        <div className="bg-[#121f3a] px-4 py-2.5 rounded-xl border border-[#22375f] text-center">
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">{centres.length}</div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Centres</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="panel-glass p-4 rounded-xl border border-[#1b2b4d] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by centre name, city, ID, or scheme..."
            className="w-full bg-[#0a1224] border border-[#1d2f55] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-[#0a1224] border border-[#1d2f55] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All States</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0a1224] border border-[#1d2f55] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Statuses</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="WARNING">Warning</option>
            <option value="NON_COMPLIANT">Defaulter</option>
          </select>
        </div>
      </div>

      {/* Centres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {centres.map((centre) => (
          <div
            key={centre.centre_id}
            className="panel-glass p-5 rounded-2xl border border-[#1b2b4d] panel-glass-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  {centre.centre_id}
                </span>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  centre.compliance_status === 'COMPLIANT'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : centre.compliance_status === 'WARNING'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {centre.compliance_grade} ({centre.compliance_score}%)
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{centre.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{centre.city}, {centre.state}</span>
              </p>
              <div className="text-[11px] text-cyan-300/80 mt-1 font-mono">{centre.affiliation}</div>

              {/* Quick stats */}
              <div className="mt-4 pt-3 border-t border-[#1b2b4d] grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-[#0b1428] p-2 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Batches</div>
                  <div className="font-bold text-white">{centre.stats?.active_batches || 0}</div>
                </div>
                <div className="bg-[#0b1428] p-2 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Students</div>
                  <div className="font-bold text-emerald-400">{centre.stats?.total_students || 0}</div>
                </div>
                <div className="bg-[#0b1428] p-2 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Cameras</div>
                  <div className="font-bold text-cyan-400">{centre.stats?.cameras_active || 0} Live</div>
                </div>
              </div>

              {/* Geofence info */}
              <div className="mt-3 text-[10px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded-lg flex items-center justify-between">
                <span>GPS: {centre.geofence?.latitude?.toFixed(4)}° N, {centre.geofence?.longitude?.toFixed(4)}° E</span>
                <span className="text-emerald-400">Radius: {centre.geofence?.radius_meters || 150}m</span>
              </div>
            </div>

            <button
              onClick={() => setActiveCentreModal(centre)}
              className="mt-4 w-full py-2 bg-[#121f3a] hover:bg-[#182a4d] text-cyan-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#203660]"
            >
              <span>View Detail Profile & Cameras</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Detailed Centre Inspection Modal */}
      {activeCentreModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="panel-glass max-w-2xl w-full p-6 rounded-2xl border border-cyan-500/50 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1b2b4d] pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                  {activeCentreModal.centre_id}
                </span>
                <h3 className="text-lg font-bold text-white">{activeCentreModal.name}</h3>
                <p className="text-xs text-slate-400">{activeCentreModal.address}</p>
              </div>
              <button
                onClick={() => setActiveCentreModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Cameras List */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                Registered Real-Time CCTV Streams ({activeCentreModal.cameras?.length || 0})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeCentreModal.cameras?.map((cam) => (
                  <div key={cam.id} className="bg-[#0b1428] p-2.5 rounded-xl border border-[#1b2b4d] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">{cam.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{cam.type} • {cam.resolution}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                      cam.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                    }`}>
                      {cam.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Checklist */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Equipment & Compliance Checklist
              </h4>
              <div className="space-y-1.5 text-xs">
                {activeCentreModal.equipment_checklist?.map((eq, idx) => (
                  <div key={idx} className="bg-[#0b1428] p-2.5 rounded-xl border border-[#1b2b4d] flex items-center justify-between">
                    <span className="text-slate-300">{eq.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      eq.status === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300'
                        : eq.status === 'WARNING'
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-rose-950 text-rose-300'
                    }`}>
                      {eq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1b2b4d] pt-3 flex justify-end">
              <button
                onClick={() => setActiveCentreModal(null)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
