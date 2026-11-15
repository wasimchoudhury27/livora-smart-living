import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Camera, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { ComplaintStatus } from '../../types';

export const StaffTasksView: React.FC = () => {
  const { complaints, updateComplaintStatus, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || c.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const handleUpdateStatus = (complaintId: string, newStatus: ComplaintStatus, title: string) => {
    updateComplaintStatus(complaintId, newStatus);
    showToast('Job Updated', `Ticket "${title}" moved to ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <CheckSquare className="w-3.5 h-3.5" />
              Service Execution Queue
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Assigned Maintenance Jobs</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Inspect assigned repair tickets, report spare parts consumption, update resolution stages, and request resident sign-off.
            </p>
          </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-right shrink-0">
            <p className="text-xs text-slate-300 font-medium">Pending Service Jobs</p>
            <p className="text-2xl font-bold text-teal-300">
              {complaints.filter(c => c.status !== 'Completed' && c.status !== 'Verified' && c.status !== 'Closed').length}
            </p>
            <p className="text-[11px] text-teal-200 mt-0.5">Tickets requiring action</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by room, title, category..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterPriority === p
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p === 'all' ? 'All Priorities' : p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredComplaints.map((ticket) => (
          <div 
            key={ticket.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  ticket.priority === 'urgent' ? 'bg-rose-50 text-rose-600' : 'bg-teal-50 text-teal-600'
                }`}>
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      Room {ticket.roomNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-500 capitalize">
                      {ticket.category}
                    </span>
                    {ticket.priority === 'urgent' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{ticket.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  ticket.status === 'Completed' || ticket.status === 'Verified'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : ticket.status === 'In Progress'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {ticket.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                Created: {ticket.createdAt} • Resident: {ticket.studentName}
              </div>

              <div className="flex items-center gap-2">
                {(ticket.status === 'Submitted' || ticket.status === 'Assigned' || ticket.status === 'Pending Review') && (
                  <button
                    onClick={() => handleUpdateStatus(ticket.id, 'In Progress', ticket.title)}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-all shadow-2xs"
                  >
                    Start Work
                  </button>
                )}

                {ticket.status === 'In Progress' && (
                  <button
                    onClick={() => handleUpdateStatus(ticket.id, 'Completed', ticket.title)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Complete Job</span>
                  </button>
                )}

                {(ticket.status === 'Completed' || ticket.status === 'Verified') && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Ready for Resident Sign-off
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
