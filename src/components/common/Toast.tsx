import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />,
        };

        const borderColors = {
          success: 'border-emerald-200 bg-white shadow-emerald-500/10',
          error: 'border-rose-200 bg-white shadow-rose-500/10',
          warning: 'border-amber-200 bg-white shadow-amber-500/10',
          info: 'border-indigo-200 bg-white shadow-indigo-500/10',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-200 animate-in slide-in-from-bottom-2 ${borderColors[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
