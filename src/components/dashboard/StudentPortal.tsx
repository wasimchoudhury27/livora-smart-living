import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  CreditCard, 
  UtensilsCrossed, 
  Wrench, 
  Droplets, 
  Wifi, 
  Receipt, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Star,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PaymentStatusBadge, ComplaintStatusBadge } from '../common/StatusBadge';

interface StudentPortalProps {
  onOpenCreateComplaint: () => void;
  onViewReceipt: (paymentId: string) => void;
  onNavigate: (view: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onOpenCreateComplaint,
  onViewReceipt,
  onNavigate,
}) => {
  const { currentStudent, currentProperty, payments, complaints, foodMenus, addServiceRequest, showToast } = useApp();

  const [ratedMeal, setRatedMeal] = useState(false);

  // Student payments
  const studentPayments = payments.filter(p => p.studentId === currentStudent?.id);
  const latestPayment = studentPayments[0];

  // Student complaints
  const studentComplaints = complaints.filter(c => c.studentId === currentStudent?.id);

  // Today's menu
  const todayMenu = foodMenus[0];

  const handleQuickRequest = (type: any, title: string) => {
    if (!currentStudent) return;
    addServiceRequest({
      propertyId: currentProperty.id,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      roomNumber: currentStudent.roomId.replace('rm-', ''),
      type,
      notes: title,
    });
  };

  const handlePayUPI = () => {
    showToast('UPI Intent Launched', 'Redirecting to UPI payment app for ₹8,000...', 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold inline-block mb-2">
              {currentProperty.name} • {currentProperty.city}
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-['Plus_Jakarta_Sans',sans-serif]">
              Welcome back, {currentStudent?.name || 'Resident'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">
              Allocated Room: <strong className="text-white">Room {currentStudent?.roomId.replace('rm-', '') || '102'} ({currentStudent?.bedId.split('-').pop()?.toUpperCase() || 'BED A'})</strong> • Double Sharing
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePayUPI}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Rent Online</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Service Dispatch Buttons */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1-Tap Resident Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleQuickRequest('Water', 'RO drinking water can 20L refill requested for room')}
                className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100 text-left transition-colors flex flex-col justify-between"
              >
                <Droplets className="w-5 h-5 text-blue-600 mb-2" />
                <div>
                  <div className="text-xs font-bold text-slate-900">RO Water</div>
                  <div className="text-[10px] text-slate-500">Refill 20L Can</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickRequest('Cleaning', 'Room cleaning and floor mop requested')}
                className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/50 hover:bg-teal-100 text-left transition-colors flex flex-col justify-between"
              >
                <Sparkles className="w-5 h-5 text-teal-600 mb-2" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Room Clean</div>
                  <div className="text-[10px] text-slate-500">Floor & dust</div>
                </div>
              </button>

              <button
                onClick={onOpenCreateComplaint}
                className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100 text-left transition-colors flex flex-col justify-between"
              >
                <Wrench className="w-5 h-5 text-amber-600 mb-2" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Maintenance</div>
                  <div className="text-[10px] text-slate-500">Report issue</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickRequest('Laundry', 'Bed linen and towel wash requested')}
                className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100 text-left transition-colors flex flex-col justify-between"
              >
                <Layers className="w-5 h-5 text-purple-600 mb-2" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Laundry</div>
                  <div className="text-[10px] text-slate-500">Bedsheets</div>
                </div>
              </button>
            </div>
          </div>

          {/* Today's Dining Menu Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Today's Mess Menu</h3>
                  <span className="text-[11px] text-slate-500">Included with accommodation</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('food')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Full Week Menu →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Breakfast</span>
                <div className="font-semibold text-slate-800 mt-1">Idli, Sambar & Vada</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Filter Coffee & Tea</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lunch</span>
                <div className="font-semibold text-slate-800 mt-1">Rajma Chawal, Roti & Curd</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Green Salad & Papad</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dinner</span>
                <div className="font-semibold text-slate-800 mt-1">Paneer Butter Masala / Chicken Curry</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Phulka & Gulab Jamun</div>
              </div>
            </div>

            {/* Rate Meal */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">How was today's meal?</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => {
                      setRatedMeal(true);
                      showToast('Rating Submitted', 'Thank you for rating today’s food quality!', 'success');
                    }}
                    className={`p-1 hover:scale-110 transition-transform ${ratedMeal ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Complaints */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">My Maintenance Tickets ({studentComplaints.length})</h3>
              <button
                onClick={onOpenCreateComplaint}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                + New Ticket
              </button>
            </div>

            {studentComplaints.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No open complaints. Everything in your room is functioning smoothly!
              </div>
            ) : (
              <div className="space-y-2.5">
                {studentComplaints.map(c => (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-slate-500">Ticket #{c.ticketNumber} • {c.createdAt}</div>
                    </div>
                    <ComplaintStatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ledger, Receipts & Wi-Fi */}
        <div className="space-y-6">
          {/* Rent & Ledger Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Account</h3>
              <PaymentStatusBadge status={currentStudent?.paymentStatus || 'paid'} />
            </div>

            <div>
              <span className="text-xs text-slate-500">Monthly Rent:</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                ₹{currentStudent?.monthlyFee.toLocaleString('en-IN') || '8,000'}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Due on {currentStudent?.dueDay || 5}th of every month
              </div>
            </div>

            {latestPayment && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">Latest Receipt</div>
                  <div className="text-[10px] text-slate-400">#{latestPayment.receiptNumber}</div>
                </div>
                <button
                  onClick={() => onViewReceipt(latestPayment.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
              </div>
            )}
          </div>

          {/* Wi-Fi & Hostel Access Details */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                Resident Wi-Fi & Facilities
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">SSID:</span>
                <span className="font-mono font-bold text-white">LIVORA-HighSpeed-5G</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Password:</span>
                <span className="font-mono text-indigo-300 font-bold">SphereResident2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Warden Desk:</span>
                <span className="font-mono text-emerald-400 font-bold">+91 98450 11223</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Curfew Timing:</span>
                <span className="text-amber-300 font-bold">10:30 PM (Biometric Close)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
