import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  CheckCircle2, 
  Wrench, 
  Sparkles, 
  ClipboardCheck, 
  UtensilsCrossed, 
  Megaphone, 
  FileSpreadsheet, 
  Settings,
  Award,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ManagerSidebarProps {
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

export const ManagerSidebar: React.FC<ManagerSidebarProps> = ({ currentView, onSelectView }) => {
  const { students, complaints, currentProperty } = useApp();
  
  const activeResidents = students.filter(s => s.status === 'Active').length;
  const pendingMaintenance = complaints.filter(c => c.status !== 'Completed' && c.status !== 'Verified' && c.status !== 'Closed').length;

  const navCategories: NavCategory[] = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Warden Dashboard', icon: LayoutDashboard },
        { 
          id: 'public-discovery', 
          label: 'City Ranking & Profile', 
          icon: Award, 
          badge: `#${currentProperty.listingDetails?.cityRank || 1}` 
        },
      ]
    },
    {
      title: 'Resident Intake & Care',
      items: [
        { id: 'residents', label: 'Resident Directory', icon: Users, badge: activeResidents },
        { id: 'checkins-checkouts', label: 'Check-ins & Check-outs', icon: ArrowLeftRight },
      ]
    },
    {
      title: 'Facility & Safety',
      items: [
        { id: 'room-readiness', label: 'Room Readiness & Turnover', icon: CheckCircle2 },
        { 
          id: 'maintenance-queue', 
          label: 'Maintenance Queue', 
          icon: Wrench, 
          badge: pendingMaintenance > 0 ? pendingMaintenance : undefined, 
          badgeColor: 'bg-amber-500 text-white' 
        },
        { id: 'housekeeping', label: 'Housekeeping Operations', icon: Sparkles },
        { id: 'inspections', label: 'Safety & Audit Inspections', icon: ClipboardCheck },
        { id: 'energy', label: 'Energy & Smart Grid', icon: Zap },
      ]
    },
    {
      title: 'Mess & Communication',
      items: [
        { id: 'food-operations', label: 'Food & Mess Operations', icon: UtensilsCrossed },
        { id: 'announcements', label: 'Campus Announcements', icon: Megaphone },
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'daily-reports', label: 'Daily Census Reports', icon: FileSpreadsheet },
        { id: 'settings', label: 'Facility Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 h-[calc(100vh-6rem)] sticky top-20 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Manager / Warden</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Facility & Operations Control</p>
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
                (item.id === 'residents' && currentView === 'students') ||
                (item.id === 'maintenance-queue' && currentView === 'complaints') ||
                (item.id === 'food-operations' && currentView === 'food');

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
        <span>Campus Operations</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Active" />
      </div>
    </aside>
  );
};
