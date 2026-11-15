import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest, RequestType, RequestStatus } from '../../types';
import { RequestStatusBadge } from '../common/StatusBadge';
import { 
  Droplets, 
  Sparkles, 
  Zap, 
  Layers, 
  Plus, 
  CheckCircle2, 
  Clock, 
  User, 
  ArrowRight 
} from 'lucide-react';

export const RequestsView: React.FC = () => {
  const { serviceRequests, currentProperty, students, staff, addServiceRequest, updateServiceRequestStatus, showToast } = useApp();

  const [filterType, setFilterType] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  // New Request Form State
  const propertyStudents = students.filter(s => s.propertyId === currentProperty.id);
  const [selectedStudentId, setSelectedStudentId] = useState(propertyStudents[0]?.id || '');
  const [requestType, setRequestType] = useState<RequestType>('Water');
  const [notes, setNotes] = useState('');

  const propertyRequests = serviceRequests.filter(r => r.propertyId === currentProperty.id);

  const filteredRequests = propertyRequests.filter(r => {
    return filterType === 'all' || r.type === filterType;
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const std = propertyStudents.find(s => s.id === selectedStudentId);
    if (!std) return;

    addServiceRequest({
      propertyId: currentProperty.id,
      studentId: std.id,
      studentName: std.name,
      roomNumber: std.roomId.replace('rm-', ''),
      type: requestType,
      notes: notes || `Request for ${requestType} service`,
    });

    setIsCreating(false);
    setNotes('');
  };

  const handleNextStatus = (req: ServiceRequest) => {
    const sequence: RequestStatus[] = ['Submitted', 'Assigned', 'In Progress', 'Completed'];
    const curIdx = sequence.indexOf(req.status);
    if (curIdx < sequence.length - 1) {
      const next = sequence[curIdx + 1];
      updateServiceRequestStatus(req.id, next);
      showToast('Service Updated', `Marked as ${next}`, 'success');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-blue-600 font-bold">Housekeeping & Utilities</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Service Requests & Utility Support
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            RO drinking water refills, room mopping, laundry assistance, and bulb replacements.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Service Request</span>
        </button>
      </div>

      {/* Creation Modal */}
      {isCreating && (
        <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-md animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Service Dispatch</h3>
          <form onSubmit={handleCreateRequest} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resident</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                >
                  {propertyStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — Room {s.roomId.replace('rm-', '')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Type</label>
                <select
                  value={requestType}
                  onChange={e => setRequestType(e.target.value as RequestType)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                >
                  <option value="Water">RO Drinking Water Can Refill</option>
                  <option value="Cleaning">Room Floor Mop & Dusting</option>
                  <option value="Electricity">Bulb / Power Point Check</option>
                  <option value="Laundry">Laundry / Linen Exchange</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions</label>
              <input
                type="text"
                placeholder="e.g. Please clean between 2 PM and 4 PM while resident is in college"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs"
              >
                Dispatch Runner
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200">
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'Water', label: '💧 Water Cans' },
          { id: 'Cleaning', label: '🧹 Cleaning' },
          { id: 'Electricity', label: '⚡ Electricity' },
          { id: 'Laundry', label: '🧺 Laundry' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map(req => {
          const typeIcons: Record<string, React.ReactNode> = {
            Water: <Droplets className="w-4 h-4 text-blue-500" />,
            Cleaning: <Sparkles className="w-4 h-4 text-teal-500" />,
            Electricity: <Zap className="w-4 h-4 text-amber-500" />,
            Laundry: <Layers className="w-4 h-4 text-purple-500" />,
            General: <Clock className="w-4 h-4 text-slate-500" />,
          };

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {typeIcons[req.type] || <Clock className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{req.type} Request</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Room {req.roomNumber}</span>
                    </div>
                  </div>

                  <RequestStatusBadge status={req.status} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {req.description || (req as any).notes}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <span className="font-semibold text-slate-700">{req.studentName}</span>
                  <span>{req.createdAt}</span>
                </div>
              </div>

              {/* Status advancement button */}
              {req.status !== 'Completed' && (
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Assigned runner active</span>
                  <button
                    onClick={() => handleNextStatus(req)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Advance Status</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
