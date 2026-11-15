import React from 'react';
import { Home, DoorClosed, CreditCard, Wrench, UtensilsCrossed } from 'lucide-react';

interface StudentBottomNavProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

export const StudentBottomNav: React.FC<StudentBottomNavProps> = ({
  currentView,
  onSelectView,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'my-room', label: 'My Room', icon: DoorClosed },
    { id: 'payments', label: 'Fees', icon: CreditCard },
    { id: 'complaints', label: 'Tickets', icon: Wrench },
    { id: 'food', label: 'Mess', icon: UtensilsCrossed },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectView(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              isActive ? 'text-teal-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
