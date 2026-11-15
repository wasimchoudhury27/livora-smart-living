import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  GraduationCap, 
  Wrench, 
  ShieldCheck, 
  CreditCard,
  ChevronDown, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RoleSwitcherProps {
  onRoleChanged?: (newRole: UserRole, defaultView: string) => void;
  className?: string;
}

interface RoleConfig {
  id: UserRole;
  label: string;
  roleCategory: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  defaultView: string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onRoleChanged, className = '' }) => {
  const { currentUserRole, setCurrentUserRole, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const roles: RoleConfig[] = [
    {
      id: 'student',
      label: 'Student / Resident',
      roleCategory: 'student',
      subtitle: 'Resident living portal, room, food & rent',
      icon: GraduationCap,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      defaultView: 'dashboard'
    },
    {
      id: 'owner',
      label: 'Owner / Administrator',
      roleCategory: 'owner',
      subtitle: 'Portfolio overview, properties, finances & team',
      icon: Building2,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      defaultView: 'dashboard'
    },
    {
      id: 'manager',
      label: 'Manager / Warden',
      roleCategory: 'manager',
      subtitle: 'Onboarding, check-ins, room readiness & safety',
      icon: ShieldCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      defaultView: 'dashboard'
    },
    {
      id: 'accountant',
      label: 'Accountant',
      roleCategory: 'accountant',
      subtitle: 'Fee reconciliation, deposits & expense ledger',
      icon: CreditCard,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      defaultView: 'payments'
    },
    {
      id: 'staff',
      label: 'Staff / Service Team',
      roleCategory: 'staff',
      subtitle: 'Maintenance queue, technician jobs & parts',
      icon: Wrench,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      defaultView: 'dashboard'
    }
  ];

  const normalizedCurrent = currentUserRole.toLowerCase();
  
  // Find currently active role config (handling legacy aliases)
  const activeRole = roles.find(r => {
    if (r.id === currentUserRole) return true;
    if (r.roleCategory === normalizedCurrent) return true;
    if (['maintenance', 'cleaner', 'cook'].includes(normalizedCurrent) && r.roleCategory === 'staff') return true;
    return false;
  }) || roles[0];

  const handleSelectRole = (targetRole: RoleConfig) => {
    setCurrentUserRole(targetRole.id);
    setIsOpen(false);
    
    if (onRoleChanged) {
      onRoleChanged(targetRole.id, targetRole.defaultView);
    }
    
    showToast(
      'Role Switched', 
      `Active workspace set to ${targetRole.label}`, 
      'info'
    );
  };

  const ActiveIcon = activeRole.icon;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Compact, Clean Judge Demo Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Switch User Role"
        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all text-xs font-semibold text-slate-800"
      >
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0" />
        <span className="text-slate-400 font-medium hidden sm:inline">Role:</span>
        <span className="font-bold text-slate-900">{activeRole.label.split(' / ')[0]}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
      </button>

      {/* Clean, Refined Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-900"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Demonstrate User Roles</p>
              <p className="text-[11px] text-slate-400">Switch active role persona</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200/60">
              <Sparkles className="w-3 h-3" /> Judge Demo
            </span>
          </div>

          {/* Role Items */}
          <div className="py-1.5 space-y-1">
            {roles.map((roleItem) => {
              const RoleIcon = roleItem.icon;
              const isSelected = activeRole.id === roleItem.id || activeRole.roleCategory === roleItem.roleCategory;

              return (
                <button
                  key={roleItem.id}
                  type="button"
                  onClick={() => handleSelectRole(roleItem)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 group/item ${
                    isSelected
                      ? 'bg-slate-50 border border-slate-200/90 text-slate-950 font-semibold'
                      : 'hover:bg-slate-50/70 border border-transparent text-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl ${roleItem.bgColor} border ${roleItem.borderColor} flex items-center justify-center shrink-0 mt-0.5`}>
                    <RoleIcon className={`w-4 h-4 ${roleItem.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-teal-700' : 'text-slate-900'}`}>
                        {roleItem.label}
                      </span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : (
                        <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                      {roleItem.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 text-[11px] text-slate-400 bg-slate-50 rounded-xl flex items-center justify-between border-t border-slate-100">
            <span>5 Real-Time Role Personas</span>
            <span className="font-semibold text-teal-700">LIVORA Platform</span>
          </div>
        </div>
      )}
    </div>
  );
};
