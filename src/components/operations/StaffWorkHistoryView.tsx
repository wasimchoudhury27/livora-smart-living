import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  CheckCircle2, 
  Star, 
  Clock, 
  Wrench, 
  Search, 
  Tag, 
  Download 
} from 'lucide-react';

export const StaffWorkHistoryView: React.FC = () => {
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const historyRecords = [
    { id: 'wh-1', title: 'AC Thermostat Sensor Replacement', room: '104', date: 'Yesterday, 03:30 PM', timeTaken: '45 mins', rating: 5, partsUsed: 'Daikin Digital Sensor PCB', studentFeedback: 'Very quick and polite service. Cools perfectly now!' },
    { id: 'wh-2', title: 'Bathroom Tap Washer Leakage Fix', room: '202', date: '14 Oct 2026', timeTaken: '20 mins', rating: 5, partsUsed: '1/2" Ceramic Washer', studentFeedback: 'Resolved within half an hour of reporting.' },
    { id: 'wh-3', title: 'Ceiling Fan Regulator Overhaul', room: '305', date: '12 Oct 2026', timeTaken: '30 mins', rating: 4, partsUsed: 'Anchor 5-step Modular Regulator', studentFeedback: 'Smooth operation now.' },
    { id: 'wh-4', title: 'Door Lock Cylinder Lubrication', room: '108', date: '09 Oct 2026', timeTaken: '15 mins', rating: 5, partsUsed: 'WD-40 Specialist Spray', studentFeedback: 'Key moves effortlessly now.' },
  ];

  const filtered = historyRecords.filter(h => 
    h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.room.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <History className="w-3.5 h-3.5" />
              Completed Service Logs
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Service Work History</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Audit log of completed maintenance requests, resolution turnarounds, and resident ratings.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-right shrink-0">
            <p className="text-xs text-slate-300 font-medium">Average Job Rating</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-bold text-teal-300">4.8</span>
              <span className="text-xs text-slate-300">/ 5.0</span>
            </div>
            <p className="text-[11px] text-teal-200 mt-0.5">34 total jobs logged</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search completed jobs by title or room number..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
                  Room {item.room}
                </span>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-900">{item.rating}.0 Resident Rating</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 italic">
              "{item.studentFeedback}"
            </p>

            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-4">
                <span>Completed: {item.date}</span>
                <span>Duration: {item.timeTaken}</span>
              </div>
              <span className="font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                Parts: {item.partsUsed}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
