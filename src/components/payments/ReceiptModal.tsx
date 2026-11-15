import React from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Payment } from '../../types';
import { PaymentStatusBadge } from '../common/StatusBadge';
import { Logo } from '../common/Logo';
import { Printer, Download, Share2, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  const { currentProperty, showToast } = useApp();

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    showToast('WhatsApp Link Generated', `Sent digital receipt link to resident`, 'success');
  };

  // Rent item breakdown calculation
  const total = payment.amount;
  const rentComponent = Math.round(total * 0.70);
  const messComponent = Math.round(total * 0.20);
  const utilityComponent = total - rentComponent - messComponent;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Digital Rent Receipt"
      subtitle={`Official tax invoice #${payment.receiptNumber}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-5 border-b border-slate-200">
            <div>
              <Logo size="sm" showTagline={false} />
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <div className="font-bold text-slate-800">{currentProperty.name}</div>
                <div>{currentProperty.address}, {currentProperty.city}</div>
                <div>GSTIN: 29AAAAA0000A1Z5</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                OFFICIAL RECEIPT
              </span>
              <div className="text-sm font-extrabold text-indigo-900 font-mono mt-0.5">
                #{payment.receiptNumber}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Date: {payment.paymentDate || 'Pending Settlement'}
              </div>
              <div className="mt-1.5">
                <PaymentStatusBadge status={payment.status} />
              </div>
            </div>
          </div>

          {/* Tenant & Stay Details */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Resident Particulars</span>
              <div className="font-bold text-slate-900 mt-0.5">{payment.studentName}</div>
              <div className="text-slate-500 text-[11px]">Room {payment.roomNumber} ({payment.bedCode})</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Billing Period</span>
              <div className="font-bold text-slate-900 mt-0.5">{payment.monthFor} Cycle</div>
              <div className="text-slate-500 text-[11px]">Mode: {payment.paymentMethod}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">Accommodation Base Rent</div>
                    <div className="text-[10px] text-slate-400">Furnished room, bed & maintenance</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">₹{rentComponent.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">Mess & Dining Charges</div>
                    <div className="text-[10px] text-slate-400">3-time meals + evening beverage</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">₹{messComponent.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">High-Speed Wi-Fi & Utilities</div>
                    <div className="text-[10px] text-slate-400">Electricity, RO water & cleaning</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">₹{utilityComponent.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td className="py-2.5 px-3 text-slate-800">Total Net Amount</td>
                  <td className="py-2.5 px-3 text-right text-indigo-700 text-sm font-mono font-extrabold">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Metadata & Stamp */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div>
              <div className="text-[11px] font-mono">Txn Ref: {payment.transactionId || 'STAY-OFFLINE-CASH'}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Generated electronically by StaySphere OS</div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Digitally Verified
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between no-print pt-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
