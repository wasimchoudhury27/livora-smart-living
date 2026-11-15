import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Droplets, 
  Sparkles, 
  Zap, 
  Shirt, 
  Send, 
  CheckCircle2, 
  Clock, 
  Plus,
  Building2
} from 'lucide-react';

export const StudentRequestsView: React.FC = () => {
  const { currentStudent, currentProperty, serviceRequests, addServiceRequest, showToast } = useApp();

  const [selectedType, setSelectedType] = useState<'water' | 'cleaning' | 'electricity' | 'laundry'>('water');
  const [notes, setNotes] = useState('');

  // Filter requests for Rahul
  const myRequests = serviceRequests.filter(r => r.studentId === currentStudent?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    addServiceRequest({
      propertyId: currentProperty.id,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      roomNumber: '401',
      type: selectedType,
      notes: notes || `Standard ${selectedType} request for Room 401`,
    });

    setNotes('');
    showToast('Service Request Dispatched', `Your request for ${selectedType} was sent to housekeeping!`, 'success');
  };

  const services = [
    { type: 'water' as const, label: 'Drinking Water Can (20L)', icon: Droplets, desc: 'RO purified 20L jar delivery to Room 401', eta: '15-20 mins' },
    { type: 'cleaning' as const, label: 'Room & Restroom Cleaning', icon: Sparkles, desc: 'Deep sweep, mopping and trash removal', eta: 'Today by 3 PM' },
    { type: 'electricity' as const, label: 'Electrical Switch / Appliance Check', icon: Zap, desc: 'Inspection of light points or socket issues', eta: 'Within 2 hours' },
    { type: 'laundry' as const, label: 'Hostel Laundry Pickup', icon: Shirt, desc: 'Bi-weekly washing & ironing collection', eta: 'Daily 9 AM' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          Daily Convenience
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
          1-Tap Resident Service Requests
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Instantly request drinking water, housekeeping, and utility services directly to Room 401
        </p>
      </div>

      {/* Quick Request Dispatcher */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Select Service Type
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map(s => {
            const Icon = s.icon;
            const isSelected = selectedType === s.type;

            return (
              <div
                key={s.type}
                onClick={() => setSelectedType(s.type)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">{s.label}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-tight">{s.desc}</div>
                <div className="text-[10px] text-indigo-600 font-semibold mt-2">
                  Typical ETA: {s.eta}
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="pt-2 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Special Instructions or Timings (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Please deliver after 5:30 PM after college lectures..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Request to Housekeeping</span>
          </button>
        </form>
      </div>

      {/* History of Requests */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Recent Service Requests History
        </h2>

        {myRequests.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No service requests placed yet this month.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myRequests.map(r => (
              <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 capitalize">
                    {r.type} Service — Room 401
                  </span>
                  <div className="text-[11px] text-slate-500">
                    {r.description || r.title} · Requested {r.createdAt}
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  r.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
