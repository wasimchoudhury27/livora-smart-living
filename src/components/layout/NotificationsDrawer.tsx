import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCheck, 
  Bell, 
  AlertCircle, 
  CreditCard, 
  Wrench, 
  UtensilsCrossed, 
  Megaphone, 
  Droplets 
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComplaint?: (complaintId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectComplaint,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'fee':
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'complaint':
        return <Wrench className="w-4 h-4 text-rose-600" />;
      case 'food':
        return <UtensilsCrossed className="w-4 h-4 text-orange-600" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-indigo-600" />;
      case 'request':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-500">Live operational alerts & reminders</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={markAllNotificationsAsRead}
                className="p-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 font-semibold transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">All caught up!</p>
              </div>
            ) : (
              notifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => markNotificationAsRead(item.id)}
                  className={`p-3.5 transition-colors cursor-pointer rounded-xl flex items-start gap-3 ${
                    !item.read ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-semibold ${!item.read ? 'text-indigo-950 font-bold' : 'text-slate-800'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
            <span>Automated StaySphere dispatch</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Feed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
