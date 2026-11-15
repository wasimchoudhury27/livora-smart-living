import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface StudentPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  monthFor?: string;
}

export const StudentPayModal: React.FC<StudentPayModalProps> = ({
  isOpen,
  onClose,
  amount = 8000,
  monthFor = 'October 2026',
}) => {
  const { currentStudent, currentProperty, recordPayment, showToast } = useApp();
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('rahul.sharma@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    setIsProcessing(true);

    setTimeout(() => {
      recordPayment({
        propertyId: currentProperty.id,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        roomNumber: '401',
        bedCode: 'Bed A',
        amount,
        monthFor,
        paymentDate: new Date().toISOString().split('T')[0],
        dueDate: '2026-10-05',
        paymentMethod: method === 'upi' ? 'UPI' : method === 'card' ? 'Card' : 'Bank Transfer',
        status: 'paid',
        transactionId: `PAY-${Date.now()}`,
        remainingBalance: 0,
        notes: `Paid online by ${currentStudent.name} via ${method.toUpperCase()}`,
      });

      setIsProcessing(false);
      setIsSuccess(true);
      showToast('Payment Successful! 🎉', `₹${amount.toLocaleString('en-IN')} paid for ${monthFor}. Receipt generated!`, 'success');
    }, 1000);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isProcessing ? () => {} : onClose}
      title={isSuccess ? "Payment Confirmation" : `Pay Hostel Rent — ₹${amount.toLocaleString('en-IN')}`}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Payment Completed Successfully!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ₹{amount.toLocaleString('en-IN')} settled for {monthFor} · Room 401 (Bed A)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Student:</span>
              <strong className="text-slate-800">{currentStudent?.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hostel:</span>
              <strong className="text-slate-800">{currentProperty.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono text-slate-800">TXN/{Date.now().toString().slice(-8)}</span>
            </div>
          </div>

          <button
            onClick={handleDone}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Done & View Updated Ledger
          </button>
        </div>
      ) : (
        <form onSubmit={handlePay} className="space-y-4">
          {/* Payment Amount Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-indigo-700 font-semibold">Total Payable</span>
              <div className="text-2xl font-black text-slate-900">₹{amount.toLocaleString('en-IN')}</div>
              <span className="text-[11px] text-slate-500">{monthFor} · Zero Convenience Fees</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-indigo-200">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('upi')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  method === 'upi'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span className="text-xs">UPI Apps</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  method === 'card'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span className="text-xs">Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('netbanking')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  method === 'netbanking'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span className="text-xs">Dynamic QR</span>
              </button>
            </div>
          </div>

          {method === 'upi' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Your UPI Virtual Payment Address (VPA)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="username@bank"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                <span>Supported:</span>
                <span className="font-semibold text-slate-600">GPay, PhonePe, Paytm, CRED</span>
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="Card Number (4532 •••• •••• ••••)"
                defaultValue="4532 9811 4452 1092"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  defaultValue="08/29"
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  defaultValue="889"
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          )}

          {method === 'netbanking' && (
            <div className="p-4 bg-slate-50 rounded-xl text-center space-y-2 border border-slate-200">
              <div className="w-24 h-24 mx-auto bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
              <div className="text-[11px] text-slate-500">
                Scan with any UPI app to pay ₹{amount.toLocaleString('en-IN')}
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit Encrypted StaySphere Gateway</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Authorizing Transaction...</span>
            ) : (
              <>
                <span>Complete Payment of ₹{amount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
};
