import React from 'react';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Building2, 
  Coffee, 
  CheckCircle2 
} from 'lucide-react';

export const StaffScheduleView: React.FC = () => {
  const shifts = [
    { day: 'Monday (Today)', shift: 'Morning Shift', timing: '08:00 AM – 04:30 PM', zone: 'Wing A (Floors 1-3)', role: 'Electrical & General Repair', status: 'Active Now' },
    { day: 'Tuesday', shift: 'Morning Shift', timing: '08:00 AM – 04:30 PM', zone: 'Wing A (Floors 4-5)', role: 'Sanitary & Plumbing Overhaul', status: 'Scheduled' },
    { day: 'Wednesday', shift: 'Evening Shift', timing: '01:30 PM – 10:00 PM', zone: 'Wing B (Floors 1-3)', role: 'Air Conditioner Filter Servicing', status: 'Scheduled' },
    { day: 'Thursday', shift: 'Morning Shift', timing: '08:00 AM – 04:30 PM', zone: 'Main Facilities & Dining Hall', role: 'Commercial Kitchen Maintenance', status: 'Scheduled' },
    { day: 'Friday', shift: 'General Shift', timing: '09:00 AM – 05:30 PM', zone: 'All Wings', role: 'Preventive Inspections', status: 'Scheduled' },
    { day: 'Saturday', shift: 'On-Call Emergency Duty', timing: '10:00 AM – 06:00 PM', zone: 'Campus Wide', role: 'Rapid Response Team', status: 'On-Call' },
    { day: 'Sunday', shift: 'Weekly Off', timing: '—', zone: '—', role: 'Rest Day', status: 'Off Duty' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Calendar className="w-3.5 h-3.5" />
              Duty Rosters & Zones
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Work Schedule & Shifts</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              View your assigned weekly roster, building coverage zones, and break windows.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-right shrink-0">
            <p className="text-xs text-slate-300 font-medium">Current Duty Status</p>
            <p className="text-xl font-bold text-teal-300">On Shift • Active</p>
            <p className="text-[11px] text-teal-200 mt-0.5">Shift ends at 04:30 PM</p>
          </div>
        </div>
      </div>

      {/* Roster Cards */}
      <div className="space-y-3">
        {shifts.map((s, idx) => (
          <div 
            key={idx}
            className={`bg-white rounded-2xl border p-5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              s.status === 'Active Now' ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs ${
                s.status === 'Active Now' 
                  ? 'bg-teal-600 text-white' 
                  : s.status === 'Off Duty'
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {s.day.split(' ')[0].substring(0, 3)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{s.day}</h4>
                  {s.status === 'Active Now' && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{s.role} • {s.zone}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.timing}</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">{s.shift}</span>
              </div>

              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                s.status === 'Active Now'
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : s.status === 'Off Duty'
                  ? 'bg-slate-100 text-slate-500 border-slate-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
