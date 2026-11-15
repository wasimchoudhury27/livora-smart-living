import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calculator, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Plus, 
  TrendingUp,
  FileSpreadsheet,
  Building2,
  DollarSign
} from 'lucide-react';
import { Payment } from '../../types';

interface AccountantPortalProps {
  onOpenRecordPayment: () => void;
  onViewReceipt: (paymentId: string) => void;
  onNavigate: (view: string) => void;
}

export const AccountantPortal: React.FC<AccountantPortalProps> = ({
  onOpenRecordPayment,
  onViewReceipt,
  onNavigate,
}) => {
  const { currentProperty, payments, expenses, stats, showToast } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const displayedPayments = payments.filter(p => {
    if (filterType === 'all') return true;
    return p.status === filterType;
  });

  const handleExportCSV = () => {
    showToast('Export Ready', 'September financial ledger exported as CSV report', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Accountant Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                Financial Accounts & Invoicing Center
              </span>
              <span className="text-xs text-emerald-200">
                {currentProperty.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Plus_Jakarta_Sans',sans-serif]">
              Finance Ledger & Collections
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200">
              Fee Invoicing · Offline Cash Collection · Tax Receipts · Operational Expense Audit
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenRecordPayment}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Offline Fee</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Overview KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Fees Collected
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{stats.feesCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            90.3% of monthly cycle
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Fees Pending
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ₹{stats.feesPending.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-0.5">
            {pendingPayments.length} student dues
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Overdue Arrears
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            ₹32,000
          </div>
          <div className="text-xs text-rose-700 font-semibold mt-0.5">
            {overduePayments.length} past grace period
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Operational Expenses
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Salaries, electricity, groceries
          </div>
        </div>
      </div>

      {/* Ledger Table with Filter Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Fee Collections & Payment Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited transactions for {currentProperty.name}
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['all', 'pending', 'overdue', 'paid'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filterType === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Receipt / ID</th>
                <th className="pb-3">Resident</th>
                <th className="pb-3">Room & Bed</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Cycle</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedPayments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-slate-800">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {p.studentName}
                  </td>
                  <td className="py-3.5 text-slate-600">
                    Room {p.roomNumber} ({p.bedCode})
                  </td>
                  <td className="py-3.5 font-black text-slate-900">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 text-slate-600">
                    {p.monthFor}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => onViewReceipt(p.id)}
                      className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-50 rounded-lg font-bold transition-all"
                    >
                      View Receipt
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
