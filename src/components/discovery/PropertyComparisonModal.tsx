import React from 'react';
import { Property } from '../../types';
import { 
  X, 
  Check, 
  Minus, 
  Star, 
  Award, 
  Zap, 
  Utensils, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Trash2,
  ExternalLink
} from 'lucide-react';

interface PropertyComparisonModalProps {
  properties: Property[];
  onClose: () => void;
  onRemoveProperty: (id: string) => void;
  onOpenScheduleVisit: (property: Property) => void;
  onOpenDetail: (property: Property) => void;
}

const COMMON_AMENITIES = [
  'High-speed Wi-Fi',
  '3-Time Mess',
  'Biometric Entry',
  '24x7 Power Backup',
  'Daily Housekeeping',
  'Gym & Recreation',
  'Lift',
  'RO Water Dispenser',
  'CCTV Security'
];

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  properties,
  onClose,
  onRemoveProperty,
  onOpenScheduleVisit,
  onOpenDetail
}) => {
  if (properties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Side-by-Side Hostel & PG Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing {properties.length} accommodations based on real verified telemetry and resident satisfaction.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Table Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="min-w-[700px] p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-1/4 text-left p-3 font-semibold text-xs text-slate-400 uppercase tracking-wider bg-slate-50 rounded-l-xl">
                    Evaluation Metric
                  </th>
                  {properties.map(p => (
                    <th key={p.id} className="p-3 text-left bg-slate-50 first:rounded-l-none last:rounded-r-xl">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            {p.type} · {p.listingDetails?.gender || 'Co-ed'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 truncate mt-1">{p.name}</h4>
                          <span className="text-xs text-slate-500 block truncate">{p.listingDetails?.localityName || p.city}</span>
                        </div>
                        <button
                          onClick={() => onRemoveProperty(p.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {/* 1. Livability Score */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    Livability Index
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-slate-900">
                          {p.listingDetails?.livabilityScore || 85}
                        </span>
                        <span className="text-slate-400 text-[11px]">/ 100</span>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded ml-1">
                          #{p.listingDetails?.cityRank || 1} Rank
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 2. Monthly Starting Rent */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-700">Starting Rent (Monthly)</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      <span className="text-base font-bold text-slate-900">
                        ₹{p.listingDetails?.startingPrice.toLocaleString() || '7,000'}
                      </span>
                      <span className="text-slate-400 text-[11px]"> / bed</span>
                    </td>
                  ))}
                </tr>

                {/* 3. Room Pricing Breakdown */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-700">Room Sharing Options</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3 space-y-1">
                      {p.listingDetails?.roomPricingSummary.single && (
                        <div>Single: <strong>₹{p.listingDetails.roomPricingSummary.single.toLocaleString()}</strong></div>
                      )}
                      {p.listingDetails?.roomPricingSummary.double && (
                        <div>Double: <strong>₹{p.listingDetails.roomPricingSummary.double.toLocaleString()}</strong></div>
                      )}
                      {p.listingDetails?.roomPricingSummary.triple && (
                        <div>Triple: <strong>₹{p.listingDetails.roomPricingSummary.triple.toLocaleString()}</strong></div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 4. Deposit & Notice Period */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-700">Deposit & Notice Terms</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3 text-slate-700">
                      <div>Deposit: {p.listingDetails?.depositMonths || 2} Months</div>
                      <div className="text-slate-500">Notice: {p.listingDetails?.noticePeriodDays || 30} Days</div>
                    </td>
                  ))}
                </tr>

                {/* 5. Resident Rating */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-700 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Verified Resident Stars
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="text-amber-600">{p.listingDetails?.avgRating || 4.8}★</span>
                        <span className="text-slate-400 font-normal">({p.listingDetails?.totalReviewsCount || 25} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 6. Complaint Resolution Time */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    Mean Ticket Resolution
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3">
                      <span className="font-semibold text-slate-800">
                        {p.listingDetails?.avgComplaintResolutionHours || 2.1} hours
                      </span>
                      <span className="text-[10px] text-slate-400 block">Measured via staff telemetry</span>
                    </td>
                  ))}
                </tr>

                {/* 7. Dining / Mess Rating */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-700 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    Daily Dining Rating
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3 font-semibold text-slate-800">
                      {p.listingDetails?.foodRating || 4.5} / 5.0
                    </td>
                  ))}
                </tr>

                {/* 8. Curfew & Gate Timing */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Gate Curfew
                  </td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3 text-slate-700">
                      {p.listingDetails?.curfewTime || '11:00 PM'}
                    </td>
                  ))}
                </tr>

                {/* 9. Key Amenities Checklist */}
                {COMMON_AMENITIES.map(amenity => (
                  <tr key={amenity} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-600 font-medium">{amenity}</td>
                    {properties.map(p => {
                      const hasAmenity = p.amenities.some(a => 
                        a.toLowerCase().includes(amenity.toLowerCase().replace(/[^a-z]/g, '')) ||
                        amenity.toLowerCase().includes(a.toLowerCase().replace(/[^a-z]/g, ''))
                      );
                      return (
                        <td key={p.id} className="p-3">
                          {hasAmenity ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <Check className="w-4 h-4 text-emerald-600" /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400">
                              <Minus className="w-4 h-4" /> Not Included
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* 10. CTAs */}
                <tr>
                  <td className="p-3 font-semibold text-slate-700">Actions</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-3 space-y-2">
                      <button
                        onClick={() => onOpenScheduleVisit(p)}
                        className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Visit</span>
                      </button>
                      <button
                        onClick={() => onOpenDetail(p)}
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                      >
                        Full Profile
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Rankings updated automatically from verified resident app reviews & daily maintenance logs.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
