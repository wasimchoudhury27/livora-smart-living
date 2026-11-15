import React from 'react';
import { 
  LayoutDashboard, 
  DoorClosed, 
  Users, 
  Wrench, 
  CreditCard,
  UtensilsCrossed,
  Home,
  CheckSquare,
  ArrowLeftRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavProps {
  currentView?: string;
  onSelectView?: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView = 'dashboard',
  onSelectView,
}) => {
  const { currentUserRole, complaints } = useApp();
  const normalizedRole = currentUserRole.toLowerCase();

  const handleNav = (tabId: string) => {
    if (onSelectView) onSelectView(tabId);
  };

  const pendingComplaints = complaints.filter(
    c => c.status !== 'Completed' && c.status !== 'Verified' && c.status !== 'Closed'
  ).length;

  // Role-specific bottom bars for mobile devices
  if (normalizedRole === 'staff' || normalizedRole === 'maintenance' || normalizedRole === 'cleaner' || normalizedRole === 'cook') {
    const staffTabs = [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'assigned-tasks', label: 'My Tasks', icon: CheckSquare },
      { id: 'maintenance-jobs', label: 'Repairs', icon: Wrench, badge: pendingComplaints },
      { id: 'work-schedule', label: 'Schedule', icon: Sparkles },
    ];

    return (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
        {staffTabs.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-teal-700 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-teal-600' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0.5 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    );
  }

  if (normalizedRole === 'manager') {
    const managerTabs = [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'residents', label: 'Residents', icon: Users },
      { id: 'checkins-checkouts', label: 'Movements', icon: ArrowLeftRight },
      { id: 'maintenance-queue', label: 'Tickets', icon: Wrench, badge: pendingComplaints },
    ];

    return (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
        {managerTabs.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-teal-700 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-teal-600' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0.5 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    );
  }

  // Owner / Admin Mobile Navigation
  const ownerTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms & Beds', icon: DoorClosed },
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'finance', label: 'Finance', icon: CreditCard },
    { id: 'maintenance-overview', label: 'Tickets', icon: Wrench, badge: pendingComplaints },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
      {ownerTabs.map(item => {
        const Icon = item.icon;
        const isActive = currentView === item.id || 
          (item.id === 'rooms' && currentView === 'room-detail') ||
          (item.id === 'residents' && currentView === 'students') ||
          (item.id === 'finance' && currentView === 'payments');

        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive ? 'text-teal-700 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-teal-600' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>

            {item.badge && item.badge > 0 ? (
              <span className="absolute top-0.5 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
};
