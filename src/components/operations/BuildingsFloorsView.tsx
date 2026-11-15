import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  Building2, 
  DoorClosed, 
  Users, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Bed, 
  ArrowUpRight 
} from 'lucide-react';

export const BuildingsFloorsView: React.FC = () => {
  const { currentProperty, showToast } = useApp();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(
    currentProperty?.buildings?.[0]?.id || ''
  );

  const buildings = currentProperty?.buildings || [];
  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Layers className="w-3.5 h-3.5" />
              Structural Architecture & Floor Layouts
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Buildings & Floors</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Inspect wings, vertical floors, room distribution, and bed allocation across {currentProperty?.name || 'LIVORA'}.
            </p>
          </div>
          <button
            onClick={() => showToast('New Floor Addition', 'Floor creation wizard initiated for ' + (selectedBuilding?.name || 'Wing A'), 'info')}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Floor / Wing</span>
          </button>
        </div>
      </div>

      {/* Building Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {buildings.map((bld) => {
          const isSelected = selectedBuilding?.id === bld.id;
          const totalFloors = bld.floors?.length || 0;
          const totalRooms = bld.floors?.reduce((acc, f) => acc + (f.rooms?.length || 0), 0) || 0;

          return (
            <button
              key={bld.id}
              onClick={() => setSelectedBuildingId(bld.id)}
              className={`px-4 py-3 rounded-2xl border text-left transition-all min-w-[180px] ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-xs ring-2 ring-teal-500/10'
                  : 'bg-white/80 border-slate-200 hover:bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-teal-600' : 'text-slate-400'}`}>
                  Building Block
                </span>
                <Building2 className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
              </div>
              <p className="text-sm font-bold text-slate-900">{bld.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{totalFloors} Floors • {totalRooms} Rooms</p>
            </button>
          );
        })}
      </div>

      {/* Floors List */}
      <div className="space-y-4">
        {selectedBuilding?.floors?.map((floor) => {
          const totalRooms = floor.rooms?.length || 0;
          const totalBeds = floor.rooms?.reduce((acc, r) => acc + (r.beds?.length || 0), 0) || 0;
          const occupiedBeds = floor.rooms?.reduce((acc, r) => 
            acc + (r.beds?.filter(b => b.status === 'occupied')?.length || 0), 0
          ) || 0;
          const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

          return (
            <div 
              key={floor.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                    {floor.floorNumber === 0 ? 'G' : `F${floor.floorNumber}`}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{floor.name}</h3>
                    <p className="text-xs text-slate-500">{totalRooms} Active Rooms • {totalBeds} Total Beds</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Floor Occupancy</p>
                    <p className="text-sm font-bold text-slate-900">{occupiedBeds} / {totalBeds} Beds ({occupancyRate}%)</p>
                  </div>
                  <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${occupancyRate > 90 ? 'bg-amber-500' : 'bg-teal-500'}`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Room Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                {floor.rooms?.map((rm) => {
                  const rmOccupied = rm.beds?.filter(b => b.status === 'occupied').length || 0;
                  const rmTotal = rm.beds?.length || 1;
                  const isFull = rmOccupied >= rmTotal;

                  return (
                    <div
                      key={rm.id}
                      className={`p-3 rounded-xl border transition-all text-center ${
                        isFull
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-teal-50/40 border-teal-200 text-teal-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span>Rm {rm.roomNumber}</span>
                        <span className={`w-2 h-2 rounded-full ${isFull ? 'bg-slate-400' : 'bg-teal-500'}`} />
                      </div>
                      <p className="text-[10px] text-slate-500 capitalize">{rm.sharingType}</p>
                      <p className="text-xs font-semibold mt-1">
                        {rmOccupied}/{rmTotal} <span className="text-[10px] font-normal text-slate-500">Beds</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
