import React, { useState } from 'react';
import { Property } from '../../types';
import { 
  MapPin, 
  Star, 
  Award, 
  Zap, 
  Calendar, 
  Layers, 
  ExternalLink, 
  Compass, 
  Navigation,
  Check
} from 'lucide-react';

interface InteractiveMapViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onOpenScheduleVisit: (property: Property) => void;
  onToggleCompare: (property: Property) => void;
  comparedPropertyIds: string[];
}

// Visual layout coordinates mapped to a mock map container
const LOCALITY_OFFSETS: Record<string, { x: number; y: number; label: string }> = {
  'Koramangala': { x: 42, y: 48, label: 'Central Tech / Student Hub' },
  'HSR Layout': { x: 48, y: 62, label: 'Boutique PGs & NIFT' },
  'Whitefield': { x: 78, y: 35, label: 'ITPL & Tech Parks' },
  'Indiranagar': { x: 55, y: 32, label: 'Urban Metro Corridor' },
  'BTM Layout': { x: 38, y: 65, label: 'Coaching & Academic' },
  'Electronic City': { x: 58, y: 82, label: 'Infosys / Wipro Hub' },
  'Bellandur': { x: 65, y: 54, label: 'EcoSpace Outer Ring' }
};

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  properties,
  onSelectProperty,
  onOpenScheduleVisit,
  onToggleCompare,
  comparedPropertyIds
}) => {
  const [selectedPropId, setSelectedPropId] = useState<string>(properties[0]?.id || '');
  const [activeLocalityFilter, setActiveLocalityFilter] = useState<string>('all');

  const selectedProperty = properties.find(p => p.id === selectedPropId) || properties[0];

  const filteredProperties = properties.filter(p => {
    if (activeLocalityFilter === 'all') return true;
    return p.listingDetails?.localityName.toLowerCase() === activeLocalityFilter.toLowerCase();
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Locality Quick Jump */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Compass className="w-4 h-4 text-teal-600" />
          <span>Bangalore Regional Zones:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['all', 'Koramangala', 'HSR Layout', 'Whitefield', 'Indiranagar', 'BTM Layout', 'Electronic City'].map(loc => (
            <button
              key={loc}
              onClick={() => setActiveLocalityFilter(loc)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeLocalityFilter === loc
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {loc === 'all' ? 'All Areas' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Box */}
      <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 shadow-sm flex flex-col justify-between">
        {/* Styled Simulated City Map Background */}
        <div className="absolute inset-0 opacity-80 pointer-events-none">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 45% 50%, rgba(20, 184, 166, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 75% 35%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
              backgroundColor: '#0f172a'
            }}
          />
          {/* Subtle Arterial Transit Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-slate-500 fill-none stroke-2">
            <path d="M 50 150 Q 250 200 450 300 T 800 400" />
            <path d="M 200 50 Q 350 250 500 450" />
            <path d="M 700 100 Q 600 300 550 500" strokeDasharray="4 4" stroke="#14b8a6" />
          </svg>
        </div>

        {/* Map Header Overlay */}
        <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 px-3.5 py-1.5 rounded-xl text-white text-xs flex items-center gap-2 shadow-sm pointer-events-auto">
            <Navigation className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-bold">Bangalore Metro Area</span>
            <span className="text-slate-400">·</span>
            <span className="text-teal-300">{filteredProperties.length} Verified Pins</span>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-xl text-slate-300 text-[11px] flex items-center gap-3 shadow-sm pointer-events-auto">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 ring-2 ring-teal-400/30" />
              Top Ranked (90+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Verified (80-89)
            </span>
          </div>
        </div>

        {/* Interactive Pins on Map Canvas */}
        <div className="absolute inset-0 pointer-events-auto">
          {filteredProperties.map(p => {
            const locName = p.listingDetails?.localityName || 'Koramangala';
            const offset = LOCALITY_OFFSETS[locName] || { x: 50, y: 50, label: locName };
            const isSelected = p.id === selectedPropId;
            const score = p.listingDetails?.livabilityScore || 85;

            return (
              <div
                key={p.id}
                style={{ left: `${offset.x}%`, top: `${offset.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                onClick={() => setSelectedPropId(p.id)}
              >
                {/* Pin Tooltip / Tag */}
                <div 
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-lg border transition-all duration-200 ${
                    isSelected
                      ? 'bg-teal-600 text-white border-white ring-4 ring-teal-500/30 scale-110 z-30'
                      : 'bg-slate-900/90 backdrop-blur-md text-white border-slate-700 hover:scale-105 hover:bg-slate-800'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-teal-400'}`} />
                  <span className="text-xs font-bold whitespace-nowrap">
                    ₹{p.listingDetails?.startingPrice ? (p.listingDetails.startingPrice / 1000).toFixed(1) + 'k' : '8k'}
                  </span>
                  <span className={`text-[10px] font-extrabold px-1 rounded ${
                    score >= 90 ? 'bg-teal-500/40 text-teal-200' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {score}
                  </span>
                </div>

                {/* Subtitle label on hover or when selected */}
                {(isSelected || false) && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-semibold text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded shadow">
                    {p.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Property Preview Bottom Card */}
        {selectedProperty && (
          <div className="relative z-30 p-4 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-xl max-w-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={selectedProperty.listingDetails?.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&auto=format&fit=crop&q=80'}
                  alt=""
                  className="w-16 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 truncate text-sm">
                      {selectedProperty.name}
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded shrink-0">
                      Score {selectedProperty.listingDetails?.livabilityScore || 85}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    {selectedProperty.listingDetails?.localityName || selectedProperty.city} · {selectedProperty.listingDetails?.gender || 'Co-ed'}
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Starting from ₹{selectedProperty.listingDetails?.startingPrice.toLocaleString()} / mo
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  onClick={() => onToggleCompare(selectedProperty)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    comparedPropertyIds.includes(selectedProperty.id)
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {comparedPropertyIds.includes(selectedProperty.id) ? '✓ Compared' : '+ Compare'}
                </button>

                <button
                  onClick={() => onSelectProperty(selectedProperty)}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
