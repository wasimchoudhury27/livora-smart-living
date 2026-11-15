import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus, ComplaintPriority } from '../../types';
import { ComplaintStatusBadge, PriorityBadge } from '../common/StatusBadge';
import { diagnoseComplaintAI, AIComplaintDiagnostic } from '../../services/aiService';
import { 
  Wrench, 
  User, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  UserCheck,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ComplaintModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (studentId: string) => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onSelectStudent,
}) => {
  const { staff, updateComplaintStatus, assignComplaintStaff, showToast } = useApp();

  const [diagnostic, setDiagnostic] = useState<AIComplaintDiagnostic | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  if (!complaint) return null;

  const handleRunAI = async () => {
    setIsDiagnosing(true);
    try {
      const res = await diagnoseComplaintAI(complaint.title, complaint.description);
      setDiagnostic(res);
      showToast('AI Diagnosis Ready', 'Safety analysis and root-cause fixes generated', 'info');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleAssign = (staffId: string) => {
    const stf = staff.find(s => s.id === staffId);
    if (stf) {
      assignComplaintStaff(complaint.id, stf.id, stf.name, stf.role);
      showToast('Staff Assigned', `Assigned ${stf.name} (${stf.role}) to ticket`, 'success');
    }
  };

  const statusWorkflow: ComplaintStatus[] = [
    'Submitted',
    'Pending Review',
    'Assigned',
    'In Progress',
    'Completed',
    'Verified',
    'Closed',
  ];

  const currentStatusIndex = statusWorkflow.indexOf(complaint.status);
  const nextStatus = statusWorkflow[currentStatusIndex + 1];

  const handleAdvanceStatus = () => {
    if (nextStatus) {
      updateComplaintStatus(complaint.id, nextStatus);
      showToast('Status Advanced', `Ticket moved to ${nextStatus}`, 'success');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket #${complaint.ticketNumber}`}
      subtitle={`Room ${complaint.roomNumber} • Logged on ${complaint.createdAt}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Ticket Header & Status Trail */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {complaint.category}
              </span>
              <PriorityBadge priority={complaint.priority} />
            </div>

            <div className="flex items-center gap-2">
              <ComplaintStatusBadge status={complaint.status} />
              {nextStatus && (
                <button
                  onClick={handleAdvanceStatus}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                >
                  <span>Mark {nextStatus}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900">{complaint.title}</h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
            {complaint.description}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Resident:</span>
              <button
                onClick={() => {
                  onClose();
                  onSelectStudent(complaint.studentId);
                }}
                className="font-bold text-indigo-600 hover:underline"
              >
                {complaint.studentName}
              </button>
            </div>
            <span>Room {complaint.roomNumber}</span>
          </div>
        </div>

        {/* AI Diagnostics Engine Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-500/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                LIVORA AI Diagnostic Engine
              </h4>
            </div>

            {!diagnostic && (
              <button
                onClick={handleRunAI}
                disabled={isDiagnosing}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isDiagnosing ? 'Analyzing issue...' : 'Run Diagnostics'}</span>
              </button>
            )}
          </div>

          {diagnostic ? (
            <div className="space-y-3 text-xs pt-1">
              {diagnostic.safetyWarning && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="font-bold text-rose-300">SAFETY ADVISORY: </strong>
                    {diagnostic.safetyWarning}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Hypothesized Root Causes:
                </span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-300 text-[11px]">
                  {diagnostic.possibleCauses.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Technician Action Checklist:
                </span>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-300 text-[11px]">
                  {diagnostic.suggestedFixes.map((fix, i) => (
                    <li key={i}>{fix}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-300">
              Generate instant root-cause diagnostics, safety warnings, and technician repair recommendations using AI.
            </p>
          )}
        </div>

        {/* Staff Assignment & Technician Notes */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Assigned Maintenance Personnel
          </h4>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {complaint.assignedStaffName ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                    {complaint.assignedStaffName.substring(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{complaint.assignedStaffName}</div>
                    <div className="text-[11px] text-indigo-600 font-semibold">{complaint.assignedStaffRole}</div>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> No staff assigned yet
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                onChange={e => {
                  if (e.target.value) handleAssign(e.target.value);
                }}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="">Assign / Reassign Staff</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
