import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { Complaint } from '../../types';

interface StudentComplaintsViewProps {
  onOpenCreateComplaint: () => void;
}

export const StudentComplaintsView: React.FC<StudentComplaintsViewProps> = ({
  onOpenCreateComplaint,
}) => {
  const { currentStudent, complaints, verifyComplaintResolution } = useApp();

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reopenPromptId, setReopenPromptId] = useState<string | null>(null);
  const [reopenReasonText, setReopenReasonText] = useState('');

  // ONLY Rahul's own complaints
  const myComplaints = complaints.filter(c => c.studentId === currentStudent?.id);

  const getTimelineStep = (status: string) => {
    switch (status) {
      case 'Submitted': return 1;
      case 'Pending Review': return 2;
      case 'Assigned': return 3;
      case 'In Progress': return 4;
      case 'Completed': return 5;
      case 'Verified':
      case 'Closed': return 6;
      case 'Reopened': return 4;
      default: return 2;
    }
  };

  const stepsList = ['Submitted', 'Reviewed', 'Assigned', 'In Progress', 'Completed', 'Verified'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Resident Service Desk
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            My Maintenance Complaints & Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track repair status, technician assignments, and resolution notes for Room 401
          </p>
        </div>

        <button
          onClick={onOpenCreateComplaint}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Complaint</span>
        </button>
      </div>

      {/* Complaints List */}
      {myComplaints.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            You're all caught up 🎉
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active maintenance complaints for Room 401. If anything breaks or needs servicing, click "Raise New Complaint".
          </p>
          <button
            onClick={onOpenCreateComplaint}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Raise Issue Now
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {myComplaints.map(cmp => {
            const currentStepIdx = getTimelineStep(cmp.status);

            return (
              <div 
                key={cmp.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5"
              >
                {/* Ticket Top Details */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                        #{cmp.ticketNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        cmp.priority === 'high' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cmp.priority} Priority
                      </span>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Category: {cmp.category}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 pt-1">
                      {cmp.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cmp.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block font-medium">Assigned Technician</span>
                    <strong className="text-xs text-slate-800 font-bold block mt-0.5">
                      {cmp.assignedStaffName || 'Under Review / Unassigned'}
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      {cmp.assignedStaffRole || 'Hostel Operations'}
                    </span>
                  </div>
                </div>

                {/* 6-Stage Timeline Per Spec */}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Progress Timeline
                  </div>

                  <div className="grid grid-cols-6 gap-2 text-center">
                    {stepsList.map((stepName, idx) => {
                      const stepNum = idx + 1;
                      const isPast = stepNum < currentStepIdx;
                      const isCurrent = stepNum === currentStepIdx;
                      const isFuture = stepNum > currentStepIdx;

                      return (
                        <div key={stepName} className="space-y-1.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                            isPast
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse'
                              : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isPast ? <Check className="w-4 h-4" /> : stepNum}
                          </div>
                          <div className={`text-[10px] font-bold ${
                            isPast ? 'text-emerald-700' : isCurrent ? 'text-indigo-700' : 'text-slate-400'
                          }`}>
                            {stepName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Staff Resolution Notes if any */}
                {cmp.resolutionNotes && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Technician Notes ({cmp.assignedStaffName})</span>
                    </div>
                    <p className="text-indigo-800 leading-relaxed">
                      "{cmp.resolutionNotes}"
                    </p>
                  </div>
                )}

                {/* Status-specific Verification Blocks */}
                {cmp.status === 'Completed' && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Action Required: Verify Technician Fix</span>
                        </div>
                        <p className="text-amber-800 text-[11px] mt-0.5">
                          {cmp.assignedStaffName || 'The maintenance technician'} has reported this repair as completed. Please confirm if the issue is completely resolved.
                        </p>
                      </div>
                    </div>

                    {reopenPromptId === cmp.id ? (
                      <div className="p-3 rounded-xl bg-white border border-rose-200 space-y-2">
                        <label className="block text-[11px] font-bold text-rose-800">
                          Why is this issue still unresolved? *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Water is still leaking from the tap joint"
                          value={reopenReasonText}
                          onChange={e => setReopenReasonText(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => {
                              setReopenPromptId(null);
                              setReopenReasonText('');
                            }}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              verifyComplaintResolution(cmp.id, false, undefined, reopenReasonText || 'Problem still persists');
                              setReopenPromptId(null);
                              setReopenReasonText('');
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold"
                          >
                            Reopen Ticket & Notify Warden
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-700">Rate fix quality:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-base leading-none transition-transform active:scale-125 ${
                                  star <= rating ? 'text-amber-500' : 'text-slate-300'
                                }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReopenPromptId(cmp.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors"
                          >
                            ⚠️ Still Persists (Reopen)
                          </button>
                          <button
                            onClick={() => verifyComplaintResolution(cmp.id, true, rating)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                          >
                            ✓ Confirm Fix & Close Ticket
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {cmp.status === 'Verified' && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>
                        <strong>Resolution Verified:</strong> Confirmed by you on {cmp.studentVerifiedAt?.split(' ')[0] || 'recently'}.
                      </span>
                    </div>
                    <span className="font-bold text-amber-600">
                      {'★'.repeat(cmp.verifiedResolutionRating || 5)} ({cmp.verifiedResolutionRating || 5}/5)
                    </span>
                  </div>
                )}

                {cmp.status === 'Reopened' && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Ticket Reopened — Priority Re-inspection</span>
                    </div>
                    <p className="text-rose-700 text-[11px]">
                      Reason: "{cmp.reopenReason || 'Issue still persists'}". The warden has flagged this for immediate technician follow-up.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
