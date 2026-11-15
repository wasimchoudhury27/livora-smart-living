import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { 
  Building2, 
  Search, 
  Bell, 
  ChevronDown, 
  UserCheck, 
  Plus, 
  RotateCcw, 
  LogOut,
  Sparkles,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { UserRole } from '../../types';
import { RoleSwitcher } from './RoleSwitcher';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenAddProperty: () => void;
  onOpenAddStudent?: () => void;
  onOpenAIWeekly?: () => void;
  onOpenAuth?: () => void;
  onRoleChanged?: (newRole: UserRole, defaultView: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onOpenAddProperty,
  onOpenAddStudent,
  onOpenAIWeekly,
  onOpenAuth,
  onRoleChanged,
}) => {
  const { 
    properties, 
    currentProperty, 
    setCurrentPropertyId, 
    currentUserRole, 
    notifications,
    logout,
    resetDemoData,
    platformMode,
    setPlatformMode
  } = useApp();

  const [isPropDropdownOpen, setIsPropDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between no-print">
      {/* Left: Logo & Property Selector */}
      <div className="flex items-center gap-3 sm:gap-6">
        <Logo size="sm" showTagline={false} />

        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        {/* Property Selector */}
        <div className="relative">
          <button
            onClick={() => setIsPropDropdownOpen(!isPropDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold transition-all duration-150"
          >
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span className="max-w-[120px] sm:max-w-[200px] truncate">{currentProperty.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isPropDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsPropDropdownOpen(false)} 
              />
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                  Select Property ({properties.length})
                </div>

                <div className="space-y-1">
                  {properties.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentPropertyId(p.id);
                        setIsPropDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                        p.id === currentProperty.id
                          ? 'bg-indigo-50 text-indigo-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Building2 className={`w-4 h-4 shrink-0 mt-0.5 ${p.id === currentProperty.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{p.city} • {p.type}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsPropDropdownOpen(false);
                      onOpenAddProperty();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Property
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Platform Mode Switcher: Public Discovery vs Management */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setPlatformMode('discovery')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg transition-all ${
              platformMode === 'discovery'
                ? 'bg-white text-teal-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Discovery</span>
          </button>
          <button
            onClick={() => setPlatformMode('management')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg transition-all ${
              platformMode === 'management'
                ? 'bg-white text-indigo-800 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Management</span>
          </button>
        </div>
      </div>

      {/* Middle: Global Search Button */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-xs group"
        >
          <span className="flex items-center gap-2.5 text-slate-500">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span>Search student, room, bed, phone, payment, staff...</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, AI Weekly, Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Weekly Report Quick Trigger (Management only) */}
        {(currentUserRole === 'owner' || currentUserRole === 'manager') && onOpenAIWeekly && (
          <button
            onClick={onOpenAIWeekly}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-xl text-xs font-semibold text-teal-800 transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Weekly Digest</span>
          </button>
        )}

        {/* LIVORA Role Switcher */}
        <RoleSwitcher onRoleChanged={onRoleChanged} />

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* User Avatar & Logout */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
