import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  DoorClosed, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  ShieldAlert, 
  UtensilsCrossed, 
  Wrench, 
  UserCheck, 
  Boxes, 
  Sparkles, 
  BarChart3, 
  Settings,
  Award,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OwnerSidebarProps {
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

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({ currentView, onSelectView }) => {
  const { complaints, students, currentProperty } = useApp();
  
  const pendingComplaints = complaints.filter(c => c.status !== 'Completed' && c.status !== 'Verified' && c.status !== 'Closed').length;
  const overdueRentCount = students.filter(s => s.paymentStatus === 'overdue').length;

  const navCategories: NavCategory[] = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { 
          id: 'public-discovery', 
          label: 'City Ranking & Profile', 
          icon: Award, 
          badge: `#${currentProperty.listingDetails?.cityRank || 1} Rank`,
          badgeColor: 'bg-teal-600 text-white'
        },
      ]
    },
    {
      title: 'Properties & Space',
      items: [
        { id: 'properties', label: 'Properties', icon: Building2 },
        { id: 'buildings-floors', label: 'Buildings & Floors', icon: Layers },
        { id: 'rooms', label: 'Rooms & Beds', icon: DoorClosed },
      ]
    },
    {
      title: 'Residents & Bookings',
      items: [
        { id: 'residents', label: 'Residents Directory', icon: Users, badge: students.length },
        { id: 'bookings', label: 'Reservations & Intake', icon: CalendarCheck },
      ]
    },
    {
      title: 'Finance & Ledgers',
      items: [
        { 
          id: 'finance', 
          label: 'Rent & Payments', 
          icon: CreditCard, 
          badge: overdueRentCount > 0 ? `${overdueRentCount} due` : undefined, 
          badgeColor: 'bg-rose-500 text-white' 
        },
        { id: 'deposits', label: 'Security Deposits', icon: ShieldAlert },
      ]
    },
    {
      title: 'Facility Operations',
      items: [
        { 
          id: 'maintenance-overview', 
          label: 'Maintenance Queue', 
          icon: Wrench, 
          badge: pendingComplaints > 0 ? pendingComplaints : undefined, 
          badgeColor: 'bg-amber-500 text-white' 
        },
        { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
        { id: 'inventory', label: 'Asset Inventory', icon: Boxes },
        { id: 'food', label: 'Food & Mess', icon: UtensilsCrossed },
        { 
          id: 'energy', 
          label: 'Energy & Smart Grid', 
          icon: Zap, 
          badge: 'Live IoT', 
          badgeColor: 'bg-amber-500 text-white' 
        },
      ]
    },
    {
      title: 'Team & Analytics',
      items: [
        { id: 'staff', label: 'Staff Management', icon: UserCheck },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Property Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 h-[calc(100vh-6rem)] sticky top-20 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Owner Command</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Portfolio & Strategic Controls</p>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {navCategories.map((cat) => (
          <div key={cat.title} className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              {cat.title}
            </div>

            {cat.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || 
                (item.id === 'rooms' && currentView === 'room-detail') ||
                (item.id === 'residents' && currentView === 'students') ||
                (item.id === 'finance' && currentView === 'payments') ||
                (item.id === 'maintenance-overview' && currentView === 'complaints') ||
                (item.id === 'reports' && currentView === 'analytics') ||
                (item.id === 'energy' && (currentView === 'energy-grid' || currentView === 'energy'));

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="pt-2.5 border-t border-slate-100 px-3 text-[11px] text-slate-400 flex items-center justify-between">
        <span>LIVORA v2.4</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
      </div>
    </aside>
  );
};
