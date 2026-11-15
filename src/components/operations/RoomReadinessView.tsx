import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  DoorClosed, 
  Sparkles, 
  Clock, 
  Wrench, 
  Check, 
  Search, 
  ShieldCheck 
} from 'lucide-react';

interface ReadinessRoom {
  roomNumber: string;
  floor: string;
  type: string;
  status: 'Ready' | 'Cleaning In Progress' | 'Maintenance Required' | 'Occupied';
  checklist: {
    sanitized: boolean;
    acWorking: boolean;
    geyserTested: boolean;
    linenPlaced: boolean;
    lockWorking: boolean;
  };
}

export const RoomReadinessView: React.FC = () => {
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const [rooms, setRooms] = useState<ReadinessRoom[]>([
    {
      roomNumber: '103',
      floor: 'Floor 1',
      type: 'Single Occupancy',
      status: 'Ready',
      checklist: { sanitized: true, acWorking: true, geyserTested: true, linenPlaced: true, lockWorking: true }
    },
    {
      roomNumber: '107',
      floor: 'Floor 1',
      type: 'Double Sharing',
      status: 'Cleaning In Progress',
      checklist: { sanitized: false, acWorking: true, geyserTested: true, linenPlaced: false, lockWorking: true }
    },
    {
      roomNumber: '205',
      floor: 'Floor 2',
      type: 'Triple Sharing',
      status: 'Maintenance Required',
      checklist: { sanitized: true, acWorking: false, geyserTested: true, linenPlaced: false, lockWorking: true }
    },
    {
      roomNumber: '304',
      floor: 'Floor 3',
      type: 'Double Sharing',
      status: 'Ready',
      checklist: { sanitized: true, acWorking: true, geyserTested: true, linenPlaced: true, lockWorking: true }
    }
  ]);

  const handleToggleCheck = (roomNum: string, itemKey: keyof ReadinessRoom['checklist']) => {
    setRooms(rooms.map(r => {
      if (r.roomNumber === roomNum) {
        const updatedChecklist = { ...r.checklist, [itemKey]: !r.checklist[itemKey] };
        const allDone = Object.values(updatedChecklist).every(Boolean);
        return {
          ...r,
          checklist: updatedChecklist,
          status: allDone ? 'Ready' : 'Cleaning In Progress'
        };
      }
      return r;
    }));
    showToast('Readiness Updated', `Checklist updated for Room ${roomNum}`, 'info');
  };

  const readyCount = rooms.filter(r => r.status === 'Ready').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Room Turnover & Handover Readiness
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Room Readiness Dashboard</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Quality assurance checklist before issuing keys to incoming residents. Inspect hygiene, appliances, and linen.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-right shrink-0">
            <p className="text-xs text-slate-300 font-medium">Turnover Readiness</p>
            <p className="text-2xl font-bold text-teal-300">{readyCount} / {rooms.length} Rooms Ready</p>
            <p className="text-[11px] text-teal-200 mt-0.5">Ready for immediate check-in</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rooms.map((rm) => (
          <div 
            key={rm.roomNumber}
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 font-bold flex items-center justify-center">
                  {rm.roomNumber}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Room {rm.roomNumber}</h3>
                  <p className="text-xs text-slate-500">{rm.floor} • {rm.type}</p>
                </div>
              </div>

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                rm.status === 'Ready'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : rm.status === 'Maintenance Required'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {rm.status}
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Handover Checklist</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'sanitized', label: 'Sanitized & Cleaned' },
                  { key: 'acWorking', label: 'AC & Remotes Checked' },
                  { key: 'geyserTested', label: 'Geyser & Plumbing Tested' },
                  { key: 'linenPlaced', label: 'Fresh Linen Placed' },
                  { key: 'lockWorking', label: 'Digital RFID Lock Active' }
                ].map((item) => {
                  const isDone = rm.checklist[item.key as keyof ReadinessRoom['checklist']];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleToggleCheck(rm.roomNumber, item.key as keyof ReadinessRoom['checklist'])}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                        isDone 
                          ? 'bg-teal-50/50 border-teal-200 text-teal-900' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isDone ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                      }`}>
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
