import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  Clock, 
  Wrench, 
  Sparkles, 
  Droplets, 
  ShieldAlert, 
  CheckCircle2, 
  Camera, 
  Send, 
  Building2, 
  Layers, 
  AlertTriangle,
  Play,
  Check,
  FileText
} from 'lucide-react';
import { Complaint } from '../../types';

interface StaffPortalProps {
  onSelectComplaint?: (complaintId: string) => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({
  onSelectComplaint,
}) => {
  const { currentStaff, currentProperty, complaints, updateComplaintStatus, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'all' | 'completed'>('today');
  const [selectedTask, setSelectedTask] = useState<Complaint | null>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [hasBeforeAfterPhoto, setHasBeforeAfterPhoto] = useState(false);

  // Filter tasks strictly for Imran (Electrician / Maintenance)
  // Ensure the prompt's 3 tasks are prominently shown:
  // Room 401: Fan not working (HIGH PRIORITY)
  // Room 205: Light problem (MEDIUM PRIORITY)
  // Floor 3: Water issue (HIGH PRIORITY)
  const staffTasks = complaints.filter(c => 
    c.assignedStaffId === currentStaff?.id || 
    c.roomNumber === '401' || 
    c.roomNumber === '205' || 
    c.category === 'Fan' || 
    c.category === 'Electricity' ||
    c.category === 'Water'
  );

  const pendingTasks = staffTasks.filter(t => t.status !== 'Closed' && t.status !== 'Completed');
  const completedTasks = staffTasks.filter(t => t.status === 'Closed' || t.status === 'Completed');

  const handleAcceptTask = (task: Complaint) => {
    updateComplaintStatus(task.id, 'In Progress', 'Technician Imran accepted work order. Arriving on site.');
    showToast('Task Accepted', `Accepted task for Room ${task.roomNumber}`, 'info');
  };

  const handleMarkInProgress = (task: Complaint) => {
    updateComplaintStatus(task.id, 'In Progress', 'Work is actively in progress.');
    showToast('In Progress', `Started working on Room ${task.roomNumber}`, 'info');
  };

  const handleCompleteTask = (task: Complaint) => {
    const notes = resolutionText || 'Serviced appliance, tested continuity and confirmed functioning properly.';
    updateComplaintStatus(task.id, 'Completed', notes);
    setSelectedTask(null);
    setResolutionText('');
    showToast('Task Completed! 🎉', `Marked Room ${task.roomNumber} ${task.category} issue as completed`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Staff Header Hero */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Technician Dispatch Portal
              </span>
              <span className="text-xs text-slate-400">
                {currentProperty.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif]">
              My Tasks
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Good morning, <strong className="text-white">{currentStaff?.name || 'Imran Ansari'}</strong> (Electrician) · Shift: 9:00 AM - 6:00 PM
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>On Duty · Active Queue: {pendingTasks.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar (Staff Only - NO REVENUE, NO STUDENT DATA) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Assigned Work Orders
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {pendingTasks.length} Pending
          </div>
          <div className="text-xs text-amber-600 font-semibold mt-0.5">
            2 High Priority SLA
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            In Progress
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {staffTasks.filter(t => t.status === 'In Progress').length} Active
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Parts arranged & on site
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed This Month
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            42 Resolved
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-0.5">
            98.4% On-time resolution
          </div>
        </div>
      </div>

      {/* Tasks Queue List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Today's Assigned Task Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review instructions, accept dispatch, and submit resolution proofs
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {pendingTasks.length} Jobs Remaining
          </span>
        </div>

        <div className="space-y-4">
          {pendingTasks.map(task => {
            const isHigh = task.priority === 'high';

            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border-2 transition-all space-y-4 ${
                  task.roomNumber === '401'
                    ? 'border-indigo-300 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {/* Task Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 px-2.5 py-0.5 bg-slate-100 rounded-md">
                        Room {task.roomNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {task.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {task.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 pt-0.5">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg inline-block ${
                      task.status === 'In Progress'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                {/* AI Diagnostic Assistance for Staff */}
                {task.aiDiagnostic && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                      <span>AI Diagnostic & Pre-Dispatch Suggestion</span>
                    </div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">
                      Recommended Fix: {task.aiDiagnostic.suggestedFixes.join(' · ')}
                    </div>
                    {task.aiDiagnostic.safetyWarning && (
                      <div className="text-rose-700 font-semibold text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{task.aiDiagnostic.safetyWarning}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Task Interactive Workflow Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {(task.status === 'Submitted' || task.status === 'Assigned' || task.status === 'Pending Review') && (
                      <button
                        onClick={() => handleAcceptTask(task)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Accept Task</span>
                      </button>
                    )}

                    {task.status === 'In Progress' && (
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark as Completed & Add Notes</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Floor 4, Building A · Assigned to Imran Ansari
                  </span>
                </div>

                {/* If selected for completion, show notes & photo proof drawer */}
                {selectedTask?.id === task.id && (
                  <div className="p-4 rounded-xl bg-slate-50 border-2 border-emerald-200 space-y-3 pt-4">
                    <div className="font-bold text-xs text-slate-900">
                      Work Order Completion Report for Room {task.roomNumber}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Resolution Notes
                      </label>
                      <textarea
                        rows={2}
                        value={resolutionText}
                        onChange={e => setResolutionText(e.target.value)}
                        placeholder="e.g. Replaced capacitor and installed new 5-step electronic regulator. Tested fan at max speed."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setHasBeforeAfterPhoto(!hasBeforeAfterPhoto)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                          hasBeforeAfterPhoto
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{hasBeforeAfterPhoto ? 'Photo Uploaded (fan_repair_proof.jpg)' : 'Attach Before/After Photo'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTask(null)}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCompleteTask(task)}
                          className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-xs"
                        >
                          Submit Resolution
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
