import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Bell, 
  Shield, 
  Smartphone, 
  Moon, 
  Lock, 
  CheckCircle2, 
  Save, 
  User, 
  Mail, 
  Phone,
  FileCheck
} from 'lucide-react';

export const StudentSettingsView: React.FC = () => {
  const { currentStudent, showToast } = useApp();

  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [rentReminders, setRentReminders] = useState(true);
  const [messUpdates, setMessUpdates] = useState(true);
  const [gatePassNotification, setGatePassNotification] = useState(true);
  const [cleaningAlerts, setCleaningAlerts] = useState(false);

  const [phone, setPhone] = useState(currentStudent?.phone || '+91 98765 43210');
  const [emergencyPhone, setEmergencyPhone] = useState(currentStudent?.emergencyContact || currentStudent?.guardian?.phone || '+91 98765 00000');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences Saved', 'Your communication and notification preferences were updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Resident Settings & Preferences</h1>
            <p className="text-xs sm:text-sm text-slate-500">Configure alert channels, privacy options, and personal contacts</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Verified Communication Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Registered Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Emergency Contact (Parent / Guardian)</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              Notification Subscriptions
            </h3>

            <div className="space-y-3">
              {[
                { label: 'Instant WhatsApp Rent Receipts & Invoices', desc: 'Receive automated PDF receipts right after rent payments are confirmed.', checked: whatsappAlerts, setChecked: setWhatsappAlerts },
                { label: 'Upcoming Rent & Due Date Reminders', desc: 'Get gentle reminders 3 days and 1 day prior to invoice due date.', checked: rentReminders, setChecked: setRentReminders },
                { label: 'Daily Mess Menu & Special Meal Alerts', desc: 'Receive a preview of today’s lunch and special weekend dinners.', checked: messUpdates, setChecked: setMessUpdates },
                { label: 'Biometric Gate In/Out Activity Logs', desc: 'SMS alert sent to registered number whenever biometric turnstile is tapped after 10:00 PM.', checked: gatePassNotification, setChecked: setGatePassNotification },
                { label: 'Daily Housekeeping Room Service Alert', desc: 'Notification when your floor housekeeper begins daily room mopping and waste collection.', checked: cleaningAlerts, setChecked: setCleaningAlerts },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.label}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={(e) => item.setChecked(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Access */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-teal-700" />
              <div>
                <h4 className="text-sm font-bold text-teal-950">Biometric & RFID Digital Room Key</h4>
                <p className="text-xs text-teal-800">Card Serial: LIV-2026-RFID-0921 • Active & Synced</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-200 text-teal-900">
              Synced
            </span>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-teal-400" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
