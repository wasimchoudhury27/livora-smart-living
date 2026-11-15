import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardCheck, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar,
  Flame,
  Camera
} from 'lucide-react';

interface InspectionAudit {
  id: string;
  area: string;
  auditor: string;
  date: string;
  score: number;
  status: 'passed' | 're_inspection_due' | 'critical_action';
  findings: string;
}

export const InspectionsView: React.FC = () => {
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const [audits, setAudits] = useState<InspectionAudit[]>([
    { id: 'insp-1', area: 'Commercial Kitchen & Cold Storage', auditor: 'Warden Sharma', date: 'Yesterday, 04:00 PM', score: 96, status: 'passed', findings: 'Excellent hygiene. Food temp records in order. Grease trap serviced.' },
    { id: 'insp-2', area: 'Fire Extinguishers & Exit Signage', auditor: 'Safety Lead Rathore', date: '12 Oct 2026', score: 98, status: 'passed', findings: 'All 18 ABC dry chemical extinguishers in green pressure zone. Exit routes unobstructed.' },
    { id: 'insp-3', area: 'Wing B 3rd Floor Corridors & Balconies', auditor: 'Warden Sharma', date: '10 Oct 2026', score: 78, status: 're_inspection_due', findings: 'Two resident personal shoe racks left in narrow passage. Notice issued to rooms 304 and 306.' },
    { id: 'insp-4', area: 'Rooftop Solar & Heat Pump System', auditor: 'Estate Engineer', date: '05 Oct 2026', score: 92, status: 'passed', findings: 'Solar collector panels cleaned of dust. Operating at 94% thermal efficiency.' },
  ]);

  const handleStartInspection = () => {
    showToast('New Audit Routine', 'Opening inspection scorecard for campus facilities...', 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Safety, Fire, & Facility Compliance
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Facility Audits & Inspections</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Conduct weekly safety walkthroughs, kitchen food hygiene compliance, and corridor safety protocol checks.
            </p>
          </div>
          <button
            onClick={handleStartInspection}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Walkthrough Audit</span>
          </button>
        </div>
      </div>

      {/* Audits List */}
      <div className="space-y-4">
        {audits.map((a) => (
          <div 
            key={a.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{a.area}</h3>
                <p className="text-xs text-slate-400">Inspected by {a.auditor} on {a.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-800">{a.score}% Compliance</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  a.status === 'passed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {a.status === 'passed' ? 'PASSED' : 'RE-AUDIT DUE'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {a.findings}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
