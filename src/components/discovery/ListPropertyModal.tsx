import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import { X, Building2, MapPin, User, Phone, DollarSign, ShieldAlert, Check, Plus } from 'lucide-react';

interface ListPropertyModalProps {
  onClose: () => void;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({ onClose }) => {
  const { addProperty, showToast } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<'Hostel' | 'PG' | 'Co-Living'>('PG');
  const [gender, setGender] = useState<'Boys' | 'Girls' | 'Co-ed'>('Co-ed');
  const [locality, setLocality] = useState('Koramangala');
  const [address, setAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [startingPrice, setStartingPrice] = useState(8500);
  const [amenities, setAmenities] = useState<string[]>([
    'High-speed Wi-Fi',
    '3-Time Mess',
    '24x7 Power Backup',
    'Biometric Entry',
    'Daily Housekeeping'
  ]);

  const availableAmenities = [
    'High-speed Wi-Fi',
    '3-Time Mess',
    'Homestyle Food',
    '24x7 Power Backup',
    'Biometric Entry',
    'Daily Housekeeping',
    'Gym & Recreation',
    'Lift',
    'CCTV Security',
    'RO Water Dispenser',
    'AC Rooms',
    'Laundry Service'
  ];

  const toggleAmenity = (item: string) => {
    setAmenities(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !managerName.trim()) {
      showToast('Incomplete Form', 'Please fill all required property information', 'warning');
      return;
    }

    const newPropertyId = `prop-${Date.now().toString().slice(-4)}`;
    const newProperty: Property = {
      id: newPropertyId,
      name: name.trim(),
      code: `${name.substring(0, 3).toUpperCase()}-BLR`,
      type,
      address: address.trim(),
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      managerName: managerName.trim(),
      managerPhone: managerPhone.trim() || '+91 98000 00000',
      amenities,
      totalRooms: 20,
      totalBeds: 40,
      occupiedBeds: 0,
      publicListing: true,
      listingDetails: {
        tagline: `${name} — Registered Accommodation on LIVORA`,
        description: `${name} is an accommodation located in ${locality}, Bangalore. Currently enrolled in LIVORA smart property management with quality inspection scheduled.`,
        photos: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&auto=format&fit=crop&q=80'
        ],
        gender,
        startingPrice: Number(startingPrice),
        depositMonths: 2,
        noticePeriodDays: 30,
        curfewTime: '11:00 PM',
        visitorPolicy: 'Common lounge access until 8:00 PM',
        livabilityScore: 70, // Baseline entry score
        cityRank: 99, // Unverified rank
        localityRank: 10,
        localityName: locality,
        totalReviewsCount: 0,
        avgRating: 0,
        avgComplaintResolutionHours: 4.0,
        foodRating: 3.8,
        cleanlinessScore: 75,
        verifiedStatus: 'pending_audit', // Complies with: Newly registered properties do not automatically become verified
        featuredBadge: '⏳ Audit Underway',
        nearestLandmark: `Near ${locality} main cross`,
        distanceToCampusOrMetro: 'Within walking distance of transit stops',
        coordinates: { lat: 12.9352, lng: 77.6245 },
        roomPricingSummary: {
          single: Number(startingPrice) + 4000,
          double: Number(startingPrice)
        },
        verifiedReviews: []
      },
      buildings: [
        {
          id: `bldg-${newPropertyId}`,
          propertyId: newPropertyId,
          name: 'Main Block',
          floors: []
        }
      ]
    };

    addProperty(newProperty);
    showToast('Listing Submitted!', `${name} registered in "Pending Verification" status. Physical hygiene audit initiated.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              List Your Hostel or PG on LIVORA
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Join Bangalore's verified multi-property discovery network.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Policy Banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Transparent Verification Standard:</span> Newly registered properties appear with an <span className="font-semibold text-amber-800">"Audit Pending"</span> badge. Top rankings and verified badges are only unlocked after physical inspection by a LIVORA campus auditor and at least 15 verified student reviews.
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hostel / PG Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Royal Heights Student PG"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accommodation Type
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="PG">Paying Guest (PG)</option>
                  <option value="Hostel">Student Hostel</option>
                  <option value="Co-Living">Co-Living Space</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender Eligibility
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="Co-ed">Co-ed (Unisex)</option>
                  <option value="Boys">Boys Only</option>
                  <option value="Girls">Girls Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bangalore Locality
                </label>
                <select
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="Koramangala">Koramangala</option>
                  <option value="HSR Layout">HSR Layout</option>
                  <option value="Whitefield">Whitefield</option>
                  <option value="Indiranagar">Indiranagar</option>
                  <option value="BTM Layout">BTM Layout</option>
                  <option value="Electronic City">Electronic City</option>
                  <option value="Bellandur">Bellandur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Starting Monthly Rent (₹/bed) *
                </label>
                <input
                  type="number"
                  required
                  min={3000}
                  step={500}
                  value={startingPrice}
                  onChange={e => setStartingPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Street Address *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Building number, cross street, landmark..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner / Manager Name *
                </label>
                <input
                  type="text"
                  required
                  value={managerName}
                  onChange={e => setManagerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={managerPhone}
                  onChange={e => setManagerPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableAmenities.map(item => {
                  const isChecked = amenities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleAmenity(item)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border text-left transition-colors ${
                        isChecked
                          ? 'bg-teal-50 text-teal-800 border-teal-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </span>
                      <span className="truncate">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
            >
              Register & Request Campus Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
