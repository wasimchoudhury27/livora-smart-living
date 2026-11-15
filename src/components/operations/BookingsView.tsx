import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  DoorClosed, 
  User, 
  Phone, 
  Mail, 
  CreditCard,
  Plus,
  ArrowRight
} from 'lucide-react';

interface BookingRecord {
  id: string;
  applicantName: string;
  phone: string;
  roomRequested: string;
  roomType: string;
  moveInDate: string;
  tokenAdvance: number;
  status: 'confirmed' | 'pending_token' | 'documents_pending';
  collegeCompany: string;
}

export const BookingsView: React.FC = () => {
  const { showToast, enquiries, currentProperty, updateEnquiryStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending_token' | 'documents_pending'>('all');
  
  const propertyEnquiries = enquiries.filter(e => e.propertyId === currentProperty.id);

  const [bookings, setBookings] = useState<BookingRecord[]>([
    {
      id: 'BK-101',
      applicantName: 'Aarav Patel',
      phone: '+91 98234 56789',
      roomRequested: '102 - Bed B',
      roomType: 'Double Sharing (AC)',
      moveInDate: '24 Oct 2026',
      tokenAdvance: 5000,
      status: 'confirmed',
      collegeCompany: 'IIT Bombay Intern'
    },
    {
      id: 'BK-102',
      applicantName: 'Sneha Deshmukh',
      phone: '+91 97112 34567',
      roomRequested: '204 - Bed A',
      roomType: 'Single Occupancy',
      moveInDate: '01 Nov 2026',
      tokenAdvance: 8000,
      status: 'confirmed',
      collegeCompany: 'Deloitte India'
    },
    {
      id: 'BK-103',
      applicantName: 'Vikram Singhania',
      phone: '+91 99887 66554',
      roomRequested: '305 - Bed C',
      roomType: 'Triple Sharing',
      moveInDate: '28 Oct 2026',
      tokenAdvance: 0,
      status: 'pending_token',
      collegeCompany: 'St. Xavier’s College'
    },
    {
      id: 'BK-104',
      applicantName: 'Meera Nambiar',
      phone: '+91 94455 11223',
      roomRequested: '108 - Bed B',
      roomType: 'Double Sharing',
      moveInDate: '05 Nov 2026',
      tokenAdvance: 5000,
      status: 'documents_pending',
      collegeCompany: 'Infosys BPM'
    }
  ]);

  const filtered = bookings.filter(b => {
    const matchesSearch = b.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.roomRequested.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConfirmCheckin = (id: string, name: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
    showToast('Booking Updated', `${name}'s booking has been marked as confirmed and ready for key handover.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <CalendarCheck className="w-3.5 h-3.5" />
              Resident Pipeline & Reservations
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Prospective Bookings</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Track upcoming admissions, token advances, room holds, and scheduled move-in dates before key handover.
            </p>
          </div>
          <button
            onClick={() => showToast('New Reservation', 'Opening reservation entry form...', 'info')}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Inbound Enquiries from LIVORA Discovery */}
      {propertyEnquiries.length > 0 && (
        <div className="bg-white rounded-2xl border border-teal-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 bg-teal-50/50 border-b border-teal-100 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-teal-600" />
                Inbound Public Leads from Discovery Platform ({propertyEnquiries.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prospective students who submitted visit or bed reservation requests from the Bangalore Discovery dashboard.
              </p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {propertyEnquiries.map(enq => (
              <div key={enq.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{enq.studentName}</span>
                    <span className="font-mono text-[10px] text-slate-400">({enq.id})</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md">
                      {enq.type === 'schedule_visit' ? 'Free Tour' : 'Reserve Bed'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                    <span>Phone: <strong>{enq.phone}</strong></span>
                    <span>·</span>
                    <span>Preference: <strong>{enq.sharingPreference} Sharing</strong></span>
                    <span>·</span>
                    <span>Target Date: <strong>{enq.moveInDate}</strong></span>
                  </div>
                  {enq.notes && (
                    <div className="text-[11px] text-slate-600 mt-1 italic">
                      "{enq.notes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    enq.status === 'visit_scheduled' ? 'bg-teal-100 text-teal-800' :
                    enq.status === 'admitted' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {enq.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {enq.status !== 'visit_scheduled' && (
                    <button
                      onClick={() => updateEnquiryStatus(enq.id, 'visit_scheduled')}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-[11px]"
                    >
                      Confirm Visit
                    </button>
                  )}
                  {enq.status !== 'admitted' && (
                    <button
                      onClick={() => updateEnquiryStatus(enq.id, 'admitted')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px]"
                    >
                      Admit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resident name, room number, contact..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {(['all', 'confirmed', 'pending_token', 'documents_pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                statusFilter === st
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'all' ? 'All Bookings' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Applicant & Contact</th>
                <th className="px-5 py-3.5">Reserved Room</th>
                <th className="px-5 py-3.5">Move-In Date</th>
                <th className="px-5 py-3.5">Token Deposit</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{b.applicantName}</div>
                    <div className="text-xs text-slate-500">{b.phone} • {b.collegeCompany}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">{b.roomRequested}</div>
                    <div className="text-xs text-slate-400">{b.roomType}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-medium">
                    {b.moveInDate}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900">₹{b.tokenAdvance.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    {b.status === 'confirmed' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    )}
                    {b.status === 'pending_token' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Token Due
                      </span>
                    )}
                    {b.status === 'documents_pending' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        KYC Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleConfirmCheckin(b.id, b.applicantName)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-2xs"
                    >
                      Convert to Check-in
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
