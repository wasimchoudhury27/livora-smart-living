import React from 'react';
import { 
  Home, 
  DoorClosed, 
  CreditCard, 
  Wrench, 
  Droplets, 
  UtensilsCrossed, 
  Megaphone, 
  User, 
  Settings,
  PhoneCall,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StudentSidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  currentView,
  onSelectView,
}) => {
  const { currentProperty, currentStudent, activeStudent, complaints, payments } = useApp();
  const resident = currentStudent || activeStudent;

  const openComplaintsCount = complaints.filter(
    c => c.studentId === resident?.id && c.status !== 'Completed' && c.status !== 'Closed' && c.status !== 'Verified'
  ).length;

  const pendingPayments = payments.filter(
    p => p.studentId === resident?.id && (p.status === 'pending' || p.status === 'overdue')
  );

  const navCategories: NavCategory[] = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'My Dashboard', icon: Home },
        { id: 'public-discovery', label: 'Explore City Hostels', icon: Compass },
      ]
    },
    {
      title: 'Accommodation',
      items: [
        { id: 'my-room', label: 'My Room & Bed', icon: DoorClosed, badge: 'Room 401' },
      ]
    },
    {
      title: 'Payments',
      items: [
        { 
          id: 'payments', 
          label: 'Rent & Receipts', 
          icon: CreditCard, 
          badge: pendingPayments.length > 0 ? 'Due' : 'Paid',
          badgeColor: pendingPayments.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
        },
      ]
    },
    {
      title: 'Complaints & Services',
      items: [
        { 
          id: 'complaints', 
          label: 'Maintenance Requests', 
          icon: Wrench, 
          badge: openComplaintsCount > 0 ? `${openComplaintsCount}` : undefined,
          badgeColor: 'bg-amber-500 text-white'
        },
        { id: 'requests', label: 'Service Requests', icon: Droplets },
      ]
    },
    {
      title: 'Food & Mess',
      items: [
        { id: 'food', label: 'Weekly Menu & Ratings', icon: UtensilsCrossed },
      ]
    },
    {
      title: 'Announcements',
      items: [
        { id: 'announcements', label: 'Campus Notices', icon: Megaphone },
      ]
    },
    {
      title: 'Account & Settings',
      items: [
        { id: 'profile', label: 'Resident Profile & Pass', icon: User },
        { id: 'settings', label: 'Settings & Alerts', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border border-slate-200/90 hidden md:flex flex-col shrink-0 rounded-2xl shadow-xs overflow-hidden sticky top-20 h-[calc(100vh-6rem)]">
      {/* Resident Space Info */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          <span>Allocated Room</span>
          <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-semibold text-[10px] border border-teal-200/60">
            Bed A
          </span>
        </div>
        <div className="text-base font-bold text-slate-900">
          Room 401 · Double AC
        </div>
        <div className="text-xs text-slate-500 mt-0.5 truncate">
          Floor 4, Building A · {currentProperty.name}
        </div>
      </div>

      {/* Nav List with Clean Categorized Headers */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {navCategories.map((category) => (
          <div key={category.title} className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              {category.title}
            </div>
            {category.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || 
                (item.id === 'dashboard' && currentView === 'home');

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : (item.badgeColor || 'bg-slate-100 text-slate-700')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Clean Help Desk Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
          <span className="font-medium text-slate-700">Warden Helpdesk</span>
        </div>
        <span className="font-mono text-slate-600 font-semibold text-[11px]">{currentProperty.managerPhone}</span>
      </div>
    </aside>
  );
};
