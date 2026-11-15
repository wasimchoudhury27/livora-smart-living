import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    type: 'positive' | 'warning' | 'neutral' | 'urgent';
  };
  colorTheme?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'rose' | 'slate';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  colorTheme = 'indigo',
  onClick,
}) => {
  const themeColors = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      accentGlow: 'hover:border-indigo-300 hover:shadow-indigo-500/5',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      accentGlow: 'hover:border-emerald-300 hover:shadow-emerald-500/5',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      accentGlow: 'hover:border-amber-300 hover:shadow-amber-500/5',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      accentGlow: 'hover:border-blue-300 hover:shadow-blue-500/5',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      accentGlow: 'hover:border-rose-300 hover:shadow-rose-500/5',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
      accentGlow: 'hover:border-slate-300',
    },
  };

  const badgeStyles = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const theme = themeColors[colorTheme];

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all duration-200 flex flex-col justify-between group ${theme.accentGlow} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
            {value}
          </span>
        </div>

        <div className={`p-3 rounded-xl border ${theme.iconBg} transition-transform group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {subtitle ? (
          <span className="text-slate-500 font-medium truncate">{subtitle}</span>
        ) : (
          <span className="text-slate-400">Current cycle</span>
        )}

        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyles[badge.type]}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
};
