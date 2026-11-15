import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeftRight, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  FileText,
  UserCheck
} from 'lucide-react';

interface MovementRecord {
  id: string;
  type: 'check_in' | 'check_out';
  studentName: string;
  roomNumber: string;
  date: string;
  depositStatus: 'Clear' | 'Pending Dues' | 'Refund Ready';
  keyHandover: boolean;
  status: 'completed' | 'scheduled' | 'action_required';
}

export const CheckinsCheckoutsView: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'check_in' | 'check_out'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [records, setRecords] = useState<MovementRecord[]>([
    { id: 'mov-1', type: 'check_in', studentName: 'Aarav Patel', roomNumber: '102-B', date: 'Today, 11:00 AM', depositStatus: 'Clear', keyHandover: true, status: 'completed' },
    { id: 'mov-2', type: 'check_in', studentName: 'Sneha Deshmukh', roomNumber: '204-A', date: 'Tomorrow, 02:00 PM', depositStatus: 'Clear', keyHandover: false, status: 'scheduled' },
    { id: 'mov-3', type: 'check_out', studentName: 'Rohan Joshi', roomNumber: '302-C', date: '20 Oct 2026', depositStatus: 'Pending Dues', keyHandover: false, status: 'action_required' },
    { id: 'mov-4', type: 'check_out', studentName: 'Ananya Roy', roomNumber: '105-A', date: '25 Oct 2026', depositStatus: 'Refund Ready', keyHandover: false, status: 'scheduled' },
  ]);

  const handleCompleteHandover = (id: string, name: string) => {
    setRecords(records.map(r => r.id === id ? { ...r, keyHandover: true, status: 'completed' } : r));
    showToast('Handover Finalized', `RFID key & room inventory verified for ${name}.`, 'success');
  };

  const filtered = records.filter(r => {
    const matchesTab = activeTab === 'all' || r.type === activeTab;
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || r.roomNumber.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Resident Onboarding & Exit Protocol
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Check-ins & Check-outs</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Execute biometric check-in onboarding, room key handovers, deposit clearance, and exit inventory inspections.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 shrink-0">
            <UserCheck className="w-6 h-6 text-teal-300" />
            <div>
              <p className="text-xs text-slate-300 font-medium">Scheduled This Week</p>
              <p className="text-lg font-bold text-teal-300">4 Movements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resident name or room..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['all', 'check_in', 'check_out'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                activeTab === t
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t === 'all' ? 'All Movements' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Type & Resident</th>
                <th className="px-5 py-3.5">Assigned Room</th>
                <th className="px-5 py-3.5">Scheduled Date</th>
                <th className="px-5 py-3.5">Dues & Deposit</th>
                <th className="px-5 py-3.5">Key Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.type === 'check_in' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.type === 'check_in' ? <LogIn className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.studentName}</div>
                        <span className="text-[11px] font-semibold uppercase text-slate-400">
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    Room {item.roomNumber}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600">
                    {item.date}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      item.depositStatus === 'Clear'
                        ? 'bg-emerald-50 text-emerald-800'
                        : item.depositStatus === 'Pending Dues'
                        ? 'bg-rose-50 text-rose-800'
                        : 'bg-teal-50 text-teal-800'
                    }`}>
                      {item.depositStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {item.keyHandover ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Handed Over
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Handover
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {!item.keyHandover ? (
                      <button
                        onClick={() => handleCompleteHandover(item.id, item.studentName)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-2xs"
                      >
                        Sign & Handover
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-teal-700">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
