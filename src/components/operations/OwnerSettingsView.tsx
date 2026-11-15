import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Building2, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Save, 
  Database, 
  CheckCircle2, 
  RotateCcw,
  Sliders
} from 'lucide-react';

export const OwnerSettingsView: React.FC = () => {
  const { currentProperty, showToast } = useApp();

  const [propertyName, setPropertyName] = useState(currentProperty?.name || 'LIVORA Elite Residency');
  const [rentDueDay, setRentDueDay] = useState('5');
  const [lateFeeAmount, setLateFeeAmount] = useState('500');
  const [gracePeriodDays, setGracePeriodDays] = useState('3');
  const [gstRate, setGstRate] = useState('12');
  const [autoInvoicing, setAutoInvoicing] = useState(true);
  const [autoSmsReminder, setAutoSmsReminder] = useState(true);
  const [biometricSync, setBiometricSync] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform Settings Saved', 'Billing cycles, grace period, and property automation settings were updated.', 'success');
  };

  const handleResetData = () => {
    showToast('Data Synced', 'Local demo database cache validated against schema.', 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Workspace & Property Settings</h1>
              <p className="text-xs sm:text-sm text-slate-500">Global billing cycles, automation rules, and operational policies</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Owner Access
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* General Property Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              Property Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Property Display Name</label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Primary Campus Address</label>
                <input
                  type="text"
                  defaultValue="Plot 42, Knowledge Park III, Greater Noida"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Billing & Rent Cycles */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" />
              Rent Billing Engine
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Rent Due Day of Month</label>
                <select
                  value={rentDueDay}
                  onChange={(e) => setRentDueDay(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                >
                  <option value="1">1st of month</option>
                  <option value="5">5th of month (Standard)</option>
                  <option value="10">10th of month</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Grace Period (Days)</label>
                <input
                  type="number"
                  value={gracePeriodDays}
                  onChange={(e) => setGracePeriodDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Default Late Penalty (₹)</label>
                <input
                  type="number"
                  value={lateFeeAmount}
                  onChange={(e) => setLateFeeAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Automation Toggles */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              Automations & Triggers
            </h3>

            {[
              { label: 'Auto-Generate Monthly Invoices on 1st of Month', desc: 'Creates itemized pending ledger entries for every active resident.', checked: autoInvoicing, setChecked: setAutoInvoicing },
              { label: 'Automated WhatsApp & SMS Due Date Reminders', desc: 'Dispatches reminder notifications 3 days before due date.', checked: autoSmsReminder, setChecked: setAutoSmsReminder },
              { label: 'Real-time Biometric Turnstile Sync', desc: 'Restricts gate access if resident checkout is finalized.', checked: biometricSync, setChecked: setBiometricSync }
            ].map((sw, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{sw.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{sw.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    checked={sw.checked} 
                    onChange={(e) => sw.setChecked(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetData}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Verify Database Cache</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-teal-400" />
              <span>Save Configurations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
