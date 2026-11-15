import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment, Student } from '../../types';
import { PaymentStatusBadge } from '../common/StatusBadge';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Plus, 
  Receipt, 
  Send, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Download,
  Share2
} from 'lucide-react';

interface PaymentsViewProps {
  onOpenRecordPayment: () => void;
  onViewReceipt: (paymentId: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  onOpenRecordPayment,
  onViewReceipt,
  onSelectStudent,
}) => {
  const { payments, currentProperty, stats, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  const propertyPayments = payments.filter(p => p.propertyId === currentProperty.id);

  const filteredPayments = propertyPayments.filter(payment => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      payment.studentName.toLowerCase().includes(q) ||
      payment.receiptNumber.toLowerCase().includes(q) ||
      payment.roomNumber.toLowerCase().includes(q) ||
      payment.transactionId?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMonth = monthFilter === 'all' || payment.monthFor.toLowerCase().includes(monthFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesMonth;
  });

  const handleBulkReminders = () => {
    showToast('Reminders Sent', 'Automated WhatsApp payment links sent to 7 overdue residents', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">Revenue & Collections</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Fees, Payments & Receipts
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Automated rent collection ledger, UPI reconciliations, and digital GST receipts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleBulkReminders}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Dues Reminders</span>
          </button>

          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Realized</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">
            ₹{stats.feesCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> 90.3% Collection Rate
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Dues</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">
            ₹{stats.feesPending.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1">Grace period active</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue Residents</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">7 Residents</div>
          <span className="text-[11px] text-rose-700 font-semibold mt-1">₹16,000 critically past due</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deposit Held</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">₹23.2 L</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1">Security liability reserve</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by receipt #, resident name, room #, UTR..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Months</option>
            <option value="september">September 2026</option>
            <option value="august">August 2026</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Receipt #</th>
                <th className="py-3.5 px-4">Resident</th>
                <th className="py-3.5 px-4">Room & Bed</th>
                <th className="py-3.5 px-4">Cycle</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method & Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    #{p.receiptNumber}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    <button
                      onClick={() => onSelectStudent(p.studentId)}
                      className="hover:underline hover:text-indigo-600 text-left"
                    >
                      {p.studentName}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    Room {p.roomNumber} ({p.bedCode})
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-700">
                    {p.monthFor}
                  </td>

                  <td className="py-3 px-4 font-mono font-extrabold text-slate-900 text-sm">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{p.paymentMethod}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {p.paymentDate || 'Pending payment'}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <PaymentStatusBadge status={p.status} />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onViewReceipt(p.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
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
