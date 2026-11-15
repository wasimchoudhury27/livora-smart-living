import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { PaymentStatusBadge } from '../common/StatusBadge';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  CreditCard, 
  LogOut, 
  Phone, 
  Mail, 
  Layers, 
  LayoutGrid, 
  List,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface StudentsViewProps {
  onOpenAddStudent: () => void;
  onSelectStudent: (studentId: string) => void;
  onOpenRecordPayment: (student: Student) => void;
  onOpenCheckout: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenAddStudent,
  onSelectStudent,
  onOpenRecordPayment,
  onOpenCheckout,
}) => {
  const { students, currentProperty } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const propertyStudents = students.filter(s => s.propertyId === currentProperty.id);

  const filteredStudents = propertyStudents.filter(student => {
    // Search filter
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      student.name.toLowerCase().includes(q) ||
      student.phone.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.collegeOrWork.toLowerCase().includes(q) ||
      student.roomId.toLowerCase().includes(q);

    // Payment status filter
    const matchesPayment = paymentFilter === 'all' || student.paymentStatus === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  const totalCount = propertyStudents.length;
  const overdueCount = propertyStudents.filter(s => s.paymentStatus === 'overdue').length;
  const paidCount = propertyStudents.filter(s => s.paymentStatus === 'paid').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">Resident Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Students & Tenants ({totalCount})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Admissions, KYC verification, rent due dates, and digital check-outs.
          </p>
        </div>

        <button
          onClick={onOpenAddStudent}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Admission Check-In</span>
        </button>
      </div>

      {/* Mini KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Residents</span>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{totalCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fees Cleared</span>
            <div className="text-xl font-extrabold text-emerald-600 mt-0.5">{paidCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overdue Dues</span>
            <div className="text-xl font-extrabold text-rose-600 mt-0.5">{overdueCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search, Filter & View Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name, room, phone, college, email..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="partial">Partial</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Directory Content */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <h4 className="text-sm font-bold text-slate-700">No residents match criteria</h4>
          <p className="text-xs text-slate-500 mt-1">Try clearing search filters or add a new admission.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Resident</th>
                  <th className="py-3.5 px-4">Room & Bed</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">College / Work</th>
                  <th className="py-3.5 px-4">Monthly Rent</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr
                    key={student.id}
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectStudent(student.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {student.name}
                          </div>
                          <div className="text-[10px] text-slate-400">Joined {student.joiningDate}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">
                        Room {student.roomId.replace('rm-', '')}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {student.bedId.split('-').pop()?.toUpperCase()}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div>{student.phone}</div>
                      <div className="text-[10px] text-slate-400">{student.email}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {student.collegeOrWork}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      ₹{student.monthlyFee.toLocaleString('en-IN')}
                      <div className="text-[10px] font-normal text-slate-400">Due {student.dueDay}th</div>
                    </td>

                    <td className="py-3 px-4">
                      <PaymentStatusBadge status={student.paymentStatus} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectStudent(student.id)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenRecordPayment(student)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Record Payment"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        {student.status !== 'Checked Out' && (
                          <button
                            onClick={() => onOpenCheckout(student)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Process Check-Out"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student.id)}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{student.collegeOrWork}</p>
                    </div>
                  </div>

                  <PaymentStatusBadge status={student.paymentStatus} />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allocated Room:</span>
                    <span className="font-bold text-slate-900">
                      Room {student.roomId.replace('rm-', '')} ({student.bedId.split('-').pop()?.toUpperCase()})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Rent:</span>
                    <span className="font-bold text-emerald-600">₹{student.monthlyFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-slate-700">{student.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Due {student.dueDay}th of month</span>
                <span className="font-semibold text-indigo-600 group-hover:underline">
                  View Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
