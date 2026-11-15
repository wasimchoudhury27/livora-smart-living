import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { AIInsightsCard } from './AIInsightsCard';
import { ChartsSection } from './ChartsSection';
import { 
  Building2, 
  Layers, 
  Users, 
  Bed, 
  Percent, 
  CreditCard, 
  Clock, 
  Wrench, 
  UserPlus, 
  PlusCircle, 
  Megaphone, 
  ReceiptText, 
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Droplets,
  UtensilsCrossed,
  DollarSign,
  ArrowRight,
  Calendar,
  ShieldAlert,
  Star,
  Info,
  Zap
} from 'lucide-react';
import { PaymentStatusBadge, ComplaintStatusBadge } from '../common/StatusBadge';
import { ActiveTab } from '../layout/Sidebar';
import { Room } from '../../types';

interface OwnerDashboardProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onNavigate?: (tab: string) => void;
  onOpenAddStudent?: () => void;
  onOpenAddProperty?: () => void;
  onOpenRecordPayment?: () => void;
  onOpenCreateComplaint?: () => void;
  onOpenCreateAnnouncement?: () => void;
  onOpenAIWeekly?: () => void;
  onOpenWeeklyReport?: () => void;
  onSelectStudent?: (studentId: string) => void;
  onSelectComplaint?: (complaintId: string) => void;
  onOpenRoomDetail?: (room: Room) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  setActiveTab,
  onNavigate,
  onOpenAddStudent = () => {},
  onOpenAddProperty = () => {},
  onOpenRecordPayment = () => {},
  onOpenCreateComplaint = () => {},
  onOpenCreateAnnouncement = () => {},
  onOpenAIWeekly,
  onOpenWeeklyReport,
  onSelectStudent = () => {},
  onSelectComplaint = () => {},
  onOpenRoomDetail = () => {},
}) => {
  const { 
    currentProperty, 
    stats, 
    payments, 
    complaints, 
    students, 
    expenses, 
    foodMenus, 
    properties,
    healthScore,
    recurringProblems
  } = useApp();

  const [activeCommandTab, setActiveCommandTab] = useState<'property' | 'finance' | 'operations' | 'students' | 'food' | 'energy'>('property');

  const navigateTo = (tab: string) => {
    if (onNavigate) onNavigate(tab);
    if (setActiveTab) setActiveTab(tab as ActiveTab);
  };

  const handleWeeklyOpen = () => {
    if (onOpenWeeklyReport) onOpenWeeklyReport();
    else if (onOpenAIWeekly) onOpenAIWeekly();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netRevenue = stats.feesCollected - totalExpenses;
  const highPriorityComplaints = complaints.filter(c => c.priority === 'high' && c.status !== 'Completed' && c.status !== 'Closed');
  const feePendingStudents = students.filter(s => s.paymentStatus === 'pending' || s.paymentStatus === 'overdue');

  return (
    <div className="space-y-7 pb-12">
      {/* Top Welcome Section & Property Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.city}</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">{currentProperty.type} Management</span>
            <span>•</span>
            <span>{currentDate}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Operations Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time control center for <span className="font-semibold text-slate-900">{currentProperty.name}</span>.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-2 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-98"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Resident</span>
          </button>

          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={onOpenCreateComplaint}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            <span>New Ticket</span>
          </button>

          <button
            onClick={onOpenCreateAnnouncement}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Megaphone className="w-3.5 h-3.5 text-slate-500" />
            <span>Announce</span>
          </button>
        </div>
      </div>

      {/* Prominent AI Proactive Alerts Banner */}
      <div className="rounded-2xl p-6 bg-slate-900 text-white shadow-md border border-slate-800 relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  LIVORA Intelligence
                </span>
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                  Daily Briefing
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white mt-0.5">
                Key operational highlights for today
              </h2>
            </div>
          </div>

          <button
            onClick={() => navigateTo('ai-copilot')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Spotlight Attention Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Item 1: Fees Pending */}
          <div 
            onClick={() => navigateTo('payments')}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-amber-300 text-xs font-bold mb-1">
              <span>1. Pending Dues</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white">
              ₹56,000 Pending
            </div>
            <div className="text-xs text-amber-200/80 mt-1 leading-snug">
              7 students crossed grace period. Rohan Verma (Room 101) overdue.
            </div>
          </div>

          {/* Item 2: High Priority Issues */}
          <div 
            onClick={() => navigateTo('complaints')}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-400/30 hover:bg-rose-500/20 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-rose-300 text-xs font-bold mb-1">
              <span>2. Urgent Tickets</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-black text-white">
              3 High-Priority Issues
            </div>
            <div className="text-xs text-rose-200/80 mt-1 leading-snug">
              Room 401 electrical spark, Room 202 pipe leakage, Wi-Fi latency.
            </div>
          </div>

          {/* Item 3: Room 401 Repeated Complaints */}
          <div 
            onClick={() => navigateTo('complaints')}
            className="p-4 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 hover:bg-indigo-500/25 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-indigo-300 text-xs font-bold mb-1">
              <span>3. Recurring Fault</span>
              <Wrench className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">
              Room 401 Repeated Fan
            </div>
            <div className="text-xs text-indigo-200/80 mt-1 leading-snug">
              3 fan complaints in 60 days. Suggest replacing capacitor & branch check.
            </div>
          </div>

          {/* Item 4: Food Rating Drop */}
          <div 
            onClick={() => navigateTo('food')}
            className="p-4 rounded-2xl bg-purple-500/15 border border-purple-400/30 hover:bg-purple-500/25 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-purple-300 text-xs font-bold mb-1">
              <span>4. Mess Sentiment</span>
              <UtensilsCrossed className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-black text-white">
              Quantity Rating 3.1
            </div>
            <div className="text-xs text-purple-200/80 mt-1 leading-snug">
              Dinner portions ran out early on 2 nights. Chef Rajesh notified.
            </div>
          </div>
        </div>
      </div>

      {/* Property Health Score & 5-Pillar Operational Performance */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              {healthScore.overallScore}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Operational Diagnostic
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Tier-1 Rating
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                LIVORA Property Health Score: {healthScore.overallScore}/100
              </h2>
            </div>
          </div>

          <button
            onClick={() => navigateTo('city-ranking')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors self-start sm:self-auto"
          >
            <span>Inspect City Ranking & Reviews</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5-Pillars Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Occupancy</span>
              <span className="font-bold text-slate-900">{healthScore.occupancyScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${healthScore.occupancyScore}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Maintenance TAT</span>
              <span className="font-bold text-slate-900">{healthScore.maintenanceScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${healthScore.maintenanceScore}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Dining Satisfaction</span>
              <span className="font-bold text-slate-900">{healthScore.foodScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${healthScore.foodScore}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Fee Efficiency</span>
              <span className="font-bold text-slate-900">{healthScore.collectionScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: `${healthScore.collectionScore}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Staff Attendance</span>
              <span className="font-bold text-slate-900">{healthScore.staffPerformanceScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${healthScore.staffPerformanceScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 5 Tabbed Command Center Modules (Section 1) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Executive Health & Pulse
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Command Center Overview
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full">
            {[
              { id: 'property', label: 'Property & Spatial' },
              { id: 'finance', label: 'Financial Overview' },
              { id: 'operations', label: 'Operations & Staff' },
              { id: 'students', label: 'Students Overview' },
              { id: 'food', label: 'Food & Mess' },
              { id: 'energy', label: 'Energy & Smart Grid' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCommandTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  activeCommandTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Property Overview */}
        {activeCommandTab === 'property' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Properties</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{properties.length || 3}</div>
              <div className="text-[10px] text-slate-500">Across Bengaluru</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Buildings</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{currentProperty.buildings.length || 4}</div>
              <div className="text-[10px] text-slate-500">Block A, B, C...</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Floors</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">8</div>
              <div className="text-[10px] text-slate-500">Elevator equipped</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Rooms</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{stats.totalRooms}</div>
              <div className="text-[10px] text-slate-500">Single & Double</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Beds</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{stats.totalBeds}</div>
              <div className="text-[10px] text-slate-500">Full capacity</div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-800 font-bold uppercase">Occupied Beds</span>
              <div className="text-xl font-black text-emerald-900 mt-0.5">{stats.occupiedBeds}</div>
              <div className="text-[10px] text-emerald-700">Active tenants</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Available Beds</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{stats.availableBeds}</div>
              <div className="text-[10px] text-slate-500">Ready check-in</div>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
              <span className="text-[10px] text-indigo-800 font-bold uppercase">Occupancy %</span>
              <div className="text-xl font-black text-indigo-900 mt-0.5">{stats.occupancyRate}%</div>
              <div className="text-[10px] text-indigo-700">+1.4% MoM</div>
            </div>
          </div>
        )}

        {/* Tab 2: Financial Overview */}
        {activeCommandTab === 'finance' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">Today's Collection</span>
              <div className="text-xl font-black text-slate-900 mt-1">₹24,000</div>
              <div className="text-[11px] text-slate-500">3 UPI transfers</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-emerald-800 font-bold">Monthly Collection</span>
              <div className="text-xl font-black text-emerald-900 mt-1">₹{stats.feesCollected.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-700">90.3% cycle collected</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xs text-amber-800 font-bold">Pending Fees</span>
              <div className="text-xl font-black text-amber-900 mt-1">₹{stats.feesPending.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-amber-700">7 students pending</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-xs text-rose-800 font-bold">Overdue Fees</span>
              <div className="text-xl font-black text-rose-900 mt-1">₹32,000</div>
              <div className="text-[11px] text-rose-700">Past grace period</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">Operational Expenses</span>
              <div className="text-xl font-black text-slate-900 mt-1">₹{totalExpenses.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-500">Food, electricity, staff</div>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="text-xs text-indigo-800 font-bold">Net Revenue</span>
              <div className="text-xl font-black text-indigo-900 mt-1">₹{netRevenue.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-indigo-700">Healthy profit margin</div>
            </div>
          </div>
        )}

        {/* Tab 3: Operations Overview */}
        {activeCommandTab === 'operations' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">Open Complaints</span>
              <div className="text-xl font-black text-slate-900 mt-1">{stats.openComplaints}</div>
              <div className="text-[11px] text-slate-500">Under resolution</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-xs text-rose-800 font-bold">High Priority Issues</span>
              <div className="text-xl font-black text-rose-900 mt-1">{highPriorityComplaints.length}</div>
              <div className="text-[11px] text-rose-700">Strict SLA &lt; 24h</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xs text-amber-800 font-bold">Pending Maintenance</span>
              <div className="text-xl font-black text-amber-900 mt-1">5 Work Orders</div>
              <div className="text-[11px] text-amber-700">Parts ordered</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">Staff Tasks</span>
              <div className="text-xl font-black text-slate-900 mt-1">12 Dispatched</div>
              <div className="text-[11px] text-slate-500">Imran, Ramesh, Sunita</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-emerald-800 font-bold">Cleaning Status</span>
              <div className="text-xl font-black text-emerald-900 mt-1">18/20 Complete</div>
              <div className="text-[11px] text-emerald-700">Floors 1-4 sanitized</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-xs text-blue-800 font-bold">Water Issues</span>
              <div className="text-xl font-black text-blue-900 mt-1">1 Active</div>
              <div className="text-[11px] text-blue-700">Floor 3 dispenser check</div>
            </div>
          </div>
        )}

        {/* Tab 4: Student Overview */}
        {activeCommandTab === 'students' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">Total Students</span>
              <div className="text-xl font-black text-slate-900 mt-1">{students.length} Active</div>
              <div className="text-[11px] text-slate-500">Verified KYC on file</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs text-emerald-800 font-bold">New Admissions</span>
              <div className="text-xl font-black text-emerald-900 mt-1">8 This Month</div>
              <div className="text-[11px] text-emerald-700">All security deposits cleared</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold">Students Leaving</span>
              <div className="text-xl font-black text-slate-900 mt-1">2 on Notice</div>
              <div className="text-[11px] text-slate-500">Inspection & settlement scheduled</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xs text-amber-800 font-bold">Fee Pending Students</span>
              <div className="text-xl font-black text-amber-900 mt-1">{feePendingStudents.length} Students</div>
              <div className="text-[11px] text-amber-700">Automated reminders queued</div>
            </div>
          </div>
        )}

        {/* Tab 5: Food Overview */}
        {activeCommandTab === 'food' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-bold">Today's Menu (Thursday)</span>
              <div className="text-sm font-bold text-slate-900">Dinner: Butter Roti + Shahi Paneer</div>
              <div className="text-xs text-slate-600">Lunch: Steamed Rice + Chicken Curry + Dal</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-xs text-amber-800 font-bold">Food Quality Rating</span>
              <div className="text-xl font-black text-amber-900 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span>4.2 / 5.0</span>
              </div>
              <div className="text-xs text-amber-700">92 responses this week</div>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
              <span className="text-xs text-purple-800 font-bold">Recent Resident Feedback</span>
              <div className="text-xs font-semibold text-purple-950">"Biryani was excellent on Sunday"</div>
              <div className="text-xs text-purple-700">"Please increase dinner paneer portion"</div>
            </div>
          </div>
        )}

        {/* Tab 6: Energy & Smart Grid Overview */}
        {activeCommandTab === 'energy' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>Real-Time Draw</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">34.2 kW</div>
              <div className="text-[11px] text-slate-500">Telemetry across 4 floors & common areas</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-xs text-emerald-800 font-bold">Today's Consumption</span>
              <div className="text-2xl font-black text-emerald-950 font-mono">524 kWh</div>
              <div className="text-[11px] text-emerald-700 font-medium">-8.4% vs 7-day average</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-xs text-amber-800 font-bold">Identified Efficiency Potential</span>
              <div className="text-2xl font-black text-amber-950 font-mono">₹49,300/mo</div>
              <div className="text-[11px] text-amber-700 font-medium">4 active optimization opportunities</div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col justify-between">
              <div>
                <span className="text-xs text-indigo-800 font-bold">ToD Peak Shaving</span>
                <div className="text-xs text-indigo-950 font-medium mt-0.5">Peak tariff: 6:30 PM – 10:00 PM</div>
              </div>
              <button
                onClick={() => navigateTo('energy')}
                className="mt-2 w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>Open Energy Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visual Spatial Map Hierarchy (Prompt Section 15) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Visual Spatial Hierarchy Map — {currentProperty.name} (Building A)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any room to open real-time occupants, maintenance tickets, and bed allocations
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Full Occupied (🟢)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Issue / Attention (🔴)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Partial / Vacant (🟡)</span>
            </span>
          </div>
        </div>

        {/* Spatial Floor Matrix */}
        <div className="space-y-3 pt-2">
          {/* Floor 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Floor 4 (Executive Wing)</span>
              <span className="text-[11px] text-slate-400 font-normal">Double Sharing Balcony Rooms</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {/* Room 401 Spotlight */}
              <div
                onClick={() => {
                  const bldg = currentProperty.buildings[0];
                  const flr = bldg?.floors.find(f => f.name.includes('4') || f.rooms.some(r => r.roomNumber === '401'));
                  const rm = flr?.rooms.find(r => r.roomNumber === '401');
                  if (rm) onOpenRoomDetail(rm);
                }}
                className="p-3 rounded-xl border-2 border-rose-400 bg-rose-50/60 hover:bg-rose-100/60 transition-all cursor-pointer shadow-xs space-y-1 relative"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-rose-900">Room 401</strong>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div className="text-[11px] text-rose-800 font-bold truncate">
                  Rahul Sharma (Bed A)
                </div>
                <div className="text-[10px] text-rose-700 font-medium truncate">
                  ⚡ Fan Issue Logged
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 transition-all cursor-pointer space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-emerald-900">Room 402</strong>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-emerald-800 font-bold truncate">
                  2/2 Occupied
                </div>
                <div className="text-[10px] text-emerald-700">Healthy</div>
              </div>

              <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/60 transition-all cursor-pointer space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-amber-900">Room 403</strong>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
                <div className="text-[11px] text-amber-800 font-bold truncate">
                  1/2 Occupied (Bed B Vacant)
                </div>
                <div className="text-[10px] text-amber-700">Ready for Check-In</div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 transition-all cursor-pointer space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-emerald-900">Room 404</strong>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-emerald-800 font-bold truncate">
                  2/2 Occupied
                </div>
                <div className="text-[10px] text-emerald-700">Healthy</div>
              </div>
            </div>
          </div>

          {/* Floor 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Floor 1 (Ground Level)</span>
              <span className="text-[11px] text-slate-400 font-normal">Common Lounge & Double Sharing</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 transition-all cursor-pointer space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-emerald-900">Room 101</strong>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-emerald-800 font-bold truncate">
                  Priya & Rohan
                </div>
                <div className="text-[10px] text-emerald-700">Occupied</div>
              </div>

              <div className="p-3 rounded-xl border border-rose-300 bg-rose-50/60 transition-all cursor-pointer space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-rose-900">Room 102</strong>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                </div>
                <div className="text-[11px] text-rose-800 font-bold truncate">
                  2/2 Occupied
                </div>
                <div className="text-[10px] text-rose-700">Sink Leak Reported</div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/60 transition-all cursor-pointer space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-emerald-900">Room 103</strong>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-emerald-800 font-bold truncate">
                  Vikram Singh
                </div>
                <div className="text-[10px] text-emerald-700">Occupied</div>
              </div>

              <div className="p-3 rounded-xl border border-amber-300 bg-amber-50/60 transition-all cursor-pointer space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-amber-900">Room 104</strong>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
                <div className="text-[11px] text-amber-800 font-bold truncate">
                  1/2 Occupied
                </div>
                <div className="text-[10px] text-amber-700">Bed B Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Rooms */}
        <MetricCard
          title="Total Rooms"
          value={stats.totalRooms}
          subtitle={`${currentProperty.buildings.length} active buildings`}
          icon={Layers}
          colorTheme="indigo"
          onClick={() => navigateTo('rooms')}
        />

        {/* Total Beds */}
        <MetricCard
          title="Total Beds"
          value={stats.totalBeds}
          subtitle={`${stats.occupiedBeds} occupied`}
          icon={Bed}
          colorTheme="blue"
          onClick={() => navigateTo('rooms')}
        />

        {/* Occupied Beds */}
        <MetricCard
          title="Occupied Beds"
          value={stats.occupiedBeds}
          subtitle="Active residents"
          icon={Users}
          badge={{ text: 'High Demand', type: 'positive' }}
          colorTheme="emerald"
          onClick={() => navigateTo('students')}
        />

        {/* Available Beds */}
        <MetricCard
          title="Available Beds"
          value={stats.availableBeds}
          subtitle="Ready for check-in"
          icon={Bed}
          badge={{ text: `${stats.availableBeds} Vacant`, type: 'neutral' }}
          colorTheme="slate"
          onClick={() => navigateTo('rooms')}
        />

        {/* Occupancy Rate */}
        <MetricCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          subtitle="Target: 95%"
          icon={Percent}
          badge={{ text: '+1.4% MoM', type: 'positive' }}
          colorTheme="indigo"
          onClick={() => navigateTo('analytics')}
        />

        {/* Fees Collected */}
        <MetricCard
          title="Fees Collected"
          value={`₹${stats.feesCollected.toLocaleString('en-IN')}`}
          subtitle="September cycle"
          icon={CreditCard}
          badge={{ text: '90.3% Collected', type: 'positive' }}
          colorTheme="emerald"
          onClick={() => navigateTo('payments')}
        />

        {/* Fees Pending */}
        <MetricCard
          title="Fees Pending"
          value={`₹${stats.feesPending.toLocaleString('en-IN')}`}
          subtitle="7 students past grace"
          icon={Clock}
          badge={{ text: 'Action Needed', type: 'warning' }}
          colorTheme="amber"
          onClick={() => navigateTo('payments')}
        />

        {/* Open Complaints */}
        <MetricCard
          title="Open Complaints"
          value={stats.openComplaints}
          subtitle="3 high priority"
          icon={Wrench}
          badge={{ text: '3 Urgent', type: 'urgent' }}
          colorTheme="rose"
          onClick={() => navigateTo('complaints')}
        />
      </div>

      {/* AI Property Insights Hero Card */}
      <AIInsightsCard
        onOpenWeeklyDigest={handleWeeklyOpen}
        onOpenComplaints={() => navigateTo('complaints')}
        onOpenPayments={() => navigateTo('payments')}
        onOpenFood={() => navigateTo('food')}
      />

      {/* Charts Section */}
      <ChartsSection />

      {/* Bottom Grid: Recent Activity Feed & Maintenance Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payment Receipts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Recent Payment Collections</h4>
                <p className="text-xs text-slate-500 mt-0.5">Real-time ledger updates & receipts</p>
              </div>
              <button
                onClick={() => navigateTo('payments')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {payments.slice(0, 4).map(payment => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                      ₹
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{payment.studentName}</div>
                      <div className="text-[11px] text-slate-500">
                        Room {payment.roomNumber} ({payment.bedCode}) • {payment.paymentMethod}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Automated bank & UPI reconciliation active</span>
            <span className="font-mono text-[10px] text-slate-500">LIVORA Pay v2.4</span>
          </div>
        </div>

        {/* Open Maintenance Tickets Queue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Immediate Maintenance Action</h4>
                <p className="text-xs text-slate-500 mt-0.5">Tickets queued for staff dispatch</p>
              </div>
              <button
                onClick={() => navigateTo('complaints')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Kanban Board <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {complaints.slice(0, 4).map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => onSelectComplaint(ticket.id)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {ticket.category}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                        {ticket.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Room {ticket.roomNumber} • {ticket.studentName}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <ComplaintStatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Safety Check: Room 401 arcing priority
            </span>
            <span className="font-semibold text-indigo-600">Electrician Assigned</span>
          </div>
        </div>
      </div>
    </div>
  );
};
