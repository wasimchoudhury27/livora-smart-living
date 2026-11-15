import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Calendar, 
  Download, 
  Printer, 
  CheckCircle2, 
  Users, 
  UtensilsCrossed, 
  Wrench, 
  CreditCard, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const DailyReportsView: React.FC = () => {
  const { students, complaints, payments, showToast } = useApp();
  const [selectedDate, setSelectedDate] = useState('2026-10-17');

  const totalResidents = students.length;
  const activeResidents = students.filter(s => s.status === 'Active').length;
  const complaintsToday = complaints.length;
  const resolvedToday = complaints.filter(c => c.status === 'Completed' || c.status === 'Verified').length;

  const handleExportPDF = () => {
    showToast('Daily Report Export', 'Compiling daily operational audit log to PDF...', 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Warden & Management Operations Log
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Daily Operational Reports</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Consolidated daily overview of gate check-ins, mess attendance, maintenance SLA, and security incidents.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-teal-600" />
          <span className="text-sm font-bold text-slate-800">Operational Log for:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Generated automatically at 23:59 IST daily
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resident Census</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{activeResidents}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">94% Occupancy rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Meals Served</span>
            <UtensilsCrossed className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">142</p>
          <p className="text-xs text-slate-500 mt-1">Across 4 shifts today</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Maintenance SLA</span>
            <Wrench className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{resolvedToday} / {complaintsToday}</p>
          <p className="text-xs text-teal-600 font-semibold mt-1">Avg 35m resolution</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security In/Out</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">216</p>
          <p className="text-xs text-slate-500 mt-1">0 curfew violations</p>
        </div>
      </div>

      {/* Incident & Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Today's Shift Log & Night Incident Summary</h3>

        <div className="space-y-3">
          {[
            { time: '08:15 AM', type: 'Mess Inspection', note: 'Kitchen deep cleaning inspected by Warden. All milk and vegetable supplies quality approved.', by: 'Warden Sharma' },
            { time: '11:30 AM', type: 'Check-in Completed', note: 'Aarav Patel checked into Room 102 Bed B. Biometric ID enrolled and key card handed over.', by: 'Front Desk' },
            { time: '02:45 PM', type: 'Maintenance Resolved', note: 'Air conditioner filter service completed in Room 104 by maintenance tech Rajesh.', by: 'Rajesh (Tech)' },
            { time: '06:00 PM', type: 'Curfew & Turnstile Check', note: 'Biometric gates tested and active. Evening security guard changeover complete.', by: 'Guard Head' }
          ].map((log, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md shrink-0">
                {log.time}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{log.type}</h4>
                  <span className="text-[11px] text-slate-400">{log.by}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{log.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
