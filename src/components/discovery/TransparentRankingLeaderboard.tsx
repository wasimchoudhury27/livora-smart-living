import React, { useState } from 'react';
import { Property } from '../../types';
import { RANKING_METHODOLOGY } from '../../data/discoveryData';
import { 
  Award, 
  ShieldCheck, 
  Zap, 
  Utensils, 
  Star, 
  CheckCircle2, 
  HelpCircle, 
  ArrowUpDown, 
  Calendar, 
  Building2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';

interface TransparentRankingLeaderboardProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenScheduleVisit: (property: Property) => void;
  onToggleCompare: (property: Property) => void;
  comparedPropertyIds: string[];
}

export const TransparentRankingLeaderboard: React.FC<TransparentRankingLeaderboardProps> = ({
  properties,
  onSelectProperty,
  onOpenScheduleVisit,
  onToggleCompare,
  comparedPropertyIds
}) => {
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [showMethodologyModal, setShowMethodologyModal] = useState<boolean>(false);

  // Filter & sort by Livability Score descending
  const rankedProperties = [...properties]
    .filter(p => selectedLocality === 'all' || p.listingDetails?.localityName.toLowerCase() === selectedLocality.toLowerCase())
    .sort((a, b) => (b.listingDetails?.livabilityScore || 0) - (a.listingDetails?.livabilityScore || 0));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Methodology Callout */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-2">
            <Award className="w-4 h-4" />
            <span>LIVORA Algorithmic Ranking Index · Bangalore 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transparent Citywide Hostel & PG Rankings
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Unlike commercial listing sites that promote hostels who pay for sponsored ad slots, LIVORA ranks accommodations strictly on verified resident satisfaction, daily dining consistency, and staff repair speed.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => setShowMethodologyModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition-colors"
            >
              <Info className="w-4 h-4 text-teal-600" />
              <span>How Scores Are Calculated (4 Pillars)</span>
            </button>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Zero paid sponsorships allowed. 100% verified student admission data.
            </span>
          </div>
        </div>

        {/* 4 Pillars Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          {RANKING_METHODOLOGY.map((pillar, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">{pillar.title}</span>
                <span className="text-xs font-extrabold text-teal-700">{pillar.weight}%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Locality Filter & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Leaderboard Rankings ({rankedProperties.length} Accommodations)
          </h3>
          <p className="text-xs text-slate-500">
            Ranked based on cumulative 30-day rolling performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Filter Locality:</label>
          <select
            value={selectedLocality}
            onChange={e => setSelectedLocality(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="all">All Bangalore Localities</option>
            <option value="koramangala">Koramangala</option>
            <option value="hsr layout">HSR Layout</option>
            <option value="whitefield">Whitefield</option>
            <option value="indiranagar">Indiranagar</option>
            <option value="btm layout">BTM Layout</option>
            <option value="electronic city">Electronic City</option>
            <option value="bellandur">Bellandur</option>
          </select>
        </div>
      </div>

      {/* 3. Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-14 text-center">Rank</th>
                <th className="py-3.5 px-4">Property & Locality</th>
                <th className="py-3.5 px-4 text-center">Livability Score</th>
                <th className="py-3.5 px-4">Verified Resident Rating</th>
                <th className="py-3.5 px-4">Maintenance Speed</th>
                <th className="py-3.5 px-4">Food Rating</th>
                <th className="py-3.5 px-4">Audit Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rankedProperties.map((p, index) => {
                const rankNum = index + 1;
                const listing = p.listingDetails;
                const score = listing?.livabilityScore || 80;
                const isTop3 = rankNum <= 3;
                const isCompared = comparedPropertyIds.includes(p.id);

                return (
                  <tr 
                    key={p.id}
                    onClick={() => onSelectProperty(p)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Rank Badge */}
                    <td className="py-4 px-4 text-center">
                      {rankNum === 1 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center mx-auto text-xs ring-2 ring-amber-300">
                          1
                        </span>
                      ) : rankNum === 2 ? (
                        <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center mx-auto text-xs ring-2 ring-slate-300">
                          2
                        </span>
                      ) : rankNum === 3 ? (
                        <span className="w-7 h-7 rounded-full bg-amber-700/10 text-amber-900 font-extrabold flex items-center justify-center mx-auto text-xs ring-2 ring-amber-700/20">
                          3
                        </span>
                      ) : (
                        <span className="font-bold text-slate-500 text-xs">
                          #{rankNum}
                        </span>
                      )}
                    </td>

                    {/* Property info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing?.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&auto=format&fit=crop&q=80'}
                          alt=""
                          className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                              {p.name}
                            </span>
                            {listing?.featuredBadge && (
                              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                {listing.featuredBadge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <span>{p.type}</span>
                            <span>·</span>
                            <span>{listing?.gender || 'Co-ed'}</span>
                            <span>·</span>
                            <span className="font-medium text-slate-700">{listing?.localityName || p.city}</span>
                            <span>·</span>
                            <span className="font-semibold text-slate-900">₹{listing?.startingPrice.toLocaleString()} /mo</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Livability Score with Bar */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-base font-extrabold ${isTop3 ? 'text-teal-700' : 'text-slate-800'}`}>
                            {score}
                          </span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              score >= 90 ? 'bg-teal-600' : score >= 80 ? 'bg-indigo-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Resident Stars */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{listing?.avgRating || 4.5}★</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          ({listing?.totalReviewsCount || 20})
                        </span>
                      </div>
                    </td>

                    {/* Maintenance Speed */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Zap className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-semibold">{listing?.avgComplaintResolutionHours || 2.5}h</span>
                        <span className="text-[10px] text-slate-400">avg</span>
                      </div>
                    </td>

                    {/* Food Rating */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-semibold">{listing?.foodRating || 4.2}</span>
                        <span className="text-[10px] text-slate-400">/ 5.0</span>
                      </div>
                    </td>

                    {/* Audit Status */}
                    <td className="py-4 px-4">
                      {listing?.verifiedStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          Audit Pending
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onToggleCompare(p)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            isCompared
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                              : 'text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Add to side-by-side comparison"
                        >
                          {isCompared ? '✓ Compared' : '+ Compare'}
                        </button>

                        <button
                          onClick={() => onOpenScheduleVisit(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-2xs"
                        >
                          Visit / Reserve
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Healthy Competition Explainer for Hostel Owners */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Fair Competition Manifesto</span>
          </div>
          <h3 className="text-xl font-bold">
            How LIVORA Drives Healthy Competition Among Accommodations
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hostels and PGs on LIVORA cannot buy top placement. To rank higher, owners must resolve resident maintenance issues faster, serve nutritious meals that students rate highly every day, and maintain impeccable hygiene.
          </p>
        </div>

        <div className="shrink-0 space-y-2">
          <div className="text-xs text-slate-400">Are you a hostel owner in Bangalore?</div>
          <button
            onClick={() => setShowMethodologyModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
          >
            Review Audit Compliance Guide
          </button>
        </div>
      </div>

      {/* Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                LIVORA Transparent Ranking Algorithm
              </h3>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every property's Livability Score (0 - 100) is calculated in real time using 4 independent data streams logged across the LIVORA platform:
            </p>

            <div className="space-y-3">
              {RANKING_METHODOLOGY.map((pillar, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{pillar.title}</span>
                    <span className="text-xs font-extrabold text-teal-700">{pillar.weight}% Weight</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <span className="font-bold">Anti-Gaming Safeguards:</span> Reviews require verified Aadhaar/College agreement ID and biometric activity logs. Multiple reviews from the same device or IP are rejected.
            </div>

            <div className="text-right pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
