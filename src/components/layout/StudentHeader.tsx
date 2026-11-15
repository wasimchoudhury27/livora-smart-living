import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Home, 
  LogOut, 
  Sparkles, 
  Wrench, 
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentHeaderProps {
  onOpenCreateComplaint: () => void;
  onOpenNotifications: () => void;
  onNavigate: (view: string) => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  onOpenCreateComplaint,
  onOpenNotifications,
  onNavigate,
}) => {
  const { currentStudent, currentProperty, payments, notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const studentPayments = payments.filter(p => p.studentId === currentStudent?.id);
  const latestPayment = studentPayments[0];
  const isPaid = latestPayment?.status === 'paid';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left Brand & Resident Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-lg">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base font-['Plus_Jakarta_Sans',sans-serif]">
                  StaySphere
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Resident Portal
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span className="truncate">{currentProperty.name}</span>
                <span className="text-slate-300">·</span>
                <strong className="text-slate-700 font-semibold">Room 401 (Bed A)</strong>
              </div>
            </div>
          </div>

          {/* Center: Resident Stay Status Pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs">
            <span className="text-slate-500 font-medium">Monthly Fee:</span>
            <strong className="text-slate-900 font-bold">₹8,000/mo</strong>
            <span className="text-slate-300">·</span>
            {isPaid ? (
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paid for September</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Due on 5th Oct</span>
              </span>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* 1-Tap Raise Complaint */}
            <button
              onClick={onOpenCreateComplaint}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-indigo-200"
            >
              <Wrench className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Raise Issue</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Profile Avatar */}
            <div 
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-all"
            >
              <img
                src={currentStudent?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt="Rahul Sharma"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentStudent?.name || 'Rahul Sharma'}
                </div>
                <div className="text-[10px] text-slate-500">
                  MCA · Final Year
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
