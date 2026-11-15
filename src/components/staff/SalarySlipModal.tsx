import React from 'react';
import { PayrollRecord, Staff, Property } from '../../types';
import { Modal } from '../common/Modal';
import { Printer, Download, CheckCircle, Clock, Building2, User } from 'lucide-react';

interface SalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
  staff: Staff | undefined;
  property: Property;
}

export const SalarySlipModal: React.FC<SalarySlipModalProps> = ({
  isOpen,
  onClose,
  record,
  staff,
  property
}) => {
  if (!record) return null;

  const totalEarnings = record.basicPay + record.overtimePay + record.allowances;
  const totalDeductions = record.deductions + record.advanceRecovery;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Salary Slip — ${record.month}`}
      subtitle={`Official payment voucher for ${record.staffName} (${record.staffRole})`}
      maxWidth="lg"
    >
      <div className="space-y-6 print:p-6" id="printable-salary-slip">
        {/* Header Voucher */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
                {property.name}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              LIVORA Staff Payroll Voucher
            </h3>
            <p className="text-xs text-slate-300">
              Pay Period: <span className="font-semibold text-white">{record.month}</span> • Slip Ref: <span className="font-mono text-amber-300">{record.id.toUpperCase()}</span>
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-700/60">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Net Disbursal</span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              ₹{record.netPay.toLocaleString('en-IN')}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              {record.status === 'Paid' ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Paid on {record.paymentDate || 'Recorded'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Payment Pending Approval
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Staff & Payment Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              Employee Information
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Employee Name:</span>
              <span className="font-bold text-slate-900">{record.staffName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Designation / Role:</span>
              <span className="font-semibold text-indigo-700">{record.staffRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Staff ID:</span>
              <span className="font-mono text-slate-800">{record.staffId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Emergency Contact:</span>
              <span className="text-slate-800">{staff?.emergencyContact || '+91 98701 99999'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Disbursal & Bank Record
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Channel:</span>
              <span className="font-semibold text-slate-900">{record.paymentMethod || 'Bank Transfer'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Account Number:</span>
              <span className="font-mono text-slate-800">
                {staff?.bankDetails?.accountNumber 
                  ? `•••• •••• ${staff.bankDetails.accountNumber.slice(-4)}` 
                  : 'HDFC •••• 1928'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">IFSC Code:</span>
              <span className="font-mono text-slate-800">{staff?.bankDetails?.ifsc || 'HDFC0001234'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Transaction Ref:</span>
              <span className="font-mono text-emerald-700 font-semibold">{record.transactionReference || 'REF-DISB-OCT26'}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Calculation Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Earnings */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Earnings (+)</span>
              <span className="text-xs font-bold text-emerald-700 font-mono">₹{totalEarnings.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">Basic Monthly Wage</span>
                <span className="font-mono font-semibold text-slate-900">₹{record.basicPay.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">Approved Overtime Hours</span>
                <span className="font-mono font-semibold text-emerald-700">+ ₹{record.overtimePay.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">Food & Duty Allowances</span>
                <span className="font-mono font-semibold text-emerald-700">+ ₹{record.allowances.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-50 px-4 py-2.5 border-b border-rose-100 flex justify-between items-center">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">Deductions (-)</span>
              <span className="text-xs font-bold text-rose-700 font-mono">₹{totalDeductions.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 divide-y divide-slate-100 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">Statutory / PF & Insurance</span>
                <span className="font-mono font-semibold text-rose-700">- ₹{record.deductions.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-600">Salary Advance Recovery</span>
                <span className="font-mono font-semibold text-rose-700">- ₹{record.advanceRecovery.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500 italic">Net Deductions Applied</span>
                <span className="font-mono text-slate-500">₹{totalDeductions.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Formula Summary */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-900">LIVORA Certified Payroll Formula:</span>{' '}
          <code className="text-indigo-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
            Net Pay = Basic (₹{record.basicPay}) + Overtime (₹{record.overtimePay}) + Allowances (₹{record.allowances}) − Deductions (₹{record.deductions}) − Advance Recovery (₹{record.advanceRecovery})
          </code>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Payslip</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
