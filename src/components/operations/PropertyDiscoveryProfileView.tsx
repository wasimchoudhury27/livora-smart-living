import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Star, 
  Zap, 
  Utensils, 
  ShieldCheck, 
  Eye, 
  Calendar, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Check, 
  ExternalLink,
  Edit3,
  TrendingUp,
  MapPin,
  Building2,
  Users
} from 'lucide-react';

export const PropertyDiscoveryProfileView: React.FC = () => {
  const { 
    currentProperty, 
    updatePropertyListingDetails, 
    enquiries, 
    updateEnquiryStatus, 
    setPlatformMode,
    showToast 
  } = useApp();

  const listing = currentProperty.listingDetails;

  const [isEditing, setIsEditing] = useState(false);
  const [tagline, setTagline] = useState(listing?.tagline || '');
  const [description, setDescription] = useState(listing?.description || '');
  const [startingPrice, setStartingPrice] = useState(listing?.startingPrice || 8000);
  const [curfewTime, setCurfewTime] = useState(listing?.curfewTime || '11:00 PM');
  const [visitorPolicy, setVisitorPolicy] = useState(listing?.visitorPolicy || 'Lounge access until 8:00 PM');
  const [publicListing, setPublicListing] = useState(currentProperty.publicListing !== false);

  const propertyEnquiries = enquiries.filter(e => e.propertyId === currentProperty.id);

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePropertyListingDetails(currentProperty.id, {
      publicListing,
      listingDetails: {
        ...(listing || {
          photos: [],
          gender: 'Co-ed',
          depositMonths: 2,
          noticePeriodDays: 30,
          livabilityScore: 85,
          cityRank: 1,
          localityRank: 1,
          localityName: currentProperty.city,
          totalReviewsCount: 15,
          avgRating: 4.8,
          avgComplaintResolutionHours: 2.1,
          foodRating: 4.6,
          cleanlinessScore: 95,
          verifiedStatus: 'verified',
          nearestLandmark: 'Metro Station',
          distanceToCampusOrMetro: '1 km',
          coordinates: { lat: 12.9352, lng: 77.6245 },
          roomPricingSummary: { single: 14000, double: 8000 },
          verifiedReviews: []
        }),
        tagline,
        description,
        startingPrice: Number(startingPrice),
        curfewTime,
        visitorPolicy
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Live Scorecard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
            <Award className="w-4 h-4" />
            <span>LIVORA Citywide Discovery & Transparent Ranking Profile</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {currentProperty.name}
          </h2>
          <p className="text-xs text-slate-500">
            {listing?.localityName || currentProperty.city} · {currentProperty.type} · Managed by {currentProperty.managerName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlatformMode('discovery')}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-xl border border-teal-200 transition-colors"
          >
            <Eye className="w-4 h-4 text-teal-600" />
            <span>Preview in Public Discovery</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Public Profile'}</span>
          </button>
        </div>
      </div>

      {/* 2. Transparent Score Card & City Benchmark Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Rank Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Citywide Rank
            </span>
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">
              #{listing?.cityRank || 1}
            </div>
            <div className="text-xs text-teal-300 font-semibold mt-1">
              Top 1% in {listing?.localityName || currentProperty.city}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-400">
            Livability Score: <strong>{listing?.livabilityScore || 96} / 100</strong>
          </div>
        </div>

        {/* Maintenance Speed Benchmark */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Mean Resolution Speed
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Zap className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {listing?.avgComplaintResolutionHours || 1.8}h
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>57% faster than city avg (4.2h)</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Logged across 84 staff work tickets
          </div>
        </div>

        {/* Resident Dining Rating */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Daily Mess Score
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Utensils className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {listing?.foodRating || 4.6} / 5.0
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>Above city average (4.1)</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Based on student meal ratings
          </div>
        </div>

        {/* Verified Resident Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Verified Reviews
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {listing?.avgRating || 4.8}★
            </div>
            <div className="text-xs text-slate-600 font-semibold mt-1">
              {listing?.totalReviewsCount || 42} verified student reviews
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            100% verified stay agreements
          </div>
        </div>
      </div>

      {/* 3. Inbound Student Enquiries & Tour Requests */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Inbound Public Enquiries & Campus Visits ({propertyEnquiries.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prospective students who submitted admission requests through the LIVORA Discovery Platform.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Zero Platform Commission
          </div>
        </div>

        <div className="overflow-x-auto">
          {propertyEnquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No pending tour enquiries yet. Active listings appear on the Bangalore public discovery dashboard.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Phone / Email</th>
                  <th className="py-3 px-4">Request Type</th>
                  <th className="py-3 px-4">Sharing</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {propertyEnquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {enq.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{enq.studentName}</div>
                      {enq.notes && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{enq.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{enq.phone}</div>
                      <div className="text-[11px] text-slate-400">{enq.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        enq.type === 'schedule_visit' ? 'bg-teal-50 text-teal-800' : 'bg-indigo-50 text-indigo-800'
                      }`}>
                        {enq.type === 'schedule_visit' ? 'Free Tour' : 'Reserve Bed'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {enq.sharingPreference} Sharing
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {enq.moveInDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        enq.status === 'visit_scheduled'
                          ? 'bg-teal-50 text-teal-800'
                          : enq.status === 'admitted'
                          ? 'bg-emerald-50 text-emerald-800'
                          : enq.status === 'contacted'
                          ? 'bg-indigo-50 text-indigo-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {enq.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {enq.status !== 'visit_scheduled' && (
                          <button
                            onClick={() => updateEnquiryStatus(enq.id, 'visit_scheduled')}
                            className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-semibold rounded-lg transition-colors"
                          >
                            Confirm Visit
                          </button>
                        )}
                        {enq.status !== 'admitted' && (
                          <button
                            onClick={() => updateEnquiryStatus(enq.id, 'admitted')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                          >
                            Admit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. Edit Public Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveListing} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Edit Public Discovery Information</h3>
            <span className="text-xs text-slate-500">Updates reflect immediately across the public discovery marketplace.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catchy Tagline (Displayed on card)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Premier Student Living with Chef Mess..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Starting Monthly Rent (₹/month)
              </label>
              <input
                type="number"
                value={startingPrice}
                onChange={e => setStartingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Public Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Curfew & Late Entry Policy
              </label>
              <input
                type="text"
                value={curfewTime}
                onChange={e => setCurfewTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visitor Access Policy
              </label>
              <input
                type="text"
                value={visitorPolicy}
                onChange={e => setVisitorPolicy(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={publicListing}
                onChange={e => setPublicListing(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Publish this property on LIVORA Public Discovery</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
            >
              Save Discovery Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
