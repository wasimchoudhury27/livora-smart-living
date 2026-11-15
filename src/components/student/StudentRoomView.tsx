import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DoorClosed, 
  Bed as BedIcon, 
  Users, 
  Wifi, 
  Zap, 
  Droplets, 
  Wind, 
  Sparkles, 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Phone,
  Mail,
  Building2,
  Layers,
  ArrowRight
} from 'lucide-react';

interface StudentRoomViewProps {
  onOpenCreateComplaint: () => void;
  onNavigate: (view: string) => void;
}

export const StudentRoomView: React.FC<StudentRoomViewProps> = ({
  onOpenCreateComplaint,
  onNavigate,
}) => {
  const { currentProperty, currentStudent, complaints } = useApp();

  // Find room 401 complaints
  const roomComplaints = complaints.filter(c => c.roomNumber === '401');

  const facilities = [
    { name: 'Ceiling Fan (High Speed)', icon: Wind, status: 'Needs Attention', ok: false, note: 'Regulator knob replacement scheduled' },
    { name: 'LED Tube Light & Night Lamp', icon: Zap, status: 'Working Good', ok: true, note: 'Dual switched' },
    { name: 'Study Desk & Ergonomic Chair', icon: DoorClosed, status: 'Working Good', ok: true, note: '2 sets provided' },
    { name: 'High-speed Wi-Fi (50 Mbps)', icon: Wifi, status: 'Connected', ok: true, note: 'SSID: ABC-Hostel-Flr4' },
    { name: 'Attached Washroom & Geyser', icon: Droplets, status: 'Operational', ok: true, note: '24x7 hot water available' },
    { name: 'Daily Room Cleaning & Dusting', icon: Sparkles, status: 'Completed Today', ok: true, note: 'Cleaner: Sunita Devi' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>{currentProperty.name} · Building A · Floor 4</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Room 401 — Double Sharing Premium
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your assigned sanctuary · Biometric entry locked · Attached Balcony
          </p>
        </div>

        <button
          onClick={onOpenCreateComplaint}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Wrench className="w-4 h-4" />
          <span>Report Room Issue</span>
        </button>
      </div>

      {/* Bed Allocation Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <BedIcon className="w-4 h-4 text-indigo-600" />
          <span>Bed Allocation & Resident Profiles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bed A - Rahul Sharma (Current User) */}
          <div className="bg-white rounded-2xl p-5 border-2 border-indigo-200 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Your Space (Bed A)
            </div>

            <div className="flex items-start gap-4">
              <img
                src={currentStudent?.avatarUrl}
                alt="Rahul Sharma"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-200"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Bed A · Window Side
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {currentStudent?.name || 'Rahul Sharma'}
                </h3>
                <div className="text-xs text-slate-500">
                  Christ University · MCA Final Year
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  +91 98765 43210
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Monthly Fee:</span>
              <span className="font-bold text-slate-800">₹8,000 / month (Paid)</span>
            </div>
          </div>

          {/* Bed B - Aman Khan (Roommate) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs relative">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Aman Khan"
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bed B · Roommate
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Aman Khan
                </h3>
                <div className="text-xs text-slate-500">
                  Software Engineer @ Infosys
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  +91 98111 22334
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Hostel Resident Since:</span>
              <span className="font-bold text-slate-800">September 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Facilities & Diagnostics */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Room 401 Amenities & Health Checklist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspected weekly by StaySphere Facilities Management
            </p>
          </div>
          <button
            onClick={onOpenCreateComplaint}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Report An Issue
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {facilities.map((fac, i) => {
            const Icon = fac.icon;

            return (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all ${
                  fac.ok 
                    ? 'bg-slate-50/70 border-slate-200' 
                    : 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    fac.ok ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-100 text-amber-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    fac.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-900 font-extrabold'
                  }`}>
                    {fac.status}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900">
                  {fac.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {fac.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room 401 Active Maintenance & Complaints History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-600" />
            <span>Room 401 Maintenance Work Orders</span>
          </h2>
          <span className="text-xs text-slate-500">
            {roomComplaints.length} tickets recorded
          </span>
        </div>

        {roomComplaints.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">You're all caught up 🎉</div>
            <div className="text-xs text-slate-500 mt-0.5">No open maintenance complaints for Room 401.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {roomComplaints.map(cmp => (
              <div 
                key={cmp.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cmp.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {cmp.priority.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {cmp.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {cmp.description}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    Logged: {cmp.createdAt} · Assigned: <strong>{cmp.assignedStaffName || 'Pending Assignment'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    cmp.status === 'In Progress' 
                      ? 'bg-indigo-100 text-indigo-800'
                      : (cmp.status === 'Completed' || cmp.status === 'Closed')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cmp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
