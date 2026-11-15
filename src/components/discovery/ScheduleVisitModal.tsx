import React, { useState } from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, User, Phone, Mail, BedDouble, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ScheduleVisitModalProps {
  property: Property;
  onClose: () => void;
  initialType?: 'schedule_visit' | 'reserve_bed';
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  property,
  onClose,
  initialType = 'schedule_visit'
}) => {
  const { addEnquiry, showToast } = useApp();

  const [bookingType, setBookingType] = useState<'schedule_visit' | 'reserve_bed'>(initialType);
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sharingPreference, setSharingPreference] = useState<'Single' | 'Double' | 'Triple' | 'Any'>('Double');
  const [moveInDate, setMoveInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) {
      showToast('Missing Details', 'Please provide your full name and phone number', 'warning');
      return;
    }

    const created = addEnquiry({
      propertyId: property.id,
      propertyName: property.name,
      studentName: studentName.trim(),
      phone: phone.trim(),
      email: email.trim() || `${studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      sharingPreference,
      moveInDate,
      type: bookingType,
      notes: `${notes ? notes + ' | ' : ''}Preferred Time: ${preferredTime}`
    });

    setEnquiryRef(created.id);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {bookingType === 'schedule_visit' ? 'Schedule a Physical Campus Visit' : 'Reserve a Bed / Admission Enquiry'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {property.name} · {property.listingDetails?.localityName || property.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto border border-teal-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Request Confirmed!</h4>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Your request has been delivered directly to <span className="font-semibold text-slate-800">{property.managerName}</span> (Property Manager).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Reference ID:</span>
                <span className="font-mono font-semibold text-slate-900">{enquiryRef}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Property:</span>
                <span className="font-medium text-slate-800">{property.name}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Visit / Target Date:</span>
                <span className="font-medium text-slate-800">{moveInDate} ({preferredTime})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Sharing Option:</span>
                <span className="font-medium text-slate-800">{sharingPreference} Sharing</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 bg-emerald-50 py-2 px-3 rounded-lg max-w-sm mx-auto">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero booking commission. Verified LIVORA Guarantee.</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              Done & Return to Listings
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Toggle Mode */}
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBookingType('schedule_visit')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  bookingType === 'schedule_visit'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Schedule Free Campus Visit
              </button>
              <button
                type="button"
                onClick={() => setBookingType('reserve_bed')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  bookingType === 'reserve_bed'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reserve Bed / Admission
              </button>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vikram.sharma@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Sharing Preference & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Room Sharing Type
                </label>
                <div className="relative">
                  <BedDouble className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={sharingPreference}
                    onChange={e => setSharingPreference(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    <option value="Single">Single Occupancy</option>
                    <option value="Double">Double Sharing</option>
                    <option value="Triple">Triple Sharing</option>
                    <option value="Any">Any Available Option</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {bookingType === 'schedule_visit' ? 'Visit Date' : 'Target Move-in Date'}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={e => setMoveInDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {bookingType === 'schedule_visit' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Visit Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={preferredTime}
                    onChange={e => setPreferredTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    <option value="10:00 AM">10:00 AM - Morning Slot</option>
                    <option value="11:30 AM">11:30 AM - Before Lunch</option>
                    <option value="02:30 PM">02:30 PM - Afternoon Slot</option>
                    <option value="05:00 PM">05:00 PM - Evening Tour</option>
                    <option value="06:30 PM">06:30 PM - Post College / Work</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Requests or Questions
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Need attached washroom, college is Christ University, diet preferences..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
              >
                {bookingType === 'schedule_visit' ? 'Confirm Free Campus Visit' : 'Submit Admission Reservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
