import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, DollarSign, PieChart, Star, CheckCircle2, Clock } from 'lucide-react';

export const ChartsSection: React.FC = () => {
  const { stats, currentProperty, complaints, foodRatings } = useApp();

  // Occupancy trend data
  const occupancyMonths = [
    { month: 'Apr', rate: 78.5 },
    { month: 'May', rate: 82.0 },
    { month: 'Jun', rate: 86.4 },
    { month: 'Jul', rate: 89.0 },
    { month: 'Aug', rate: 89.8 },
    { month: 'Sep', rate: stats.occupancyRate },
  ];

  // Financial comparative data (in Lakhs INR)
  const financialData = [
    { month: 'May', rev: 4.8, exp: 2.8 },
    { month: 'Jun', rev: 5.1, exp: 2.9 },
    { month: 'Jul', rev: 5.3, exp: 3.1 },
    { month: 'Aug', rev: 5.2, exp: 3.0 },
    { month: 'Sep', rev: 5.4, exp: 3.1 },
  ];

  // Complaint statuses
  const pendingCount = complaints.filter(c => c.status === 'Submitted' || c.status === 'Pending Review').length;
  const assignedCount = complaints.filter(c => c.status === 'Assigned').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const completedCount = complaints.filter(c => c.status === 'Completed' || c.status === 'Verified' || c.status === 'Closed').length;
  const totalComplaintsCount = complaints.length || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Occupancy Trend */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">Occupancy Trend</h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                +12.1% H1
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Average bed occupancy across {currentProperty.name}</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-slate-900">{stats.occupancyRate}%</span>
            <div className="text-[10px] text-slate-400">Current Occupancy</div>
          </div>
        </div>

        {/* SVG Area Chart */}
        <div className="h-44 w-full flex flex-col justify-end">
          <svg viewBox="0 0 500 160" className="w-full h-36 overflow-visible">
            <defs>
              <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />

            {/* Area */}
            <path
              d="M 20 120 L 100 105 L 180 85 L 260 60 L 340 50 L 460 35 L 460 150 L 20 150 Z"
              fill="url(#occupancyGradient)"
            />

            {/* Line */}
            <path
              d="M 20 120 L 100 105 L 180 85 L 260 60 L 340 50 L 460 35"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {[
              { cx: 20, cy: 120, label: '78.5%' },
              { cx: 100, cy: 105, label: '82%' },
              { cx: 180, cy: 85, label: '86.4%' },
              { cx: 260, cy: 60, label: '89%' },
              { cx: 340, cy: 50, label: '89.8%' },
              { cx: 460, cy: 35, label: `${stats.occupancyRate}%` },
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.cx} cy={pt.cy} r="5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                <circle cx={pt.cx} cy={pt.cy} r="2" fill="#4f46e5" />
              </g>
            ))}
          </svg>

          {/* Month labels */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mt-2 px-2">
            {occupancyMonths.map(m => (
              <span key={m.month}>{m.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 2: Revenue vs Expenses */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Revenue vs Operating Expenses</h4>
            <p className="text-xs text-slate-500 mt-0.5">Monthly cash flow in Lakhs (₹)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" /> Expenses
            </span>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
          {financialData.map(item => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-1.5 h-32">
                {/* Revenue bar */}
                <div
                  className="w-1/2 max-w-[24px] bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-md transition-all hover:opacity-90 relative group"
                  style={{ height: `${(item.rev / 6.0) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    ₹{item.rev}L
                  </div>
                </div>

                {/* Expense bar */}
                <div
                  className="w-1/2 max-w-[24px] bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-md transition-all hover:opacity-90 relative group"
                  style={{ height: `${(item.exp / 6.0) * 100}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    ₹{item.exp}L
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 3: Monthly Payment Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Payment Collection Funnel</h4>
            <p className="text-xs text-slate-500 mt-0.5">September 2026 Cycle</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            90.3% Realized
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Collected */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Collected
              </span>
              <span className="text-slate-900">₹{stats.feesCollected.toLocaleString('en-IN')} (90.3%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90.3%' }} />
            </div>
          </div>

          {/* Pending */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending (Grace Period)
              </span>
              <span className="text-slate-900">₹40,000 (6.9%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '6.9%' }} />
            </div>
          </div>

          {/* Overdue */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Overdue
              </span>
              <span className="text-slate-900">₹16,000 (2.8%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '2.8%' }} />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Target collection: ₹5,76,000</span>
          <span className="font-semibold text-indigo-600">7 Overdue reminders dispatched</span>
        </div>
      </div>

      {/* Chart 4: Complaint Resolution & Food Satisfaction */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Operational Health & Dining</h4>
              <p className="text-xs text-slate-500 mt-0.5">Tickets & Resident Satisfaction</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Live KPI
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Maintenance tickets summary */}
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Maintenance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900">{stats.openComplaints}</span>
                <span className="text-xs text-rose-600 font-semibold">Active</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex flex-col gap-0.5">
                <span>• In Progress: {inProgressCount}</span>
                <span>• Assigned: {assignedCount}</span>
                <span>• Review: {pendingCount}</span>
              </div>
            </div>

            {/* Food rating summary */}
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dining Score</span>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900">{stats.averageFoodRating}</span>
                <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex flex-col gap-0.5">
                <span>• Taste: 4.2 ★</span>
                <span>• Hygiene: 4.0 ★</span>
                <span className="text-amber-600 font-medium">• Quantity: 3.1 ★</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 92% SLA Adherence
          </span>
          <span>Avg resolution: 4.2 hrs</span>
        </div>
      </div>
    </div>
  );
};
