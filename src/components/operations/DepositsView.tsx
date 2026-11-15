import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Receipt,
  Download,
  IndianRupee
} from 'lucide-react';

export const DepositsView: React.FC = () => {
  const { students, currentProperty, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const getRoomNumber = (roomId: string) => {
    for (const b of currentProperty?.buildings || []) {
      for (const f of b.floors || []) {
        const found = f.rooms?.find(r => r.id === roomId);
        if (found) return found.roomNumber;
      }
    }
    return '101';
  };

  const depositRecords = students.map((std, idx) => ({
    id: `dep-${std.id}`,
    studentName: std.name,
    room: getRoomNumber(std.roomId),
    depositAmount: std.securityDeposit || 15000,
    paidDate: std.joiningDate || '01 Aug 2026',
    status: std.status === 'Active' ? 'held_safe' : 'refund_processed',
    deductions: 0,
    receiptNo: `DEP-2026-${1000 + idx}`
  }));

  const totalHeld = depositRecords
    .filter(d => d.status === 'held_safe')
    .reduce((sum, d) => sum + d.depositAmount, 0);

  const filtered = depositRecords.filter(d => 
    d.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              Security Deposits & Escrow Ledger
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Security Deposits</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Track refundable caution deposits, exit damage deductions, and audit escrow ledger balances across all active residents.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-right shrink-0">
            <p className="text-xs text-slate-300 font-medium">Total Security Escrow Held</p>
            <p className="text-2xl font-bold text-teal-300">₹{totalHeld.toLocaleString()}</p>
            <p className="text-[11px] text-teal-200 mt-0.5">Across {depositRecords.length} active leases</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deposit by resident name, room number, receipt #..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Resident & Room</th>
                <th className="px-5 py-3.5">Deposit Amount</th>
                <th className="px-5 py-3.5">Receipt Voucher</th>
                <th className="px-5 py-3.5">Collection Date</th>
                <th className="px-5 py-3.5">Escrow Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{d.studentName}</div>
                    <div className="text-xs text-slate-500">Room {d.room}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900">₹{d.depositAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-600">
                    {d.receiptNo}
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-xs">
                    {d.paidDate}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      <CheckCircle2 className="w-3 h-3 text-teal-600" /> Secure in Escrow
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => showToast('Deposit Receipt', `Downloading deposit escrow voucher for ${d.studentName}...`, 'info')}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all flex items-center gap-1.5 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Voucher</span>
                    </button>
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
