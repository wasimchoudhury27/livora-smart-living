import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DoorClosed, 
  CreditCard, 
  Wrench, 
  UtensilsCrossed, 
  Megaphone, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface StudentHomeViewProps {
  onOpenCreateComplaint: () => void;
  onNavigate: (view: string) => void;
  onPayNow: () => void;
  onViewReceipt?: (paymentId: string) => void;
}

export const StudentHomeView: React.FC<StudentHomeViewProps> = ({
  onOpenCreateComplaint,
  onNavigate,
  onPayNow,
  onViewReceipt,
}) => {
  const { 
    currentStudent, 
    activeStudent, 
    currentProperty, 
    payments, 
    complaints, 
    weeklyMenu,
    announcements 
  } = useApp();

  const resident = currentStudent || activeStudent;
  const residentName = resident?.name || 'Resident';

  // 1. Fee status & Next due calculation
  const residentPayments = payments.filter(p => p.studentId === resident?.id);
  const pendingPayment = residentPayments.find(p => p.status === 'pending' || p.status === 'overdue');
  const isDuesCleared = !pendingPayment;
  const nextDueDate = pendingPayment ? pendingPayment.dueDate : '5th of next month';
  const rentAmount = resident?.monthlyFee || 8000;

  // 2. Pending complaints or service requests
  const activeComplaints = complaints.filter(
    c => c.studentId === resident?.id && c.status !== 'Completed' && c.status !== 'Closed' && c.status !== 'Verified'
  );
  const latestComplaint = activeComplaints[0];

  // 3. Today's mess information
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayMenu = weeklyMenu.find(m => m.day.toLowerCase() === todayDayName) || weeklyMenu[0];

  const currentHour = new Date().getHours();
  let currentMealName = 'Dinner';
  let currentMealTime = '08:00 PM - 10:00 PM';
  let currentMealItems = todayMenu?.dinner?.items || ['Paneer Butter Masala', 'Tawa Roti', 'Dal Tadka', 'Jeera Rice', 'Gulab Jamun'];

  if (currentHour < 11) {
    currentMealName = 'Breakfast';
    currentMealTime = '07:30 AM - 09:30 AM';
    currentMealItems = todayMenu?.breakfast?.items || ['Masala Dosa', 'Sambar', 'Coconut Chutney', 'Tea / Coffee'];
  } else if (currentHour < 16) {
    currentMealName = 'Lunch';
    currentMealTime = '12:30 PM - 02:30 PM';
    currentMealItems = todayMenu?.lunch?.items || ['Paneer Makhani', 'Steamed Rice', 'Dal Fry', 'Phulka', 'Salad'];
  } else if (currentHour < 19) {
    currentMealName = 'Evening Snacks';
    currentMealTime = '05:00 PM - 06:30 PM';
    currentMealItems = todayMenu?.snacks?.items || ['Veg Cutlet', 'Mint Chutney', 'Masala Chai'];
  }

  // 4. Important announcements
  const importantAnnouncements = announcements.slice(0, 2);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Clean Welcome & Two Primary Quick Actions */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/80">
              {currentProperty.name}
            </span>
            <span className="text-xs font-medium text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              Active Resident
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Welcome back, {residentName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600">
            Room 401 · Bed A · Double Sharing · All essential updates at a glance
          </p>
        </div>

        {/* The Two Prominent Quick Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onPayNow}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-98"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Fees</span>
          </button>

          <button
            onClick={onOpenCreateComplaint}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-98"
          >
            <Wrench className="w-4 h-4 text-slate-600" />
            <span>Raise Complaint</span>
          </button>
        </div>
      </div>

      {/* 2. Core Operational Status Cards (3 Clean Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Room & Bed Allocation */}
        <div 
          onClick={() => onNavigate('my-room')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Accommodation
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <DoorClosed className="w-4 h-4" />
              </div>
            </div>

            <div className="text-xl font-bold text-slate-900">
              Room 401 · Bed A
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Floor 4, Building A · Double Sharing (AC)
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span className="text-slate-400">Roommate:</span>
              <span className="font-semibold text-slate-800">Aman Khan (Bed B)</span>
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center gap-1 text-xs font-semibold text-teal-700 group-hover:text-teal-800">
            <span>View room & inventory details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Fee Payment Status */}
        <div 
          onClick={() => onNavigate('payments')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rent & Dues
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-slate-900">
                ₹{rentAmount.toLocaleString('en-IN')}
              </div>
              {isDuesCleared ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Paid
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pending
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Monthly accommodation fee
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span className="text-slate-400">Next Due Date:</span>
              <span className="font-semibold text-slate-800">{nextDueDate}</span>
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
            <span>Payment history & receipts</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Complaints & Requests */}
        <div 
          onClick={() => onNavigate('complaints')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Maintenance
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Wrench className="w-4 h-4" />
              </div>
            </div>

            <div className="text-xl font-bold text-slate-900">
              {activeComplaints.length === 0 ? (
                <span className="text-slate-800">No Open Tickets</span>
              ) : (
                <span>{activeComplaints.length} Active Ticket{activeComplaints.length > 1 ? 's' : ''}</span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1 truncate">
              {latestComplaint 
                ? `${latestComplaint.category}: ${latestComplaint.title || latestComplaint.description}`
                : 'All room facilities verified operational'}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
              <span className="text-slate-400">Status:</span>
              <span className={`font-semibold ${latestComplaint ? 'text-amber-600' : 'text-emerald-600'}`}>
                {latestComplaint ? latestComplaint.status : 'Operational'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2 flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:text-amber-800">
            <span>Track service requests</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. Secondary Informational Grid: Today's Mess & Important Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Mess Schedule Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Mess Schedule</h3>
                <p className="text-xs text-slate-400 capitalize">{todayDayName} Dining Timetable</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('food')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Weekly Menu</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Current / Upcoming Meal Highlight */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-xs font-bold text-slate-900">
                  {currentMealName}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {currentMealTime}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {Array.isArray(currentMealItems) ? currentMealItems.join(' • ') : currentMealItems}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Hygiene & Temperature Certified
            </span>
            <button
              onClick={() => onNavigate('food')}
              className="text-teal-700 hover:underline font-semibold"
            >
              Rate Today's Meal
            </button>
          </div>
        </div>

        {/* Important Announcements Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Official Notices</h3>
                <p className="text-xs text-slate-400">Campus & Warden Circulars</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {importantAnnouncements.map((notice) => (
              <div 
                key={notice.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {notice.title}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">
                    {notice.createdAt}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Helpdesk Warden: {currentProperty.managerName}</span>
            <span className="font-mono text-slate-700 font-semibold">{currentProperty.managerPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
