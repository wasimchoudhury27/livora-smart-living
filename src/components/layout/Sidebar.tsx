import React from 'react';
import { 
  LayoutDashboard, 
  Building, 
  Layers, 
  Users, 
  UserPlus, 
  CreditCard, 
  Wrench, 
  UtensilsCrossed, 
  Droplets, 
  UserCog, 
  Megaphone, 
  ReceiptText, 
  BarChart3, 
  Bot, 
  Sliders, 
  Sparkles,
  CreditCard as PricingIcon,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type ActiveTab = 
  | 'dashboard'
  | 'properties'
  | 'rooms'
  | 'students'
  | 'payments'
  | 'complaints'
  | 'food'
  | 'requests'
  | 'staff'
  | 'announcements'
  | 'expenses'
  | 'analytics'
  | 'ai-assistant'
  | 'pricing'
  | 'settings';

interface SidebarProps {
  activeTab?: ActiveTab | string;
  setActiveTab?: (tab: ActiveTab) => void;
  currentView?: string;
  onSelectView?: (view: string) => void;
  onOpenAddStudent?: () => void;
  onOpenRecordPayment?: () => void;
  onOpenWeeklyReport?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentView,
  onSelectView,
  onOpenAddStudent,
  onOpenRecordPayment,
  onOpenWeeklyReport,
}) => {
  const { stats, currentUserRole } = useApp();
  const selectedTab = currentView || activeTab || 'dashboard';

  const handleTabClick = (tabId: string) => {
    if (onSelectView) onSelectView(tabId);
    if (setActiveTab) setActiveTab(tabId as ActiveTab);
  };

  const navSections = [
    {
      title: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'properties', label: 'Properties', icon: Building },
        { id: 'rooms', label: 'Rooms & Beds', icon: Layers, badge: `${stats.occupancyRate}%` },
        { id: 'students', label: 'Residents / Students', icon: Users, badge: `${stats.occupiedBeds}` },
      ],
    },
    {
      title: 'Property Facilities',
      items: [
        { id: 'complaints', label: 'Maintenance & Tickets', icon: Wrench, badge: stats.openComplaints > 0 ? `${stats.openComplaints}` : undefined, badgeColor: 'rose' },
        { id: 'requests', label: 'Service Requests', icon: Droplets },
        { id: 'food', label: 'Food & Mess Menu', icon: UtensilsCrossed, badge: `${stats.averageFoodRating} ★` },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'staff', label: 'Staff Management', icon: UserCog },
      ],
    },
    {
      title: 'Finance & Analytics',
      items: [
        { id: 'payments', label: 'Payments & Receipts', icon: CreditCard },
        { id: 'expenses', label: 'Expense Tracking', icon: ReceiptText },
        { id: 'analytics', label: 'Occupancy & Reports', icon: BarChart3 },
      ],
    },
    {
      title: 'AI Intelligence',
      items: [
        { id: 'ai-assistant', label: 'AI Property Copilot', icon: Bot, isNew: true },
      ],
    },
    {
      title: 'System',
      items: [
        { id: 'pricing', label: 'SaaS Plans', icon: PricingIcon },
        { id: 'settings', label: 'Settings', icon: Sliders },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] hidden md:flex no-print">
      {/* Quick Action Buttons */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-2">
        <button
          onClick={onOpenAddStudent}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all duration-150 active:scale-98"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Admission Check-In</span>
        </button>

        <button
          onClick={onOpenRecordPayment}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all duration-150"
        >
          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
          <span>Record Offline Payment</span>
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {navSections.map(section => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>

            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = selectedTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {'isNew' in item && item.isNew && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xs flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> AI
                      </span>
                    )}

                    {'badge' in item && item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ('badgeColor' in item && item.badgeColor === 'rose')
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status Card */}
      <div className="p-3 m-3 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-300 font-medium">Occupancy Load</span>
          <span className="text-emerald-400 font-bold">{stats.occupancyRate}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-indigo-400 rounded-full"
            style={{ width: `${stats.occupancyRate}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span>{stats.occupiedBeds}/{stats.totalBeds} Beds Taken</span>
          <button 
            onClick={() => handleTabClick('rooms')} 
            className="text-indigo-300 hover:text-white flex items-center gap-0.5 font-semibold"
          >
            Manage <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
