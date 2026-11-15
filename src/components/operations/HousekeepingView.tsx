import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Calendar,
  Layers
} from 'lucide-react';

interface CleaningTask {
  id: string;
  roomNumber: string;
  floor: string;
  assignedStaff: string;
  type: 'Deep Sanitization' | 'Daily Mopping' | 'Linen Replacement' | 'Washroom Scrubbing';
  scheduledTime: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export const HousekeepingView: React.FC = () => {
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'pending'>('all');

  const [tasks, setTasks] = useState<CleaningTask[]>([
    { id: 'hk-1', roomNumber: '101', floor: 'Floor 1', assignedStaff: 'Sunita Bai', type: 'Daily Mopping', scheduledTime: '09:00 AM', status: 'completed' },
    { id: 'hk-2', roomNumber: '102', floor: 'Floor 1', assignedStaff: 'Sunita Bai', type: 'Washroom Scrubbing', scheduledTime: '09:30 AM', status: 'completed' },
    { id: 'hk-3', roomNumber: '104', floor: 'Floor 1', assignedStaff: 'Sunita Bai', type: 'Linen Replacement', scheduledTime: '10:15 AM', status: 'in_progress' },
    { id: 'hk-4', roomNumber: '201', floor: 'Floor 2', assignedStaff: 'Raju Kumar', type: 'Daily Mopping', scheduledTime: '10:30 AM', status: 'in_progress' },
    { id: 'hk-5', roomNumber: '202', floor: 'Floor 2', assignedStaff: 'Raju Kumar', type: 'Deep Sanitization', scheduledTime: '11:15 AM', status: 'pending' },
    { id: 'hk-6', roomNumber: '301', floor: 'Floor 3', assignedStaff: 'Manoj Verma', type: 'Washroom Scrubbing', scheduledTime: '11:45 AM', status: 'pending' },
    { id: 'hk-7', roomNumber: '302', floor: 'Floor 3', assignedStaff: 'Manoj Verma', type: 'Daily Mopping', scheduledTime: '12:15 PM', status: 'pending' },
  ]);

  const handleMarkComplete = (id: string, room: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    showToast('Housekeeping Verified', `Room ${room} housekeeping logged as inspected and completed.`, 'success');
  };

  const filtered = tasks.filter(t => {
    const matchesSearch = t.roomNumber.includes(searchTerm) || t.assignedStaff.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Hygiene & Sanitation Roster
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Housekeeping Operations</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Track daily room turnarounds, scheduled deep sanitization, and staff floor assignments.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-right shrink-0">
            <p className="text-xs text-slate-300 font-medium">Daily Roster Completion</p>
            <p className="text-2xl font-bold text-teal-300">{completedCount} / {tasks.length} ({progressPercent}%)</p>
            <div className="w-32 bg-white/20 rounded-full h-2 mt-2 overflow-hidden">
              <div className="bg-teal-400 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search room number or staff name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {(['all', 'completed', 'in_progress', 'pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                statusFilter === st
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'all' ? 'All Tasks' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Room & Location</th>
                <th className="px-5 py-3.5">Sanitization Routine</th>
                <th className="px-5 py-3.5">Assigned Housekeeper</th>
                <th className="px-5 py-3.5">Scheduled Slot</th>
                <th className="px-5 py-3.5">Inspection Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">Room {t.roomNumber}</div>
                    <div className="text-xs text-slate-500">{t.floor}</div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {t.type}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{t.assignedStaff}</div>
                    <div className="text-xs text-slate-400">Duty Staff</div>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600">
                    {t.scheduledTime}
                  </td>
                  <td className="px-5 py-4">
                    {t.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Sanitized
                      </span>
                    )}
                    {t.status === 'in_progress' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> In Progress
                      </span>
                    )}
                    {t.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        Queued
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {t.status !== 'completed' ? (
                      <button
                        onClick={() => handleMarkComplete(t.id, t.roomNumber)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-2xs"
                      >
                        Sign-off
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
