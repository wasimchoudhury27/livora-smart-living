import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintCategory, ComplaintStatus, ComplaintPriority } from '../../types';
import { ComplaintStatusBadge, PriorityBadge } from '../common/StatusBadge';
import { 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  User, 
  Clock, 
  Kanban, 
  List, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface ComplaintsViewProps {
  onOpenCreateComplaint: () => void;
  onSelectComplaint: (complaintId: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  onOpenCreateComplaint,
  onSelectComplaint,
  onSelectStudent,
}) => {
  const { complaints, currentProperty, staff, recurringProblems } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const propertyComplaints = complaints.filter(c => c.propertyId === currentProperty.id);

  const filteredComplaints = propertyComplaints.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.ticketNumber.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.roomNumber.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Kanban column buckets
  const pendingTickets = filteredComplaints.filter(c => c.status === 'Submitted' || c.status === 'Pending Review' || c.status === 'Reopened');
  const inProgressTickets = filteredComplaints.filter(c => c.status === 'Assigned' || c.status === 'In Progress');
  const completedTickets = filteredComplaints.filter(c => c.status === 'Completed' || c.status === 'Verified' || c.status === 'Closed');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-rose-600 font-bold">Facility Operations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Maintenance & Complaints ({propertyComplaints.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            AI-powered diagnostics, technician dispatching, and SLA ticket resolution.
          </p>
        </div>

        <button
          onClick={onOpenCreateComplaint}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Maintenance Ticket</span>
        </button>
      </div>

      {/* Hackathon Innovation: Recurring Problem Clusters Detected */}
      {recurringProblems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-300 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">
                Recurring Problem Intelligence ({recurringProblems.length} Active Cluster{recurringProblems.length > 1 ? 's' : ''})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
              Automated Root Cause Detection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recurringProblems.map(cluster => (
              <div 
                key={cluster.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200/90 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      {cluster.severity.toUpperCase()} • {cluster.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">
                      {cluster.category} pattern in {cluster.buildingName} ({cluster.complaintCount} tickets)
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Rooms: {cluster.affectedRooms.join(', ')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                  <div>
                    <strong className="text-slate-800">Probable Root Cause:</strong> {cluster.probableRootCause}
                  </div>
                  <div>
                    <strong className="text-indigo-700">Recommended Action:</strong> {cluster.recommendedAction}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>First logged: {cluster.firstReportedAt}</span>
                  <button
                    onClick={() => {
                      setCategoryFilter(cluster.category);
                    }}
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    Filter Related Tickets →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search ticket #, title, resident, room..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Wi-Fi">Wi-Fi</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Carpentry">Carpentry</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Kanban / Table Toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Column 1: Queued / Review */}
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Review & Unassigned
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {pendingTickets.length}
              </span>
            </div>

            <div className="space-y-3">
              {pendingTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => onSelectComplaint(ticket.id)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer space-y-2.5 shadow-2xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {ticket.ticketNumber}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {ticket.title}
                  </h5>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Room {ticket.roomNumber}</span>
                    <span className="flex items-center gap-1 text-indigo-600 font-semibold group-hover:underline">
                      <Sparkles className="w-3 h-3" /> Diagnose
                    </span>
                  </div>
                </div>
              ))}
              {pendingTickets.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">No tickets awaiting review</div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Assigned / In Progress
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {inProgressTickets.length}
              </span>
            </div>

            <div className="space-y-3">
              {inProgressTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => onSelectComplaint(ticket.id)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer space-y-2.5 shadow-2xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {ticket.ticketNumber}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {ticket.title}
                  </h5>

                  <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Technician:</span>
                    <strong className="text-indigo-900 font-bold">{ticket.assignedStaffName || 'Imran (Electrician)'}</strong>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Room {ticket.roomNumber}</span>
                    <ComplaintStatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
              {inProgressTickets.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">No tickets currently in progress</div>
              )}
            </div>
          </div>

          {/* Column 3: Resolved */}
          <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Resolved & Closed
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {completedTickets.length}
              </span>
            </div>

            <div className="space-y-3">
              {completedTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => onSelectComplaint(ticket.id)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-2 shadow-2xs opacity-80 hover:opacity-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">
                      #{ticket.ticketNumber}
                    </span>
                    <ComplaintStatusBadge status={ticket.status} />
                  </div>

                  <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{ticket.title}</h5>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Room {ticket.roomNumber}</span>
                    <span className="text-emerald-600 font-semibold">TAT: 3.5 hrs</span>
                  </div>
                </div>
              ))}
              {completedTickets.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">No completed tickets</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Resident & Room</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Resolution</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectComplaint(c.id)}
                    className="hover:bg-indigo-50/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[10px] font-mono text-indigo-600">#{c.ticketNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{c.studentName}</div>
                      <div className="text-[11px] text-slate-500">Room {c.roomNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{c.category}</td>
                    <td className="py-3 px-4"><PriorityBadge priority={c.priority} /></td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-xs truncate max-w-[220px]" title={c.resolutionNotes || c.reopenReason || (c.assignedStaffName ? `Assigned to ${c.assignedStaffName}` : 'Under Review')}>
                        {c.status === 'Verified' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            ✓ Verified Fix ({c.verifiedResolutionRating || 5}★)
                          </span>
                        ) : c.status === 'Completed' ? (
                          <span className="text-indigo-700 font-semibold">
                            {c.resolutionNotes || 'Repairs completed — Awaiting resident verification'}
                          </span>
                        ) : c.status === 'Reopened' ? (
                          <span className="text-rose-700 font-semibold">
                            ⚠️ Reopened: {c.reopenReason || 'Issue still persists'}
                          </span>
                        ) : c.assignedStaffName ? (
                          <span className="text-slate-800">
                            Assigned: {c.assignedStaffName} ({c.assignedStaffRole || 'Staff'})
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Under Review</span>
                        )}
                      </div>
                      {c.assignedStaffName && (c.status === 'Completed' || c.status === 'Verified') && (
                        <div className="text-[10px] text-slate-500">
                          Handled by {c.assignedStaffName}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4"><ComplaintStatusBadge status={c.status} /></td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-indigo-600 font-semibold hover:underline">Inspect →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
