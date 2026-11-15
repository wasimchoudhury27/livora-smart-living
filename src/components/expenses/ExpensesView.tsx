import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Expense, ExpenseCategory } from '../../types';
import { ReceiptText, Plus, TrendingDown, DollarSign, Calendar, Filter, Download } from 'lucide-react';
import { Modal } from '../common/Modal';

export const ExpensesView: React.FC = () => {
  const { expenses, currentProperty, addExpense, stats, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Groceries');
  const [amount, setAmount] = useState<number>(5000);
  const [vendor, setVendor] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const propertyExpenses = expenses.filter(e => e.propertyId === currentProperty.id);

  const filteredExpenses = propertyExpenses.filter(e => {
    return categoryFilter === 'all' || e.category === categoryFilter;
  });

  const totalExpenseAmount = propertyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = stats.feesCollected - totalExpenseAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) return;

    addExpense({
      propertyId: currentProperty.id,
      title,
      category,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      paidTo: vendor || 'Vendor / Utility Dept',
      paymentMethod: 'Bank Transfer',
    });

    setIsModalOpen(false);
    setTitle('');
    setVendor('');
    showToast('Expense Logged', `₹${amount} recorded for ${category}`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-rose-600 font-bold">Cost & Overhead Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Operating Expenses & Profitability
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Electricity bills, water tankers, kitchen groceries, repairs, and staff payroll.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Operating Income</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
            ₹{stats.feesCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">Rent fees collected from active residents</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Operating Outflow</span>
          <div className="text-2xl font-black text-rose-600 mt-1 font-mono">
            ₹{stats.totalOperatingExpenses.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
            <span>Direct: ₹{(stats.totalOperatingExpenses - stats.totalPayrollExpense).toLocaleString('en-IN')}</span>
            <span>•</span>
            <span className="font-semibold text-indigo-700">Payroll: ₹{stats.totalPayrollExpense.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Operating Surplus (Net)</span>
          <div className="text-2xl font-black text-indigo-900 mt-1 font-mono">
            ₹{stats.operatingSurplus.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-indigo-700 font-semibold mt-1">
            {stats.operatingSurplus >= 0 ? '✓ Healthy positive monthly margin' : '⚠️ Cash flow deficit'}
          </span>
        </div>
      </div>

      {/* Formula Explainer */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div>
          <strong className="text-slate-800">LIVORA Surplus Formula:</strong>{' '}
          <code className="text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
            Operating Surplus = Rent Fees Collected (₹{stats.feesCollected.toLocaleString('en-IN')}) − [Direct Expenses (₹{(stats.totalOperatingExpenses - stats.totalPayrollExpense).toLocaleString('en-IN')}) + Staff Payroll (₹{stats.totalPayrollExpense.toLocaleString('en-IN')})]
          </code>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Expenses' },
            { id: 'Electricity', label: '⚡ Electricity' },
            { id: 'Water', label: '💧 Water' },
            { id: 'Groceries', label: '🛒 Kitchen' },
            { id: 'Salaries', label: '👥 Salaries' },
            { id: 'Maintenance', label: '🔧 Maintenance' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                categoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Expense Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Vendor / Payee</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{exp.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{exp.paidTo}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{exp.date}</td>
                  <td className="py-3 px-4 text-slate-600">{exp.paymentMethod}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Operating Expense"
        subtitle={`Log expense entry for ${currentProperty.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. BESCOM Electricity Commercial Bill - Sept"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold"
              >
                <option value="Electricity">Electricity</option>
                <option value="Water">Water Tankers</option>
                <option value="Groceries">Kitchen / Food Groceries</option>
                <option value="Salaries">Staff Payroll</option>
                <option value="Maintenance">Repairs & Hardware</option>
                <option value="Internet">Internet / Wi-Fi</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Paid To / Vendor</label>
            <input
              type="text"
              placeholder="e.g. Kaveri Water Supplies / Metro Cash & Carry"
              value={vendor}
              onChange={e => setVendor(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
