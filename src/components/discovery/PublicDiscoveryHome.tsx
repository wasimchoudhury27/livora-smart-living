import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import { 
  Search, 
  MapPin, 
  Star, 
  Award, 
  Zap, 
  Utensils, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Layers, 
  Building2, 
  Plus, 
  Check, 
  X, 
  ChevronRight, 
  ExternalLink,
  Info,
  Compass,
  LayoutGrid,
  Map as MapIcon,
  Trophy,
  Filter
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { PropertyDetailModal } from './PropertyDetailModal';
import { PropertyComparisonModal } from './PropertyComparisonModal';
import { ScheduleVisitModal } from './ScheduleVisitModal';
import { TransparentRankingLeaderboard } from './TransparentRankingLeaderboard';
import { InteractiveMapView } from './InteractiveMapView';
import { ListPropertyModal } from './ListPropertyModal';

interface PublicDiscoveryHomeProps {
  onSwitchToManagement: () => void;
}

export const PublicDiscoveryHome: React.FC<PublicDiscoveryHomeProps> = ({ onSwitchToManagement }) => {
  const { properties, setPlatformMode } = useApp();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All');
  const [selectedType, setSelectedType] = useState<'All' | 'Hostel' | 'PG' | 'Co-Living'>('All');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Boys' | 'Girls' | 'Co-ed'>('All');
  const [budgetTier, setBudgetTier] = useState<'all' | 'under8k' | '8k-12k' | '12k-16k' | 'above16k'>('all');
  const [selectedSharing, setSelectedSharing] = useState<'All' | 'Single' | 'Double' | 'Triple'>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    'score_desc' | 'price_asc' | 'price_desc' | 'rating_desc' | 'speed_asc' | 'food_desc' | 'reviews_desc'
  >('score_desc');

  // View Switcher: Grid, Leaderboard, Map
  const [viewMode, setViewMode] = useState<'grid' | 'leaderboard' | 'map'>('grid');

  // Modals state
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [scheduleProperty, setScheduleProperty] = useState<Property | null>(null);
  const [scheduleType, setScheduleType] = useState<'schedule_visit' | 'reserve_bed'>('schedule_visit');
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);

  // Comparison State (up to 4 properties)
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const toggleCompare = (prop: Property) => {
    setComparedPropertyIds(prev => {
      if (prev.includes(prop.id)) {
        return prev.filter(id => id !== prop.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, prop.id];
    });
  };

  const removeCompared = (id: string) => {
    setComparedPropertyIds(prev => prev.filter(item => item !== id));
  };

  const comparedProperties = useMemo(() => {
    return properties.filter(p => comparedPropertyIds.includes(p.id));
  }, [properties, comparedPropertyIds]);

  // Amenity filters options
  const keyAmenitiesList = [
    'High-speed Wi-Fi',
    '3-Time Mess',
    '24x7 Power Backup',
    'Biometric Entry',
    'Gym & Recreation',
    'AC Rooms',
    'Daily Housekeeping'
  ];

  const toggleAmenityFilter = (item: string) => {
    setSelectedAmenities(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  // Filtered & Sorted Properties List
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Must be public listing
      if (p.publicListing === false) return false;

      const listing = p.listingDetails;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesLocality = listing?.localityName.toLowerCase().includes(query) || p.city.toLowerCase().includes(query);
        const matchesAddress = p.address.toLowerCase().includes(query);
        const matchesLandmark = listing?.nearestLandmark.toLowerCase().includes(query);
        if (!matchesName && !matchesLocality && !matchesAddress && !matchesLandmark) {
          return false;
        }
      }

      // Locality
      if (selectedLocality !== 'All') {
        if (listing?.localityName.toLowerCase() !== selectedLocality.toLowerCase()) {
          return false;
        }
      }

      // Accommodation Type
      if (selectedType !== 'All' && p.type !== selectedType) {
        return false;
      }

      // Gender
      if (selectedGender !== 'All') {
        if (listing?.gender !== selectedGender) return false;
      }

      // Budget Tier
      const price = listing?.startingPrice || 8000;
      if (budgetTier === 'under8k' && price > 8000) return false;
      if (budgetTier === '8k-12k' && (price < 8000 || price > 12000)) return false;
      if (budgetTier === '12k-16k' && (price < 12000 || price > 16000)) return false;
      if (budgetTier === 'above16k' && price < 16000) return false;

      // Sharing
      if (selectedSharing !== 'All') {
        const summary = listing?.roomPricingSummary;
        if (selectedSharing === 'Single' && !summary?.single) return false;
        if (selectedSharing === 'Double' && !summary?.double) return false;
        if (selectedSharing === 'Triple' && !summary?.triple) return false;
      }

      // Amenities
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(req => 
          p.amenities.some(a => a.toLowerCase().includes(req.toLowerCase().replace(/[^a-z]/g, '')))
        );
        if (!hasAll) return false;
      }

      // Verified Only
      if (verifiedOnly && listing?.verifiedStatus !== 'verified') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const la = a.listingDetails;
      const lb = b.listingDetails;

      if (sortBy === 'score_desc') {
        return (lb?.livabilityScore || 0) - (la?.livabilityScore || 0);
      }
      if (sortBy === 'price_asc') {
        return (la?.startingPrice || 0) - (lb?.startingPrice || 0);
      }
      if (sortBy === 'price_desc') {
        return (lb?.startingPrice || 0) - (la?.startingPrice || 0);
      }
      if (sortBy === 'rating_desc') {
        return (lb?.avgRating || 0) - (la?.avgRating || 0);
      }
      if (sortBy === 'speed_asc') {
        return (la?.avgComplaintResolutionHours || 99) - (lb?.avgComplaintResolutionHours || 99);
      }
      if (sortBy === 'food_desc') {
        return (lb?.foodRating || 0) - (la?.foodRating || 0);
      }
      if (sortBy === 'reviews_desc') {
        return (lb?.totalReviewsCount || 0) - (la?.totalReviewsCount || 0);
      }
      return 0;
    });
  }, [
    properties, 
    searchTerm, 
    selectedLocality, 
    selectedType, 
    selectedGender, 
    budgetTier, 
    selectedSharing, 
    selectedAmenities, 
    verifiedOnly, 
    sortBy
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-teal-600 selection:text-white">
      {/* 1. Public Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Logo size="sm" showTagline={false} />
          
          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* City Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 rounded-xl text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Bangalore, Karnataka</span>
            <span className="text-[10px] text-slate-400">· 124 Spaces</span>
          </div>
        </div>

        {/* Right Navigation & Direct Management Access */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setIsListPropertyOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Your Hostel</span>
          </button>

          {/* Direct Switch to Property Management Workspace */}
          <button
            onClick={onSwitchToManagement}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all duration-150"
            title="Switch directly to Private Hostel & Operations Management Portal"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Management Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section & Value Proposition */}
      <section className="bg-gradient-to-b from-white via-white to-slate-50/50 border-b border-slate-200 px-4 sm:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>Zero Paid Ads · 100% Algorithmic Transparent Rankings</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Discover Verified Hostels & PGs in Bangalore
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every participating property is ranked transparently by verified resident feedback, actual maintenance resolution speed, and food satisfaction — empowering students to choose with confidence.
          </p>

          {/* Prominent Search Bar */}
          <div className="max-w-3xl mx-auto pt-2">
            <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-teal-600 rounded-2xl shadow-sm transition-all overflow-hidden p-1.5">
              <div className="flex items-center pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by locality (Koramangala, HSR), landmark (Christ Univ, ITPL), or hostel name..."
                className="w-full py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shrink-0 transition-colors shadow-xs"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Stats Ticker */}
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 pt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <strong>{properties.length} Verified Accommodations</strong>
            </span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <strong>4.7★ Average Student Satisfaction</strong>
            </span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500" />
              <strong>&lt; 2.4 hrs Mean Maintenance Speed</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 3. Controls & Filter Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* View Mode Segmented Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid Directory</span>
            </button>

            <button
              onClick={() => setViewMode('leaderboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'leaderboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>City Leaderboard</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>Regional Map</span>
            </button>
          </div>

          {/* Primary Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
            {/* Locality Dropdown */}
            <select
              value={selectedLocality}
              onChange={e => setSelectedLocality(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shrink-0"
            >
              <option value="All">All Bangalore</option>
              <option value="Koramangala">Koramangala</option>
              <option value="HSR Layout">HSR Layout</option>
              <option value="Whitefield">Whitefield</option>
              <option value="Indiranagar">Indiranagar</option>
              <option value="BTM Layout">BTM Layout</option>
              <option value="Electronic City">Electronic City</option>
              <option value="Bellandur">Bellandur</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shrink-0"
            >
              <option value="All">All Types</option>
              <option value="Hostel">Hostels</option>
              <option value="PG">Paying Guests (PG)</option>
              <option value="Co-Living">Co-Living Spaces</option>
            </select>

            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shrink-0"
            >
              <option value="All">Any Gender</option>
              <option value="Boys">Boys Only</option>
              <option value="Girls">Girls Only</option>
              <option value="Co-ed">Co-ed / Unisex</option>
            </select>

            {/* Budget Filter */}
            <select
              value={budgetTier}
              onChange={e => setBudgetTier(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shrink-0"
            >
              <option value="all">Any Budget</option>
              <option value="under8k">Under ₹8,000</option>
              <option value="8k-12k">₹8,000 - ₹12,000</option>
              <option value="12k-16k">₹12,000 - ₹16,000</option>
              <option value="above16k">₹16,000+</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-teal-50/60 border border-teal-200/80 rounded-xl font-bold text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shrink-0"
            >
              <option value="score_desc">🏆 Highest Livability Score</option>
              <option value="price_asc">💰 Rent: Low to High</option>
              <option value="price_desc">💎 Rent: High to Low</option>
              <option value="rating_desc">⭐ Resident Star Rating</option>
              <option value="speed_asc">⚡ Fastest Maintenance (MTTR)</option>
              <option value="food_desc">🥗 Best Mess Food Rating</option>
              <option value="reviews_desc">📝 Most Verified Reviews</option>
            </select>
          </div>
        </div>

        {/* Amenities Sub-Filter Chips */}
        <div className="max-w-7xl mx-auto pt-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold text-slate-600">
          <span className="text-slate-400 shrink-0">Filter Amenities:</span>
          {keyAmenitiesList.map(item => {
            const isChecked = selectedAmenities.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleAmenityFilter(item)}
                className={`px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  isChecked
                    ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isChecked ? `✓ ${item}` : item}
              </button>
            );
          })}

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              verifiedOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {verifiedOnly ? '✓ Verified Excellence Only' : 'Verified Excellence Only'}
          </button>

          {(selectedAmenities.length > 0 || verifiedOnly || selectedLocality !== 'All' || selectedType !== 'All') && (
            <button
              onClick={() => {
                setSelectedAmenities([]);
                setVerifiedOnly(false);
                setSelectedLocality('All');
                setSelectedType('All');
                setSelectedGender('All');
                setBudgetTier('all');
                setSearchTerm('');
              }}
              className="text-teal-700 hover:underline px-2 py-1 text-[11px] font-semibold shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* VIEW 1: GRID DIRECTORY */}
        {viewMode === 'grid' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing <strong>{filteredProperties.length}</strong> matching accommodations in Bangalore
              </span>
              <span className="font-semibold text-teal-700">
                Sorted by {sortBy.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Accommodations Found</h3>
                <p className="text-xs text-slate-500">
                  Try broadening your search term or resetting your budget and locality filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocality('All');
                    setSelectedType('All');
                    setSelectedGender('All');
                    setBudgetTier('all');
                    setSelectedAmenities([]);
                    setVerifiedOnly(false);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => {
                  const listing = property.listingDetails;
                  const isCompared = comparedPropertyIds.includes(property.id);
                  const isTopRanked = (listing?.cityRank || 99) <= 3;

                  return (
                    <div
                      key={property.id}
                      onClick={() => setDetailProperty(property)}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group"
                    >
                      {/* Photo Thumbnail */}
                      <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                        <img
                          src={listing?.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80'}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
                          <div className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                            {listing?.featuredBadge || `${property.type} · ${listing?.gender || 'Co-ed'}`}
                          </div>

                          {/* Compare Checkbox */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompare(property);
                            }}
                            className={`pointer-events-auto p-1.5 rounded-lg backdrop-blur-md transition-colors text-xs font-semibold shadow-xs flex items-center gap-1 ${
                              isCompared
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white/90 text-slate-700 hover:bg-white'
                            }`}
                            title="Add to side-by-side comparison"
                          >
                            <span className="w-3.5 h-3.5 rounded border border-current flex items-center justify-center">
                              {isCompared && <Check className="w-2.5 h-2.5" />}
                            </span>
                            <span className="text-[10px] hidden sm:inline">Compare</span>
                          </button>
                        </div>

                        {/* Bottom Score Ribbon */}
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-slate-900 shadow-sm flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-xs font-extrabold">{listing?.livabilityScore || 85}</span>
                          <span className="text-[10px] text-slate-400">/ 100 Livability</span>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          {/* Unboxed Meta Kicker (frontend-design zero-pill discipline) */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                            <span className="font-semibold text-slate-700">{listing?.localityName || property.city}</span>
                            <span>·</span>
                            <span>{property.type}</span>
                            <span>·</span>
                            <span>{listing?.gender || 'Co-ed'}</span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                            {property.name}
                          </h3>

                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {listing?.tagline || property.address}
                          </p>

                          {/* Transparent Metrics Strip */}
                          <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-100 text-center">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">Resident Stars</span>
                              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                {listing?.avgRating || 4.8}★
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">Repair MTTR</span>
                              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                <Zap className="w-3 h-3 text-indigo-500" />
                                {listing?.avgComplaintResolutionHours || 2.1}h
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">Food Rating</span>
                              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                                <Utensils className="w-3 h-3 text-emerald-500" />
                                {listing?.foodRating || 4.5}
                              </span>
                            </div>
                          </div>

                          {/* Transit / Campus Proximity */}
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{listing?.distanceToCampusOrMetro || listing?.nearestLandmark || 'Central Metro connection'}</span>
                          </div>
                        </div>

                        {/* Price & Action Row */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Starting From</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-extrabold text-slate-900">
                                ₹{listing?.startingPrice.toLocaleString() || '7,000'}
                              </span>
                              <span className="text-[11px] text-slate-400">/ mo</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setScheduleProperty(property);
                                setScheduleType('schedule_visit');
                              }}
                              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                            >
                              Visit / Reserve
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: TRANSPARENT LEADERBOARD */}
        {viewMode === 'leaderboard' && (
          <TransparentRankingLeaderboard
            properties={properties}
            onSelectProperty={setDetailProperty}
            onOpenScheduleVisit={p => {
              setScheduleProperty(p);
              setScheduleType('schedule_visit');
            }}
            onToggleCompare={toggleCompare}
            comparedPropertyIds={comparedPropertyIds}
          />
        )}

        {/* VIEW 3: INTERACTIVE MAP */}
        {viewMode === 'map' && (
          <InteractiveMapView
            properties={filteredProperties}
            onSelectProperty={setDetailProperty}
            onOpenScheduleVisit={p => {
              setScheduleProperty(p);
              setScheduleType('schedule_visit');
            }}
            onToggleCompare={toggleCompare}
            comparedPropertyIds={comparedPropertyIds}
          />
        )}
      </main>

      {/* 5. Floating Comparison Dock (Appears when properties are selected) */}
      {comparedPropertyIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-2xl w-[92%]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">
              {comparedProperties.length}
            </span>
            <span className="text-xs font-semibold hidden sm:inline">
              Hostels Selected
            </span>
          </div>

          {/* Chips */}
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
            {comparedProperties.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg text-xs shrink-0">
                <span className="truncate max-w-[100px]">{p.name}</span>
                <button
                  onClick={() => removeCompared(p.id)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setComparedPropertyIds([])}
              className="text-xs text-slate-400 hover:text-slate-200 underline hidden sm:inline"
            >
              Clear
            </button>

            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              Compare Side-by-Side
            </button>
          </div>
        </div>
      )}

      {/* 6. Modals */}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onOpenScheduleVisit={() => {
            setScheduleProperty(detailProperty);
            setScheduleType('schedule_visit');
            setDetailProperty(null);
          }}
          onToggleCompare={() => toggleCompare(detailProperty)}
          isCompared={comparedPropertyIds.includes(detailProperty.id)}
        />
      )}

      {isComparisonOpen && (
        <PropertyComparisonModal
          properties={comparedProperties}
          onClose={() => setIsComparisonOpen(false)}
          onRemoveProperty={removeCompared}
          onOpenScheduleVisit={p => {
            setScheduleProperty(p);
            setScheduleType('schedule_visit');
            setIsComparisonOpen(false);
          }}
          onOpenDetail={p => {
            setDetailProperty(p);
            setIsComparisonOpen(false);
          }}
        />
      )}

      {scheduleProperty && (
        <ScheduleVisitModal
          property={scheduleProperty}
          onClose={() => setScheduleProperty(null)}
          initialType={scheduleType}
        />
      )}

      {isListPropertyOpen && (
        <ListPropertyModal
          onClose={() => setIsListPropertyOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 px-4 sm:px-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700">
          LIVORA — Transparent Citywide Hostel & PG Discovery & Healthy Competition Platform
        </p>
        <p className="max-w-xl mx-auto text-slate-400">
          Powered by real-time resident telemetry, biometric attendance tracking, and verified mess feedback logs. Zero sponsored ads.
        </p>
      </footer>
    </div>
  );
};
