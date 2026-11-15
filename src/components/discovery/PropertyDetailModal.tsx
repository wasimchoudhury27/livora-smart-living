import React, { useState } from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Utensils, 
  Wifi, 
  Clock, 
  Calendar, 
  BedDouble, 
  Award, 
  ExternalLink, 
  Check, 
  Layers, 
  UserCheck, 
  Coffee, 
  ChevronRight, 
  Building2,
  Lock
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onOpenScheduleVisit: () => void;
  onToggleCompare: () => void;
  isCompared: boolean;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenScheduleVisit,
  onToggleCompare,
  isCompared
}) => {
  const { setCurrentPropertyId, setPlatformMode, showToast } = useApp();
  const listing = property.listingDetails;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'reviews' | 'mess' | 'rules'>('overview');

  const photos = listing?.photos && listing.photos.length > 0 
    ? listing.photos 
    : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&auto=format&fit=crop&q=80'];

  const handleOpenInManagement = () => {
    setCurrentPropertyId(property.id);
    setPlatformMode('management');
    onClose();
    showToast('Switched to Management Portal', `Now viewing ${property.name} back-office dashboard`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-teal-700">{property.type}</span>
                <span>·</span>
                <span>{listing?.gender || 'Co-ed'} Accommodation</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {listing?.localityName || property.city}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {property.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInManagement}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
              title="Inspect Property Management Portal for this hostel"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Open in Management Demo</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Gallery & Score Strip */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 bg-slate-50/70 border-b border-slate-200">
            {/* Photos */}
            <div className="md:col-span-7 space-y-2">
              <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 relative">
                <img
                  src={photos[selectedPhotoIndex] || photos[0]}
                  alt={property.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {listing?.featuredBadge && (
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                    {listing.featuredBadge}
                  </div>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        selectedPhotoIndex === idx ? 'border-teal-600 ring-2 ring-teal-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transparent Livability Card */}
            <div className="md:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Transparent Quality Index
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {listing?.livabilityScore || 85}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">/ 100</span>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md ml-1">
                        Rank #{listing?.cityRank || 1} in City
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                {/* Algorithmic Score Pillars */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Verified Resident Rating (35%)
                    </span>
                    <span className="font-semibold text-slate-800">
                      {listing?.avgRating || 4.8}★ ({listing?.totalReviewsCount || 30} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-500" />
                      Maintenance MTTR (25%)
                    </span>
                    <span className="font-semibold text-slate-800">
                      {listing?.avgComplaintResolutionHours || 2.1}h avg closure
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                      Daily Mess Rating (20%)
                    </span>
                    <span className="font-semibold text-slate-800">
                      {listing?.foodRating || 4.6} / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                      Hygiene & Safety Audit (20%)
                    </span>
                    <span className="font-semibold text-slate-800">
                      {listing?.cleanlinessScore || 95}% verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Starting Monthly Rent</span>
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{listing?.startingPrice.toLocaleString() || '7,000'}
                    </span>
                    <span className="text-xs text-slate-500"> / bed</span>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>Deposit: {listing?.depositMonths || 2} mos</div>
                    <div>Notice: {listing?.noticePeriodDays || 30} days</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onToggleCompare}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isCompared
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isCompared ? '✓ Added to Compare' : '+ Compare'}
                  </button>
                  <button
                    onClick={onOpenScheduleVisit}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs"
                  >
                    Schedule Free Visit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 border-b border-slate-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-6 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Overview & Facilities
              </button>

              <button
                onClick={() => setActiveTab('rooms')}
                className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'rooms'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Room Sharing & Pricing
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Verified Reviews ({listing?.verifiedReviews?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('mess')}
                className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'mess'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Mess & Dining Menu
              </button>

              <button
                onClick={() => setActiveTab('rules')}
                className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'rules'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                House Rules & Curfew
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">About This Accommodation</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {listing?.description || property.address}
                  </p>
                </div>

                {/* Campus & Transit Proximity */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    Location & Transit Proximity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400">Exact Address:</span>
                      <p className="font-medium text-slate-800 mt-0.5">{property.address}, {property.city} - {property.pincode}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Nearest Landmark / Campus:</span>
                      <p className="font-medium text-slate-800 mt-0.5">{listing?.nearestLandmark || 'Central Metro Connection'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Transit Distance:</span>
                      <p className="font-medium text-slate-800 mt-0.5">{listing?.distanceToCampusOrMetro || 'Within 1.5 km of main transit lines'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Campus Warden:</span>
                      <p className="font-medium text-slate-800 mt-0.5">{property.managerName} ({property.managerPhone})</p>
                    </div>
                  </div>
                </div>

                {/* Facilities Checklist */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Included Facilities & Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800">
                        <Check className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. ROOMS & PRICING */}
            {activeTab === 'rooms' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Room Configurations & Vacancies</h3>
                  <span className="text-xs text-slate-500">Live bed count synced with management system</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {listing?.roomPricingSummary?.single && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-teal-500 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-900">Single Occupancy</span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Private Room
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-xl font-bold text-slate-900">₹{listing.roomPricingSummary.single.toLocaleString()}</span>
                        <span className="text-xs text-slate-400"> / month</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-center gap-1.5">✓ Attached Washroom</li>
                        <li className="flex items-center gap-1.5">✓ Dedicated Study Desk & Wardrobe</li>
                        <li className="flex items-center gap-1.5">✓ AC Included</li>
                      </ul>
                      <button
                        onClick={onOpenScheduleVisit}
                        className="mt-4 w-full py-2 bg-slate-50 hover:bg-teal-50 text-teal-700 border border-slate-200 hover:border-teal-300 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Enquire Single Bed
                      </button>
                    </div>
                  )}

                  {listing?.roomPricingSummary?.double && (
                    <div className="border-2 border-teal-600 rounded-xl p-4 bg-teal-50/20 relative">
                      <div className="absolute -top-2.5 right-4 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        MOST POPULAR
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-900">Double Sharing</span>
                        <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          2 Beds / Room
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-xl font-bold text-slate-900">₹{listing.roomPricingSummary.double.toLocaleString()}</span>
                        <span className="text-xs text-slate-400"> / month</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-center gap-1.5">✓ Attached Washroom</li>
                        <li className="flex items-center gap-1.5">✓ Individual Lockers & Study Chairs</li>
                        <li className="flex items-center gap-1.5">✓ Daily Housekeeping</li>
                      </ul>
                      <button
                        onClick={onOpenScheduleVisit}
                        className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                      >
                        Enquire Double Bed
                      </button>
                    </div>
                  )}

                  {listing?.roomPricingSummary?.triple && (
                    <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-teal-500 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-900">Triple Sharing</span>
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          Budget Value
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-xl font-bold text-slate-900">₹{listing.roomPricingSummary.triple.toLocaleString()}</span>
                        <span className="text-xs text-slate-400"> / month</span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-center gap-1.5">✓ Spacious Ventilation</li>
                        <li className="flex items-center gap-1.5">✓ Individual Bed & Storage</li>
                        <li className="flex items-center gap-1.5">✓ High-speed Wi-Fi</li>
                      </ul>
                      <button
                        onClick={onOpenScheduleVisit}
                        className="mt-4 w-full py-2 bg-slate-50 hover:bg-teal-50 text-teal-700 border border-slate-200 hover:border-teal-300 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Enquire Triple Bed
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. VERIFIED REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold">LIVORA Verified Resident Guarantee:</span> Every review below is submitted by a registered student with verified hostel agreement and biometric entry records. No fake or incentivized ratings allowed.
                  </div>
                </div>

                <div className="space-y-3">
                  {listing?.verifiedReviews && listing.verifiedReviews.length > 0 ? (
                    listing.verifiedReviews.map(rev => (
                      <div key={rev.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img src={rev.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <span>{rev.studentName}</span>
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  Verified Resident · {rev.verifiedStayMonths} mos stay
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {rev.roomType} · {rev.date}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{rev.rating}.0</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed">
                          "{rev.comment}"
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                          <span>Food: <strong>{rev.foodRating}/5</strong></span>
                          <span>Cleanliness: <strong>{rev.cleanlinessRating}/5</strong></span>
                          <span>Maintenance: <strong>{rev.maintenanceRating}/5</strong></span>
                          <span>Wi-Fi: <strong>{rev.wifiRating}/5</strong></span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No verified reviews recorded yet. Initial resident cohort undergoing audit.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. MESS & DINING */}
            {activeTab === 'mess' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Weekly Chef Dining Schedule</h3>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Mess Rating: {listing?.foodRating || 4.6} / 5.0
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Breakfast (7:30 AM - 9:30 AM)</span>
                    <p className="text-slate-600">Idli Sambar, Masala Dosa, Poha, Fresh Milk, Tea & Filter Coffee, Boiled Eggs.</p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Lunch (12:30 PM - 2:30 PM)</span>
                    <p className="text-slate-600">Steamed Rice, Dal Makhani / Sambar, Chapati, Paneer Curry / Chicken Curry (Wed & Sun), Curd & Salad.</p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Evening Snacks (5:00 PM - 6:30 PM)</span>
                    <p className="text-slate-600">Samosas, Onion Pakoda, Biscuits, Hot Tea & Coffee.</p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Dinner (8:00 PM - 10:00 PM)</span>
                    <p className="text-slate-600">Roti, Mixed Veg Sabzi, Dal Tadka, Jeera Rice, Gulab Jamun / Kheer on weekends.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. RULES & CURFEW */}
            {activeTab === 'rules' && (
              <div className="space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900">Campus Guidelines & Security Policies</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 block mb-0.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Gate Curfew & Late Pass:
                    </span>
                    <p className="text-slate-600">{listing?.curfewTime || '11:00 PM'}. Late entry approved through the LIVORA student portal with automated SMS to guardians if required.</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 block mb-0.5 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      Visitor Policy:
                    </span>
                    <p className="text-slate-600">{listing?.visitorPolicy || 'Visitors permitted in designated common lounges until 8:00 PM. Prior guest logging mandatory.'}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-bold text-slate-800 block mb-0.5 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-rose-600" />
                      Security & Biometrics:
                    </span>
                    <p className="text-slate-600">24x7 security personnel on duty. Biometric touch-free facial/turnstile logs prevent unauthorized campus access.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            <span>Managed with <strong>LIVORA Smart Living OS</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={onOpenScheduleVisit}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Free Visit / Reserve Bed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
