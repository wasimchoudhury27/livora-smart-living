import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { LogOut, DollarSign, CheckSquare, AlertTriangle, Printer } from 'lucide-react';

interface CheckoutModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const { checkoutStudent, showToast } = useApp();

  const [damageDeductions, setDamageDeductions] = useState<number>(0);
  const [damageNotes, setDamageNotes] = useState<string>('');
  const [keysReturned, setKeysReturned] = useState<boolean>(true);
  const [inventoryInspected, setInventoryInspected] = useState<boolean>(true);

  if (!student) return null;

  const pendingDues = student.paymentStatus === 'overdue' || student.paymentStatus === 'pending'
    ? student.monthlyFee
    : student.paymentStatus === 'partial'
    ? student.monthlyFee / 2
    : 0;

  const totalDeductions = pendingDues + Number(damageDeductions || 0);
  const netRefund = Math.max(0, student.securityDeposit - totalDeductions);
  const balancePayableByStudent = totalDeductions > student.securityDeposit ? totalDeductions - student.securityDeposit : 0;

  const handleConfirmCheckout = () => {
    checkoutStudent(student.id);
    showToast('Check-Out Processed', `${student.name} checked out. Bed is now available.`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Check-Out & Security Deposit Settlement"
      subtitle={`Processing departure for ${student.name} • Room ${student.roomId.replace('rm-', '')}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Resident Summary Strip */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Resident:</span>{' '}
            <strong className="text-slate-900">{student.name}</strong>
          </div>
          <div>
            <span className="text-slate-500">Joined:</span>{' '}
            <strong className="text-slate-900">{student.joiningDate}</strong>
          </div>
          <div>
            <span className="text-slate-500">Bed Code:</span>{' '}
            <strong className="text-slate-900 font-mono">{student.bedId.split('-').pop()?.toUpperCase()}</strong>
          </div>
        </div>

        {/* Room Inspection Checklist */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Clearance Checklist
          </h4>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={keysReturned}
              onChange={e => setKeysReturned(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Room key & RFID access card returned</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={inventoryInspected}
              onChange={e => setInventoryInspected(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Wardrobe, study table, mattress & switchboards verified</span>
          </label>
        </div>

        {/* Financial Settlement Calculator */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Deposit Settlement Ledger
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Initial Security Deposit Held:</span>
              <span className="font-bold text-slate-900">₹{student.securityDeposit.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-rose-600">
              <span>Unpaid Monthly Fees:</span>
              <span className="font-semibold">- ₹{pendingDues.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">Maintenance / Damage Charges:</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  value={damageDeductions}
                  onChange={e => setDamageDeductions(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono text-right"
                />
              </div>
            </div>

            {damageDeductions > 0 && (
              <input
                type="text"
                placeholder="Reason for damage deduction (e.g. wall repaint, broken latch)"
                value={damageNotes}
                onChange={e => setDamageNotes(e.target.value)}
                className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded bg-white"
              />
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-900">Net Refund Payable to Resident:</span>
              <span className="text-emerald-600 text-base">₹{netRefund.toLocaleString('en-IN')}</span>
            </div>

            {balancePayableByStudent > 0 && (
              <div className="p-2 rounded bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Resident owes an additional ₹{balancePayableByStudent.toLocaleString('en-IN')} over deposit!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!keysReturned || !inventoryInspected}
            onClick={handleConfirmCheckout}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Complete Settlement & Free Bed</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
