import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Wrench, 
  Users, 
  Sparkles, 
  Droplets, 
  Zap, 
  Bed, 
  AlertCircle, 
  CheckCircle2, 
  PhoneCall, 
  ArrowRight,
  Clock,
  Layers,
  Building2,
  Calendar
} from 'lucide-react';
import { Complaint, Staff } from '../../types';

interface ManagerPortalProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (complaintId: string) => void;
}

export const ManagerPortal: React.FC<ManagerPortalProps> = ({
  onNavigate,
  onSelectComplaint,
}) => {
  const { currentProperty, staff, complaints, serviceRequests, stats, assignStaffToComplaint, updateComplaintStatus, showToast } = useApp();

  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');

  const urgentComplaints = complaints.filter(c => c.priority === 'high' && c.status !== 'Completed' && c.status !== 'Closed');
  const activeStaff = staff.filter(s => s.status === 'Active');

  const handleQuickAssign = (complaintId: string, staffId: string) => {
    assignStaffToComplaint(complaintId, staffId);
    showToast('Staff Dispatched', 'Technician assigned to work order', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                Operations Control Center
              </span>
              <span className="text-xs text-blue-200">
                {currentProperty.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif]">
              Good morning, {currentProperty.managerName || 'Operations Manager'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-200">
              Shift Supervision · Staff Rostering · Resident Services SLA · Facility Maintenance
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('complaints')}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>Dispatch Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Open Complaints
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {stats.openComplaints} Tickets
          </div>
          <div className="text-xs text-rose-700 font-semibold mt-0.5">
            {urgentComplaints.length} High Priority SLA
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Staff On Duty
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {activeStaff.length} / {staff.length} Active
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            All shifts covered
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Occupancy
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {stats.occupancyRate}%
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {stats.availableBeds} beds ready for check-in
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Monthly Fee Collection
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            90.3%
          </div>
          <div className="text-xs text-amber-600 font-semibold mt-0.5">
            ₹{stats.feesPending.toLocaleString('en-IN')} pending
          </div>
        </div>
      </div>

      {/* Main Operations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): High Priority Urgent Issues */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Urgent Maintenance Issues Needing Dispatch</span>
            </h2>
            <button
              onClick={() => onNavigate('complaints')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Full Kanban Board →
            </button>
          </div>

          <div className="space-y-3">
            {urgentComplaints.slice(0, 4).map(c => (
              <div 
                key={c.id} 
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      High Priority
                    </span>
                    <strong className="text-xs text-slate-900 font-bold">
                      Room {c.roomNumber} ({c.category})
                    </strong>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Logged by {c.studentName} · Assigned: <strong className="text-slate-800">{c.assignedStaffName || 'None'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={e => handleQuickAssign(c.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Dispatch Staff...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 col): Staff Availability Roster */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Staff Duty Roster</span>
            </h2>
            <button
              onClick={() => onNavigate('staff')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {staff.slice(0, 5).map(s => (
              <div key={s.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={s.avatarUrl}
                    alt={s.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-500">{s.role} · {s.shiftTiming}</div>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
