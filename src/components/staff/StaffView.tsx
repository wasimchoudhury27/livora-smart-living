import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Staff, StaffAttendanceRecord, StaffLeaveRequest, PayrollRecord, AttendanceStatus } from '../../types';
import { 
  Users, 
  CalendarCheck, 
  Banknote, 
  CalendarDays, 
  Plus, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Shield, 
  Wrench, 
  Search, 
  Filter, 
  DollarSign, 
  AlertCircle, 
  Check, 
  X, 
  Eye, 
  Sparkles,
  CreditCard,
  Building2,
  FileText
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { SalarySlipModal } from './SalarySlipModal';

type ActiveTab = 'directory' | 'attendance' | 'payroll' | 'leaves';

export const StaffView: React.FC = () => {
  const { 
    staff, 
    currentProperty, 
    addStaff, 
    updateStaff, 
    staffAttendance, 
    markAttendance, 
    batchMarkAttendance,
    staffLeaves, 
    applyStaffLeave, 
    reviewStaffLeave,
    payrollRecords,
    generateMonthlyPayroll,
    markPayrollPaid,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<ActiveTab>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Modal States
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payTargetRecord, setPayTargetRecord] = useState<PayrollRecord | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<'Bank Transfer' | 'UPI' | 'Cash'>('UPI');
  const [payoutRef, setPayoutRef] = useState('');

  // Attendance Date
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Form states for Add Staff
  const [name, setName] = useState('');
  const [role, setRole] = useState<Staff['role']>('Caretaker');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shift, setShift] = useState('09:00 AM – 06:00 PM');
  const [assignedBlock, setAssignedBlock] = useState('Wing A & B');
  const [salaryType, setSalaryType] = useState<'monthly' | 'daily' | 'hourly'>('monthly');
  const [basicSalary, setBasicSalary] = useState('20000');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upiId, setUpiId] = useState('');

  // Form states for Leave
  const [leaveStaffId, setLeaveStaffId] = useState('');
  const [leaveStartDate, setLeaveStartDate] = useState(todayStr);
  const [leaveEndDate, setLeaveEndDate] = useState(todayStr);
  const [leaveReason, setLeaveReason] = useState('');

  const propertyStaff = useMemo(() => {
    return staff.filter(s => s.propertyId === currentProperty.id);
  }, [staff, currentProperty.id]);

  const filteredStaff = useMemo(() => {
    return propertyStaff.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.phone.includes(searchQuery);
      const matchesRole = roleFilter === 'All' || s.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [propertyStaff, searchQuery, roleFilter]);

  // Attendance records for selected date
  const dayAttendanceMap = useMemo(() => {
    const map = new Map<string, StaffAttendanceRecord>();
    staffAttendance
      .filter(a => a.propertyId === currentProperty.id && a.date === selectedDate)
      .forEach(a => map.set(a.staffId, a));
    return map;
  }, [staffAttendance, currentProperty.id, selectedDate]);

  // Attendance stats for selected date
  const attendanceMetrics = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let halfDay = 0;
    propertyStaff.forEach(s => {
      const rec = dayAttendanceMap.get(s.id);
      const st = rec?.status?.toLowerCase();
      if (!rec || st === 'present') present++;
      else if (st === 'absent') absent++;
      else if (st === 'leave' || st === 'approved leave') leave++;
      else if (st === 'half-day') halfDay++;
    });
    return { present, absent, leave, halfDay, total: propertyStaff.length };
  }, [propertyStaff, dayAttendanceMap]);

  // Payroll records for current property
  const propPayrollRecords = useMemo(() => {
    return payrollRecords.filter(p => p.propertyId === currentProperty.id);
  }, [payrollRecords, currentProperty.id]);

  const payrollTotals = useMemo(() => {
    const total = propPayrollRecords.reduce((sum, p) => sum + p.netPay, 0);
    const paid = propPayrollRecords.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.netPay, 0);
    const pending = total - paid;
    return { total, paid, pending };
  }, [propPayrollRecords]);

  // Leave requests for current property
  const propLeaves = useMemo(() => {
    return staffLeaves.filter(l => l.propertyId === currentProperty.id);
  }, [staffLeaves, currentProperty.id]);

  // Handlers
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addStaff({
      id: 'stf-' + Date.now(),
      propertyId: currentProperty.id,
      name,
      role,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@livora.io`,
      shift,
      assignedBlock,
      status: 'Active',
      joiningDate: todayStr,
      salaryType,
      basicSalary: Number(basicSalary) || 20000,
      emergencyContact: emergencyContact || '+91 98700 00000',
      bankDetails: {
        accountNumber: bankAccount || '987654321012',
        ifsc: ifsc || 'HDFC0001234',
        upiId: upiId || `${name.toLowerCase().replace(/\s+/g, '')}@okaxis`
      },
      avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 9999999)}?w=120&auto=format&fit=crop&q=80`
    });

    setIsAddStaffModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setEmergencyContact('');
    setBankAccount('');
  };

  const handleMarkAllPresent = () => {
    const batch: Omit<StaffAttendanceRecord, 'id'>[] = propertyStaff.map(s => ({
      staffId: s.id,
      staffName: s.name,
      propertyId: currentProperty.id,
      date: selectedDate,
      status: 'Present',
      checkInTime: s.shiftTiming?.split('–')[0]?.trim() || '09:00 AM',
      checkOutTime: s.shiftTiming?.split('–')[1]?.trim() || '06:00 PM',
      overtimeHours: 0
    }));
    batchMarkAttendance(batch);
  };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stf = propertyStaff.find(s => s.id === leaveStaffId);
    if (!stf || !leaveReason) return;

    applyStaffLeave({
      staffId: stf.id,
      staffName: stf.name,
      staffRole: stf.role,
      propertyId: currentProperty.id,
      leaveType: 'Casual',
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      daysCount: 1,
      reason: leaveReason
    });

    setIsApplyLeaveModalOpen(false);
    setLeaveReason('');
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTargetRecord) return;
    const ref = payoutRef || `${payoutMethod.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`;
    markPayrollPaid(payTargetRecord.id, payoutMethod, ref);
    setIsPayModalOpen(false);
    setPayTargetRecord(null);
    setPayoutRef('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">PG Workforce & Business Operations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Staff, Duty Roster & Payroll
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage caretakers, technicians, biometric attendance, monthly wages, and leave approvals.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === 'payroll' && (
            <button
              onClick={() => generateMonthlyPayroll('October 2026')}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run Oct 2026 Payroll</span>
            </button>
          )}

          {activeTab === 'leaves' && (
            <button
              onClick={() => {
                setLeaveStaffId(propertyStaff[0]?.id || '');
                setIsApplyLeaveModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Leave Request</span>
            </button>
          )}

          {activeTab === 'directory' && (
            <button
              onClick={() => setIsAddStaffModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Staff Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'directory'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff Directory ({propertyStaff.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Daily Attendance & Duty Register</span>
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payroll'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          <span>Salary & Monthly Payroll</span>
        </button>

        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leaves'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Leave Approvals ({propLeaves.filter(l => l.status?.toLowerCase() === 'pending').length} pending)</span>
        </button>
      </div>

      {/* TAB 1: STAFF DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-5">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by staff name, role, phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="All">All Roles</option>
                <option value="Caretaker">Caretaker</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Cook">Cook</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Security">Security</option>
                <option value="Maintenance Worker">Maintenance Worker</option>
              </select>
            </div>
          </div>

          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map(member => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {member.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Base Salary:</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{member.basicSalary ? member.basicSalary.toLocaleString('en-IN') : '20,000'}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Shift Timing:</span>
                      <span className="font-semibold text-slate-800">{member.shiftTiming || member.shift}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Assigned Zone:</span>
                      <span className="font-semibold text-slate-800">{member.assignedBlock}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tasks Completed:</span>
                      <span className="font-semibold text-emerald-700">{member.completedTasksCount || 34} resolved</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Emergency:</span>
                      <span className="text-slate-700 truncate max-w-[150px]">{member.emergencyContact || 'Available'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">{member.phone}</span>
                  <a
                    href={`tel:${member.phone}`}
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    Direct Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE & DUTY REGISTER */}
      {activeTab === 'attendance' && (
        <div className="space-y-5">
          {/* Controls & Quick Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Register Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            {/* Attendance Metrics summary */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-emerald-700">
                Present: <strong className="font-mono text-emerald-900">{attendanceMetrics.present}</strong>
              </span>
              <span className="text-amber-700">
                Half-Day: <strong className="font-mono text-amber-900">{attendanceMetrics.halfDay}</strong>
              </span>
              <span className="text-blue-700">
                Leave: <strong className="font-mono text-blue-900">{attendanceMetrics.leave}</strong>
              </span>
              <span className="text-rose-700">
                Absent: <strong className="font-mono text-rose-900">{attendanceMetrics.absent}</strong>
              </span>
            </div>

            <button
              onClick={handleMarkAllPresent}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
            >
              Mark All Present (On Time)
            </button>
          </div>

          {/* Daily Register Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role & Zone</th>
                    <th className="py-3 px-4">Scheduled Shift</th>
                    <th className="py-3 px-4">Biometric In/Out</th>
                    <th className="py-3 px-4">Attendance Status</th>
                    <th className="py-3 px-4 text-right">Overtime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {propertyStaff.map(member => {
                    const record = dayAttendanceMap.get(member.id);
                    const currentStatus = record?.status || 'Present';
                    const checkIn = record?.checkInTime || record?.checkIn || '09:00 AM';
                    const checkOut = record?.checkOutTime || record?.checkOut || '06:00 PM';
                    const ot = record?.overtimeHours || 0;

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{member.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{member.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{member.role}</div>
                          <div className="text-[11px] text-slate-500">{member.assignedBlock}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {member.shiftTiming || '09:00 AM – 06:00 PM'}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {checkIn} → {checkOut}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {(['Present', 'Half-Day', 'Absent', 'Approved Leave'] as AttendanceStatus[]).map(st => {
                              const isMatch = currentStatus.toLowerCase() === st.toLowerCase();
                              return (
                                <button
                                  key={st}
                                  onClick={() => {
                                    markAttendance({
                                      staffId: member.id,
                                      staffName: member.name,
                                      propertyId: currentProperty.id,
                                      date: selectedDate,
                                      status: st,
                                      checkInTime: st === 'Absent' ? undefined : checkIn,
                                      checkOutTime: st === 'Absent' ? undefined : checkOut,
                                      overtimeHours: ot
                                    });
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize transition-colors ${
                                    isMatch
                                      ? st === 'Present'
                                        ? 'bg-emerald-600 text-white'
                                        : st === 'Half-Day'
                                        ? 'bg-amber-600 text-white'
                                        : st === 'Approved Leave'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-rose-600 text-white'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {st === 'Approved Leave' ? 'Leave' : st}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-semibold text-slate-700">
                            {ot > 0 ? `+${ot} hrs` : '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SALARY & MONTHLY PAYROLL */}
      {activeTab === 'payroll' && (
        <div className="space-y-5">
          {/* Payroll KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
                <span>Total Monthly Payroll</span>
                <DollarSign className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                ₹{payrollTotals.total.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Calculated via LIVORA net formula</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
                <span>Disbursed & Processed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                ₹{payrollTotals.paid.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Synced to PG Operating Expenses</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1 text-xs">
                <span>Pending Disbursal</span>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-700 font-mono">
                ₹{payrollTotals.pending.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Awaiting owner payout verification</p>
            </div>
          </div>

          {/* Formula Callout */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Net Pay Formula:</strong> Basic Pay + Approved Overtime + Duty Allowances − Statutory Deductions − Salary Advance Recovery
              </span>
            </div>
          </div>

          {/* Payroll Records Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Pay Period</th>
                    <th className="py-3 px-4">Basic Wage</th>
                    <th className="py-3 px-4">Overtime + Allowances</th>
                    <th className="py-3 px-4">Deductions / Advance</th>
                    <th className="py-3 px-4 font-mono">Net Payable</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {propPayrollRecords.map(record => {
                    const stf = propertyStaff.find(s => s.id === record.staffId);
                    return (
                      <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{record.staffName}</div>
                          <div className="text-[11px] text-slate-500">{record.staffRole}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {record.month}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          ₹{record.basicPay.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-700">
                          +₹{(record.overtimePay + record.allowances).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono text-rose-700">
                          -₹{(record.deductions + record.advanceRecovery).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                          ₹{record.netPay.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            record.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : record.status === 'Approved'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedPayrollRecord(record)}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Payslip</span>
                            </button>

                            {record.status !== 'Paid' && (
                              <button
                                onClick={() => {
                                  setPayTargetRecord(record);
                                  setIsPayModalOpen(true);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>Disburse</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEAVE REQUESTS */}
      {activeTab === 'leaves' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Date Span</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {propLeaves.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No leave requests submitted yet.
                      </td>
                    </tr>
                  ) : (
                    propLeaves.map(leave => (
                      <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {leave.staffName}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {leave.startDate} {leave.endDate !== leave.startDate ? `to ${leave.endDate}` : ''}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {leave.daysCount} day(s)
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                          {leave.reason}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            leave.status?.toLowerCase() === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : leave.status?.toLowerCase() === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {leave.status?.toLowerCase() === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => reviewStaffLeave(leave.id, 'approved', 'Approved by warden')}
                                className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => reviewStaffLeave(leave.id, 'rejected', 'Staff shortage during this shift')}
                                className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Reviewed by {leave.reviewedBy || leave.approvedBy || 'Admin'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        title="Enroll PG Staff Member"
        subtitle={`Register personnel for ${currentProperty.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleAddStaffSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Designation *</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as Staff['role'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              >
                <option value="Caretaker">Caretaker</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Cook">Cook / Kitchen</option>
                <option value="Security">Security Guard</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Maintenance Worker">Maintenance Worker</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Shift Timings *</label>
              <input
                type="text"
                placeholder="09:00 AM – 06:00 PM"
                value={shift}
                onChange={e => setShift(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Base Monthly Wage (₹) *</label>
              <input
                type="number"
                required
                placeholder="20000"
                value={basicSalary}
                onChange={e => setBasicSalary(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Zone</label>
              <input
                type="text"
                placeholder="Wing A, Dining Hall, etc."
                value={assignedBlock}
                onChange={e => setAssignedBlock(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
              <input
                type="text"
                placeholder="+91 98700 00000 (Spouse)"
                value={emergencyContact}
                onChange={e => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddStaffModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* Disburse Pay Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Disburse Staff Salary"
        subtitle={payTargetRecord ? `Approve payout for ${payTargetRecord.staffName} (${payTargetRecord.month})` : ''}
        maxWidth="sm"
      >
        {payTargetRecord && (
          <form onSubmit={handlePayoutSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee:</span>
                <span className="font-bold text-slate-900">{payTargetRecord.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pay Period:</span>
                <span className="font-semibold text-slate-800">{payTargetRecord.month}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1">
                <span className="font-bold text-slate-700">Net Payable:</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  ₹{payTargetRecord.netPay.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Disbursal Method *</label>
              <select
                value={payoutMethod}
                onChange={e => setPayoutMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
              >
                <option value="UPI">UPI (Instant Transfer)</option>
                <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                <option value="Cash">Cash in Hand</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Reference / UTR</label>
              <input
                type="text"
                placeholder="e.g. UTR-982138764 or UPI-TXN-112233"
                value={payoutRef}
                onChange={e => setPayoutRef(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Confirm Payout
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Submit Leave Modal */}
      <Modal
        isOpen={isApplyLeaveModalOpen}
        onClose={() => setIsApplyLeaveModalOpen(false)}
        title="Submit Staff Leave Request"
        subtitle="Log employee leave application"
        maxWidth="sm"
      >
        <form onSubmit={handleApplyLeaveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Employee *</label>
            <select
              value={leaveStaffId}
              onChange={e => setLeaveStaffId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            >
              {propertyStaff.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={leaveStartDate}
                onChange={e => setLeaveStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={leaveEndDate}
                onChange={e => setLeaveEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Leave *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Family emergency, medical checkup, festival visit"
              value={leaveReason}
              onChange={e => setLeaveReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsApplyLeaveModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* Salary Slip Modal */}
      <SalarySlipModal
        isOpen={Boolean(selectedPayrollRecord)}
        onClose={() => setSelectedPayrollRecord(null)}
        record={selectedPayrollRecord}
        staff={propertyStaff.find(s => s.id === selectedPayrollRecord?.staffId)}
        property={currentProperty}
      />
    </div>
  );
};
