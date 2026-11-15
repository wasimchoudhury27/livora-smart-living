import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Logo } from '../common/Logo';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Wrench, 
  GraduationCap,
  Building
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, setRole, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [email, setEmail] = useState('admin@livora.app');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Owner');
  const [otp, setOtp] = useState(['4', '8', '2', '9']);

  const handleDemoLogin = (roleToSet: UserRole, label: string) => {
    setRole(roleToSet);
    showToast('Demo Access Granted', `Switched workspace to ${label}`, 'success');
    onClose();
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setMode('otp');
      showToast('OTP Dispatched', 'A 4-digit code was sent to your registered phone & email', 'info');
      return;
    }
    if (mode === 'otp') {
      showToast('Identity Verified', 'Password reset successfully. Logging you in...', 'success');
      setRole('Owner');
      onClose();
      return;
    }

    setRole(selectedRole);
    showToast('Signed In', `Welcome back to LIVORA as ${selectedRole}`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="md"
    >
      <div className="space-y-6 pt-1">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo size="lg" />
          </div>
          <p className="text-xs text-slate-500">
            {mode === 'login' && 'Sign in to access your digital hostel operating system'}
            {mode === 'signup' && 'Create your property account & start streamlining'}
            {mode === 'forgot' && 'Reset your password via verified mobile OTP'}
            {mode === 'otp' && 'Enter the 4-digit verification code sent to your phone'}
          </p>
        </div>

        {/* 1-Click Instant Demo Login Buttons */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-slate-50 border border-indigo-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              1-Click Demo Profiles
            </span>
            <span className="text-[10px] text-slate-400">Instant test drives</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('Owner', 'Owner / Admin')}
              className="p-2.5 rounded-xl bg-white hover:border-indigo-400 border border-slate-200 text-left transition-all shadow-2xs group flex flex-col items-center text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold mb-1 group-hover:scale-105 transition-transform">
                <Building className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Owner</div>
              <div className="text-[9px] text-slate-400">Full Control</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('Student', 'Aryan Sharma (Resident)')}
              className="p-2.5 rounded-xl bg-white hover:border-emerald-400 border border-slate-200 text-left transition-all shadow-2xs group flex flex-col items-center text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold mb-1 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Student</div>
              <div className="text-[9px] text-slate-400">Room 102</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('Maintenance', 'Imran Khan (Staff)')}
              className="p-2.5 rounded-xl bg-white hover:border-amber-400 border border-slate-200 text-left transition-all shadow-2xs group flex flex-col items-center text-center"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold mb-1 group-hover:scale-105 transition-transform">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Staff</div>
              <div className="text-[9px] text-slate-400">Electrician</div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or continue with credentials
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleStandardSubmit} className="space-y-4">
          {mode === 'otp' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 text-center">
                Enter 4-digit SMS OTP
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-600 focus:outline-hidden"
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {mode !== 'forgot' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Access Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
                  >
                    <option value="Owner">Property Owner / Admin</option>
                    <option value="Manager">Hostel Manager</option>
                    <option value="Accountant">Accountant / Cashier</option>
                    <option value="Student">Student / Resident</option>
                    <option value="Maintenance">Maintenance Staff</option>
                    <option value="Cleaner">Cleaning Staff</option>
                    <option value="Cook">Mess Cook</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>{mode === 'otp' ? 'Verify & Continue' : mode === 'forgot' ? 'Send Reset OTP' : 'Sign In to LIVORA'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="text-center text-xs text-slate-500 pt-1">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};
