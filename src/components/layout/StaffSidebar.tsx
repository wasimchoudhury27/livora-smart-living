import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wrench, 
  AlertTriangle, 
  Calendar, 
  Boxes, 
  History, 
  User, 
  Settings 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StaffSidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({ currentView, onSelectView }) => {
  const { complaints } = useApp();
  
  const assignedJobs = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const urgentJobs = complaints.filter(c => c.priority === 'urgent' && c.status !== 'Completed' && c.status !== 'Closed').length;

  const navCategories = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Work Orders',
      items: [
        { 
          id: 'assigned-tasks', 
          label: 'Assigned Tasks', 
          icon: CheckSquare, 
          badge: assignedJobs > 0 ? assignedJobs : undefined, 
          badgeColor: 'bg-teal-600 text-white' 
        },
        { 
          id: 'urgent-requests', 
          label: 'Urgent Tickets', 
          icon: AlertTriangle, 
          badge: urgentJobs > 0 ? urgentJobs : undefined, 
          badgeColor: 'bg-rose-500 text-white' 
        },
        { id: 'maintenance-jobs', label: 'All Maintenance Jobs', icon: Wrench },
      ]
    },
    {
      title: 'Schedule & Logistics',
      items: [
        { id: 'work-schedule', label: 'Shift Roster', icon: Calendar },
        { id: 'inventory-used', label: 'Spares & Inventory', icon: Boxes },
        { id: 'work-history', label: 'Work History & SLA', icon: History },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Staff Profile', icon: User },
        { id: 'settings', label: 'App Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 h-[calc(100vh-6rem)] sticky top-20 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Service Team</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Technician & Facility Board</p>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {navCategories.map((cat) => (
          <div key={cat.title} className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              {cat.title}
            </div>

            {cat.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

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
        <span>Field Tech Portal</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="On Duty" />
      </div>
    </aside>
  );
};
