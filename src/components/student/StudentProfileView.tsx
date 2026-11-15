import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  FileText, 
  GraduationCap, 
  Calendar, 
  Heart, 
  AlertTriangle 
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentStudent, currentProperty } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center gap-5">
        <img
          src={currentStudent?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt="Rahul Sharma"
          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-100 shrink-0"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentStudent?.name || 'Rahul Sharma'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Verified Resident
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Student ID: <strong>{currentStudent?.id}</strong> · Joined: {currentStudent?.joiningDate}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1 font-semibold">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Room 401 (Bed A) · {currentProperty.name}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentStudent?.email}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{currentStudent?.phone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Info Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic & Personal */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Academic & Personal Details</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">College / Institution</span>
              <span className="font-bold text-slate-800">{currentStudent?.collegeOrWork}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Gender</span>
              <span className="font-bold text-slate-800">{currentStudent?.gender}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-bold text-slate-800">{currentStudent?.bloodGroup || 'B+'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Monthly Rent</span>
              <span className="font-bold text-slate-800">₹{currentStudent?.monthlyFee.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Security Deposit</span>
              <span className="font-bold text-slate-800">₹{currentStudent?.securityDeposit.toLocaleString('en-IN')} (Secured)</span>
            </div>
          </div>
        </div>

        {/* Guardian & Emergency */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Parent / Guardian & Emergency Contact</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Guardian Name</span>
              <span className="font-bold text-slate-800">{currentStudent?.guardian?.name || 'Sunil Sharma'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Relationship</span>
              <span className="font-bold text-slate-800">{currentStudent?.guardian?.relationship || 'Father'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Guardian Phone</span>
              <span className="font-bold text-slate-800 font-mono">{currentStudent?.guardian?.phone || '+91 98200 11223'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Home Address</span>
              <span className="font-bold text-slate-800 text-right">{currentStudent?.guardian?.address || 'Civil Lines, Jaipur'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">24/7 Emergency Phone</span>
              <span className="font-bold text-rose-600 font-mono">{currentStudent?.emergencyContact || '+91 98200 11223'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Documents */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" />
          <span>Verified Documents & Tenancy Records</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Verified Aadhaar
            </span>
            <div className="text-xs font-bold text-slate-800 pt-1">
              Government Identity Card
            </div>
            <div className="text-[11px] text-slate-500">
              Uploaded on Admission
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Verified College ID
            </span>
            <div className="text-xs font-bold text-slate-800 pt-1">
              Christ University MCA
            </div>
            <div className="text-[11px] text-slate-500">
              Valid through 2027
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Signed Contract
            </span>
            <div className="text-xs font-bold text-slate-800 pt-1">
              Tenancy Agreement
            </div>
            <div className="text-[11px] text-slate-500">
              11-Month Term Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
