import React from 'react';
import { BedStatus, PaymentStatus, ComplaintStatus, ComplaintPriority, RequestStatus } from '../../types';

export const BedStatusBadge: React.FC<{ status: BedStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const configs = {
    available: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500', label: 'Available' },
    occupied: { bg: 'bg-blue-50 text-blue-700 border-blue-200/80', dot: 'bg-blue-500', label: 'Occupied' },
    reserved: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500', label: 'Reserved' },
    maintenance: { bg: 'bg-rose-50 text-rose-700 border-rose-200/80', dot: 'bg-rose-500', label: 'Maintenance' },
    blocked: { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-600', label: 'Blocked' },
  };

  const config = configs[status] || configs.available;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const configs = {
    paid: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Paid' },
    pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
    overdue: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Overdue' },
    partial: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Partially Paid' },
  };

  const config = configs[status] || configs.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}>
      {config.label}
    </span>
  );
};

export const ComplaintStatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  const configs: Record<ComplaintStatus, { bg: string; label: string }> = {
    'Submitted': { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Submitted' },
    'Pending Review': { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending Review' },
    'Assigned': { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Assigned' },
    'In Progress': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'In Progress' },
    'Completed': { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Completed' },
    'Verified': { bg: 'bg-teal-50 text-teal-700 border border-teal-200', label: 'Verified' },
    'Reopened': { bg: 'bg-rose-50 text-rose-700 border border-rose-200', label: 'Reopened' },
    'Closed': { bg: 'bg-slate-200 text-slate-800 border border-slate-300', label: 'Closed' },
  };

  const config = configs[status] || configs['Submitted'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}>
      {config.label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: ComplaintPriority }> = ({ priority }) => {
  const configs = {
    low: { bg: 'bg-slate-100 text-slate-600', label: 'Low' },
    medium: { bg: 'bg-blue-50 text-blue-700', label: 'Medium' },
    high: { bg: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'High' },
    urgent: { bg: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold animate-pulse', label: 'Urgent' },
  };

  const config = configs[priority] || configs.medium;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${config.bg}`}>
      {config.label}
    </span>
  );
};

export const RequestStatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const configs = {
    'Submitted': 'bg-slate-100 text-slate-700 border-slate-200',
    'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${configs[status]}`}>
      {status}
    </span>
  );
};
