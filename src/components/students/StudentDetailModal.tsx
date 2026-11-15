import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { PaymentStatusBadge, ComplaintStatusBadge } from '../common/StatusBadge';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  Wrench, 
  LogOut, 
  DollarSign,
  Receipt,
  Download
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: (student: Student) => void;
  onOpenRecordPayment: (student: Student) => void;
  onViewReceipt: (paymentId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onOpenCheckout,
  onOpenRecordPayment,
  onViewReceipt,
}) => {
  const { payments, complaints, currentProperty } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'complaints' | 'documents'>('profile');

  if (!student) return null;

  // Student specific payments
  const studentPayments = payments.filter(p => p.studentId === student.id);
  // Student specific complaints
  const studentComplaints = complaints.filter(c => c.studentId === student.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student.name}
      subtitle={`Room ${student.roomId.replace('rm-', '')} • ${student.status}`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Profile Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3.5">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-600/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{student.name}</h3>
                <PaymentStatusBadge status={student.paymentStatus} />
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{student.collegeOrWork}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                <span>📞 {student.phone}</span>
                <span>•</span>
                <span>Joined {student.joiningDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                onClose();
                onOpenRecordPayment(student);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Record Fee</span>
            </button>

            {student.status !== 'Checked Out' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout(student);
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Check-Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
          {[
            { id: 'profile', label: 'Resident Info' },
            { id: 'payments', label: `Fee & Ledger (${studentPayments.length})` },
            { id: 'complaints', label: `Complaints (${studentComplaints.length})` },
            { id: 'documents', label: `Documents (${student.documents.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 transition-colors relative ${
                activeTab === tab.id
                  ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Profile & Guardian */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Accommodation Particulars
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Property:</span>
                    <span className="font-semibold text-slate-900">{currentProperty.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Room Allocated:</span>
                    <span className="font-semibold text-slate-900">Room {student.roomId.replace('rm-', '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rent:</span>
                    <span className="font-bold text-emerald-600">₹{student.monthlyFee.toLocaleString('en-IN')}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Security Deposit:</span>
                    <span className="font-bold text-slate-900">₹{student.securityDeposit.toLocaleString('en-IN')} (Held)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fee Due Date:</span>
                    <span className="font-semibold text-slate-900">{student.dueDay}th of every month</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Parent / Guardian Details
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guardian Name:</span>
                    <span className="font-semibold text-slate-900">{student.guardian.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Relationship:</span>
                    <span className="font-semibold text-slate-900">{student.guardian.relationship}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Primary Contact:</span>
                    <span className="font-semibold text-slate-900 font-mono">{student.guardian.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Emergency Phone:</span>
                    <span className="font-semibold text-rose-600 font-mono">{student.emergencyContact}</span>
                  </div>
                  {student.guardian.address && (
                    <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                      Home Address: {student.guardian.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Payment History */}
        {activeTab === 'payments' && (
          <div className="space-y-3">
            {studentPayments.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No payment receipts logged yet.</div>
            ) : (
              studentPayments.map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      ₹
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{p.monthFor} Rent</span>
                        <span className="text-[10px] font-mono text-slate-400">#{p.receiptNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {p.paymentDate || 'Pending payment'} • {p.paymentMethod}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900">₹{p.amount.toLocaleString('en-IN')}</div>
                      <PaymentStatusBadge status={p.status} />
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onViewReceipt(p.id);
                      }}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Digital Receipt"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Complaints History */}
        {activeTab === 'complaints' && (
          <div className="space-y-2">
            {studentComplaints.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No complaints registered by {student.name}.</div>
            ) : (
              studentComplaints.map(c => (
                <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{c.title}</div>
                    <ComplaintStatusBadge status={c.status} />
                  </div>
                  <p className="text-slate-600 text-[11px]">{c.description}</p>
                  <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                    <span>Ticket #{c.ticketNumber} • {c.createdAt}</span>
                    {c.assignedStaffName && (
                      <span className="font-semibold text-indigo-600">Assigned: {c.assignedStaffName} ({c.assignedStaffRole})</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Verified Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-2">
            {student.documents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No documents uploaded.</div>
            ) : (
              student.documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[10px] text-slate-400">Uploaded {doc.uploadedAt}</div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
