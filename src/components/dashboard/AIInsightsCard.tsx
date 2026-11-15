import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface AIInsightsCardProps {
  onOpenWeeklyDigest: () => void;
  onOpenComplaints: () => void;
  onOpenPayments: () => void;
  onOpenFood: () => void;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  onOpenWeeklyDigest,
  onOpenComplaints,
  onOpenPayments,
  onOpenFood,
}) => {
  const { aiInsights, stats, currentProperty } = useApp();

  const handleAction = (category: string) => {
    if (category === 'maintenance') onOpenComplaints();
    else if (category === 'finance') onOpenPayments();
    else if (category === 'food') onOpenFood();
    else onOpenWeeklyDigest();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-500/20 relative overflow-hidden">
      {/* Background ambient glow circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">AI Weekly Property Insights</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                Autonomous
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Synthesized from {stats.totalBeds} resident records, smart sub-meters, and daily mess ratings
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWeeklyDigest}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15 transition-all shadow-xs group"
        >
          <span>Full Executive Report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Insights Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        {aiInsights.map(insight => {
          const typeBorders = {
            alert: 'border-rose-500/40 hover:border-rose-400/80 bg-rose-950/20',
            warning: 'border-amber-500/40 hover:border-amber-400/80 bg-amber-950/20',
            recommendation: 'border-blue-500/40 hover:border-blue-400/80 bg-blue-950/20',
            positive: 'border-emerald-500/40 hover:border-emerald-400/80 bg-emerald-950/20',
          };

          const typeIcons = {
            alert: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
            recommendation: <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
            positive: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
          };

          return (
            <div
              key={insight.id}
              onClick={() => handleAction(insight.category)}
              className={`p-4 rounded-2xl border backdrop-blur-md transition-all duration-200 cursor-pointer flex flex-col justify-between group ${typeBorders[insight.type]}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {typeIcons[insight.type]}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      {insight.category}
                    </span>
                  </div>
                  {insight.metric && (
                    <span className="text-xs font-extrabold text-white px-2 py-0.5 rounded-md bg-white/10 font-mono">
                      {insight.metric}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white leading-snug group-hover:text-indigo-200 transition-colors">
                  {insight.title}
                </h4>

                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                  {insight.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-indigo-300 font-semibold group-hover:underline">
                  {insight.actionLabel || 'Take action'}
                </span>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
