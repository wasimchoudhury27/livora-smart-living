import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Student, PaymentMethod, PaymentStatus } from '../../types';
import { CreditCard, CheckCircle2, User, Calendar, Receipt } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedStudent?: Student | null;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  preSelectedStudent,
}) => {
  const { students, currentProperty, recordPayment, showToast } = useApp();

  const propertyStudents = students.filter(s => s.propertyId === currentProperty.id && s.status !== 'Checked Out');

  const [studentId, setStudentId] = useState<string>(preSelectedStudent?.id || propertyStudents[0]?.id || '');
  const [amount, setAmount] = useState<number>(8000);
  const [monthFor, setMonthFor] = useState<string>('September 2026');
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [transactionId, setTransactionId] = useState<string>('');
  const [status, setStatus] = useState<PaymentStatus>('paid');

  const selectedStudent = propertyStudents.find(s => s.id === studentId);

  useEffect(() => {
    if (preSelectedStudent) {
      setStudentId(preSelectedStudent.id);
      setAmount(preSelectedStudent.monthlyFee);
    } else if (selectedStudent) {
      setAmount(selectedStudent.monthlyFee);
    }
  }, [preSelectedStudent, studentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || amount <= 0) return;

    const todayStr = new Date().toISOString().split('T')[0];
    recordPayment({
      propertyId: currentProperty.id,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      roomNumber: selectedStudent.roomId.replace('rm-', ''),
      bedCode: selectedStudent.bedId.split('-').pop()?.toUpperCase() || 'BED A',
      amount: Number(amount),
      monthFor,
      paymentDate: todayStr,
      dueDate: todayStr,
      remainingBalance: status === 'paid' ? 0 : Math.max(0, selectedStudent.monthlyFee - Number(amount)),
      status,
      paymentMethod: method,
      transactionId: transactionId || `TXN-STAY-${Date.now().toString().slice(-6)}`,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment / Settlement"
      subtitle="Log offline cash, UPI, bank transfer, or card rent payments"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Resident / Student *
          </label>
          <select
            value={studentId}
            onChange={e => {
              setStudentId(e.target.value);
              const std = propertyStudents.find(s => s.id === e.target.value);
              if (std) setAmount(std.monthlyFee);
            }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-semibold"
          >
            {propertyStudents.map(std => (
              <option key={std.id} value={std.id}>
                {std.name} — Room {std.roomId.replace('rm-', '')} (₹{std.monthlyFee.toLocaleString('en-IN')}/mo)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount Paid (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Billing Month Cycle
            </label>
            <select
              value={monthFor}
              onChange={e => setMonthFor(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="September 2026">September 2026</option>
              <option value="October 2026">October 2026</option>
              <option value="August 2026">August 2026</option>
              <option value="November 2026">November 2026</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method
            </label>
            <select
              value={method}
              onChange={e => setMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Cash">Cash at Counter</option>
              <option value="Bank Transfer">NEFT / IMPS Bank Transfer</option>
              <option value="Debit Card">Debit / Credit Card</option>
              <option value="Cheque">Bank Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Collection Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as PaymentStatus)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-semibold"
            >
              <option value="paid">Fully Paid</option>
              <option value="partial">Partial Payment</option>
              <option value="pending">Pending Confirmation</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Transaction ID / UTR / Reference Note
          </label>
          <input
            type="text"
            placeholder="e.g. UPI/42561984210 or Cash Voucher 104"
            value={transactionId}
            onChange={e => setTransactionId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-mono"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Generate Official Receipt</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
