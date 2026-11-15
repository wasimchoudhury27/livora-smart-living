import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  Briefcase, 
  Calculator, 
  Wrench, 
  GraduationCap, 
  Sparkles, 
  PlayCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DemoRoleBarProps {
  onOpenDemoWalkthrough: () => void;
}

export const DemoRoleBar: React.FC<DemoRoleBarProps> = ({ onOpenDemoWalkthrough }) => {
  const { currentUserRole, setCurrentUserRole, showToast } = useApp();

  const roles: { role: UserRole; label: string; sublabel: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    {
      role: 'owner',
      label: 'Owner / Admin',
      sublabel: 'Command Center',
      icon: Building2,
      color: 'from-indigo-600 to-blue-700',
    },
    {
      role: 'manager',
      label: 'Manager',
      sublabel: 'Operations Center',
      icon: Briefcase,
      color: 'from-blue-600 to-cyan-700',
    },
    {
      role: 'accountant',
      label: 'Accountant',
      sublabel: 'Finance Center',
      icon: Calculator,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      role: 'maintenance',
      label: 'Staff (Imran)',
      sublabel: 'My Tasks',
      icon: Wrench,
      color: 'from-amber-600 to-orange-700',
    },
    {
      role: 'student',
      label: 'Student (Rahul)',
      sublabel: 'My Stay (Room 401)',
      icon: GraduationCap,
      color: 'from-purple-600 to-indigo-700',
    },
  ];

  const handleRoleSelect = (role: UserRole, label: string) => {
    setCurrentUserRole(role);
    showToast('Role Switched', `Switched application experience to: ${label}`, 'info');
  };

  const normalizedCurrent = currentUserRole.toLowerCase();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-6 py-2 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: Hackathon Role Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold tracking-wider uppercase text-[10px] border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hackathon Demo Mode</span>
          </div>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            Switch persona to test strict role separation:
          </span>
        </div>

        {/* Center: Quick Role Switch Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {roles.map(r => {
            const Icon = r.icon;
            const isSelected = normalizedCurrent === r.role.toLowerCase();

            return (
              <button
                key={r.role}
                onClick={() => handleRoleSelect(r.role, r.label)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm ring-2 ring-indigo-400 font-bold scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
                title={`Switch to ${r.label} experience`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{r.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: 2-Min Interactive Demo Walkthrough Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDemoWalkthrough}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <PlayCircle className="w-3.5 h-3.5 text-yellow-200 animate-bounce" />
            <span className="text-white font-extrabold">Interactive 2-Min Demo</span>
            <Sparkles className="w-3 h-3 text-yellow-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
