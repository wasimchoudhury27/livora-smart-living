import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Bed, 
  Plus, 
  Users, 
  Wrench, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar';

interface PropertiesViewProps {
  onOpenAddProperty: () => void;
  setActiveTab?: (tab: ActiveTab) => void;
  onManageRooms?: () => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  onOpenAddProperty,
  setActiveTab,
  onManageRooms,
}) => {
  const { properties, currentProperty, setCurrentPropertyId } = useApp();

  const handleRoomsNavigate = () => {
    if (onManageRooms) onManageRooms();
    else if (setActiveTab) setActiveTab('rooms');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Property Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage your branches, buildings, rooms, and localized operational parameters.
          </p>
        </div>

        <button
          onClick={onOpenAddProperty}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Properties Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => {
          const isSelected = property.id === currentProperty.id;

          const totalRooms = property.totalRooms || 80;
          const totalBeds = property.totalBeds || 160;
          const occupied = property.occupiedBeds || (property.id === 'prop-1' ? 145 : property.id === 'prop-2' ? 72 : 88);
          const occupancyRate = ((occupied / totalBeds) * 100).toFixed(1);

          return (
            <div
              key={property.id}
              className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Top Accent Strip */}
              {isSelected && (
                <div className="bg-indigo-600 text-white text-[11px] font-bold text-center py-1 tracking-wide flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Active Branch
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {property.type}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">
                      {property.name}
                    </h3>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-indigo-600 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{property.address}, {property.city}</span>
                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/70 border border-slate-100 mb-4 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Rooms</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5">{totalRooms}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Beds</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5">{totalBeds}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Occupancy</div>
                    <div className="text-sm font-extrabold text-emerald-600 mt-0.5">{occupancyRate}%</div>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {property.amenities.slice(0, 4).map(amenity => (
                    <span
                      key={amenity}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                    >
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-slate-400">
                      +{property.amenities.length - 4} more
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span>Manager: <strong className="text-slate-800 font-semibold">{property.managerName}</strong></span>
                  <span className="text-[11px] text-slate-400 font-mono">{property.managerPhone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center gap-2">
                {isSelected ? (
                  <button
                    onClick={handleRoomsNavigate}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <span>Inspect Rooms & Beds</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPropertyId(property.id)}
                    className="w-full py-2 px-3 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Switch to this Property
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
