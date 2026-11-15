import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Receipt, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  ArrowUpRight, 
  QrCode,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { Payment } from '../../types';

interface StudentPaymentsViewProps {
  onViewReceipt: (paymentId: string) => void;
  onPayNow: () => void;
}

export const StudentPaymentsView: React.FC<StudentPaymentsViewProps> = ({
  onViewReceipt,
  onPayNow,
}) => {
  const { currentStudent, currentProperty, payments, showToast } = useApp();

  // ONLY Rahul's own payments
  const studentPayments = payments.filter(p => p.studentId === currentStudent?.id);

  // If initial has only 1, supply the authentic history per prompt:
  // September ₹8,000 UPI Paid, August ₹8,000 Cash Paid, July ₹8,000 UPI Paid
  const completeHistory: Payment[] = studentPayments.length >= 3 
    ? studentPayments 
    : [
        studentPayments[0] || {
          id: 'pay-1',
          receiptNumber: 'REC-2026-0901',
          propertyId: 'prop-1',
          studentId: 'std-1',
          studentName: 'Rahul Sharma',
          roomNumber: '401',
          bedCode: 'Bed A',
          amount: 8000,
          monthFor: 'September 2026',
          paymentDate: '2026-09-03',
          dueDate: '2026-09-05',
          paymentMethod: 'UPI',
          status: 'paid',
          transactionId: 'UPI/6267891244/ICICI',
          remainingBalance: 0,
        },
        {
          id: 'pay-aug',
          receiptNumber: 'REC-2026-0801',
          propertyId: 'prop-1',
          studentId: 'std-1',
          studentName: 'Rahul Sharma',
          roomNumber: '401',
          bedCode: 'Bed A',
          amount: 8000,
          monthFor: 'August 2026',
          paymentDate: '2026-08-04',
          dueDate: '2026-08-05',
          paymentMethod: 'Cash',
          status: 'paid',
          transactionId: 'CASH-MNGR-0841',
          remainingBalance: 0,
        },
        {
          id: 'pay-jul',
          receiptNumber: 'REC-2026-0701',
          propertyId: 'prop-1',
          studentId: 'std-1',
          studentName: 'Rahul Sharma',
          roomNumber: '401',
          bedCode: 'Bed A',
          amount: 8000,
          monthFor: 'July 2026',
          paymentDate: '2026-07-02',
          dueDate: '2026-07-05',
          paymentMethod: 'UPI',
          status: 'paid',
          transactionId: 'UPI/5198002341/HDFC',
          remainingBalance: 0,
        },
      ];

  const handleDownload = (p: Payment) => {
    showToast('Receipt Downloaded', `Digital Receipt #${p.receiptNumber} saved as PDF`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Current Fee Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Accommodation Fee
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              ₹8,000 <span className="text-sm font-semibold text-slate-500">/ month</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Room 401 (Bed A) · {currentProperty.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPayNow}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Advance / Next Fee</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800">Current Status</span>
            <div className="text-base font-extrabold text-emerald-900 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PAID (September 2026)</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Zero outstanding arrears</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Next Due Date</span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>5 October 2026</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Grace period up to 10th</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Security Deposit</span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>₹16,000 (Secured)</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Refundable at tenancy exit</div>
          </div>
        </div>
      </div>

      {/* Payment History Table (Rahul's ONLY) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              My Payment History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official records & digital tax receipts for Rahul Sharma
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {completeHistory.length} Cycles Completed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Month</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Payment Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completeHistory.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900">
                    {p.monthFor}
                    <div className="text-[10px] text-slate-400 font-mono">
                      #{p.receiptNumber}
                    </div>
                  </td>
                  <td className="py-3.5 font-black text-slate-900">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold font-mono text-[10px]">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600">
                    {p.paymentDate}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Paid</span>
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewReceipt(p.id)}
                        className="px-2.5 py-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg font-bold transition-all flex items-center gap-1"
                        title="View Receipt"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDownload(p)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-bold transition-all flex items-center gap-1"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
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
