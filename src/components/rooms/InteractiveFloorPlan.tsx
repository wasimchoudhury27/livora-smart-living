import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room, Floor } from '../../types';
import { 
  Building2, 
  Layers, 
  Wrench, 
  Users, 
  Sparkles, 
  Maximize2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface InteractiveFloorPlanProps {
  floor?: Floor;
  onSelectRoom?: (room: Room) => void;
  className?: string;
}

interface HoveredTooltipData {
  room: Room;
  occupantNames: string[];
  openComplaints: number;
  x: number;
  y: number;
}

export const InteractiveFloorPlan: React.FC<InteractiveFloorPlanProps> = ({
  floor,
  onSelectRoom,
  className = ''
}) => {
  const { currentProperty, students, complaints } = useApp();
  const [hoveredData, setHoveredData] = useState<HoveredTooltipData | null>(null);

  // If no floor provided, find first floor with rooms
  const activeFloor = floor || currentProperty.buildings[0]?.floors[0];

  if (!activeFloor || !activeFloor.rooms || activeFloor.rooms.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-400">
        <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs font-semibold">No architectural rooms mapped for this floor.</p>
      </div>
    );
  }

  // Pre-calculate room positions in a 2D floor blueprint grid
  // Grid layout for 6 to 12 rooms with corridor in the middle
  const rooms = activeFloor.rooms;
  const half = Math.ceil(rooms.length / 2);
  const topWingRooms = rooms.slice(0, half);
  const bottomWingRooms = rooms.slice(half);

  const getOccupants = (rm: Room): string[] => {
    const names: string[] = [];
    rm.beds.forEach(bed => {
      if (bed.studentId) {
        const std = students.find(s => s.id === bed.studentId);
        if (std) names.push(std.name);
      }
    });
    return names;
  };

  const getOpenComplaintsCount = (roomNumber: string): number => {
    return complaints.filter(
      c => c.roomNumber === roomNumber && c.status !== 'Completed' && c.status !== 'Closed'
    ).length;
  };

  const handleMouseEnter = (rm: Room, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const occupants = getOccupants(rm);
    const openComplaints = getOpenComplaintsCount(rm.roomNumber);

    setHoveredData({
      room: rm,
      occupantNames: occupants,
      openComplaints,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  return (
    <div className={`relative bg-slate-900 rounded-3xl p-5 sm:p-7 text-white border border-slate-800 shadow-xl overflow-hidden ${className}`}>
      {/* Blueprint Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/30 mb-1">
            <Sparkles className="w-3 h-3" />
            Interactive Architectural Plan
          </div>
          <h3 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Floor Blueprint: {activeFloor.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-normal">
              {rooms.length} Rooms Active
            </span>
          </h3>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-400" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span>Open Ticket</span>
          </div>
        </div>
      </div>

      {/* Blueprint Drawing Area */}
      <div className="mt-6 relative select-none">
        {/* Architectural Grid Watermark */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none rounded-2xl" />

        <div className="relative z-10 space-y-4 py-2">
          {/* Top Wing Rooms */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {topWingRooms.map((rm) => {
              const occupiedCount = rm.beds.filter(b => b.status === 'occupied').length;
              const totalBeds = rm.beds.length;
              const isFull = occupiedCount >= totalBeds;
              const openComplaints = getOpenComplaintsCount(rm.roomNumber);

              return (
                <div
                  key={rm.id}
                  onClick={() => onSelectRoom && onSelectRoom(rm)}
                  onMouseEnter={(e) => handleMouseEnter(rm, e)}
                  onMouseLeave={handleMouseLeave}
                  className={`relative group rounded-xl p-3.5 transition-all duration-200 cursor-pointer border ${
                    openComplaints > 0
                      ? 'bg-rose-950/40 border-rose-500/70 shadow-rose-950/50 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.04]'
                      : isFull
                      ? 'bg-slate-800/90 border-slate-700 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.04]'
                      : 'bg-teal-950/40 border-teal-500/60 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.04]'
                  }`}
                >
                  {/* Glowing Outline on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-extrabold text-white text-sm">
                      #{rm.roomNumber}
                    </span>
                    {openComplaints > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                        {openComplaints}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {rm.sharingType}
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className={isFull ? 'text-indigo-300 font-semibold' : 'text-teal-300 font-bold'}>
                      {occupiedCount}/{totalBeds} Beds
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      {rm.hasAc ? 'AC' : 'Non-AC'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Corridor */}
          <div className="bg-slate-800/60 rounded-xl py-2 px-4 border border-dashed border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono tracking-widest text-[10px] uppercase text-slate-500">
              ◀ Lift & Fire Stairwell
            </span>
            <span className="font-semibold tracking-wider text-[11px] text-teal-400/80 uppercase">
              Main Access Corridor • {activeFloor.name}
            </span>
            <span className="font-mono tracking-widest text-[10px] uppercase text-slate-500">
              Emergency Exit ▶
            </span>
          </div>

          {/* Bottom Wing Rooms */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {bottomWingRooms.map((rm) => {
              const occupiedCount = rm.beds.filter(b => b.status === 'occupied').length;
              const totalBeds = rm.beds.length;
              const isFull = occupiedCount >= totalBeds;
              const openComplaints = getOpenComplaintsCount(rm.roomNumber);

              return (
                <div
                  key={rm.id}
                  onClick={() => onSelectRoom && onSelectRoom(rm)}
                  onMouseEnter={(e) => handleMouseEnter(rm, e)}
                  onMouseLeave={handleMouseLeave}
                  className={`relative group rounded-xl p-3.5 transition-all duration-200 cursor-pointer border ${
                    openComplaints > 0
                      ? 'bg-rose-950/40 border-rose-500/70 shadow-rose-950/50 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.04]'
                      : isFull
                      ? 'bg-slate-800/90 border-slate-700 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.04]'
                      : 'bg-teal-950/40 border-teal-500/60 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-[1.04]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-extrabold text-white text-sm">
                      #{rm.roomNumber}
                    </span>
                    {openComplaints > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                        {openComplaints}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {rm.sharingType}
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className={isFull ? 'text-indigo-300 font-semibold' : 'text-teal-300 font-bold'}>
                      {occupiedCount}/{totalBeds} Beds
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      {rm.hasAc ? 'AC' : 'Non-AC'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Hover Tooltip */}
      {hoveredData && (
        <div 
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-slate-950/95 backdrop-blur-md text-white border border-teal-500/50 shadow-2xl rounded-2xl p-3.5 w-64 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: `${hoveredData.x}px`, top: `${hoveredData.y}px` }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-sm font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Room {hoveredData.room.roomNumber}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {hoveredData.room.sharingType}
            </span>
          </div>

          {/* Occupant Names */}
          <div className="py-2 space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Current Occupant{hoveredData.occupantNames.length > 1 ? 's' : ''}:
            </p>
            {hoveredData.occupantNames.length > 0 ? (
              <div className="space-y-0.5">
                {hoveredData.occupantNames.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No occupants (Vacant)</p>
            )}
          </div>

          {/* Open Complaints Indicator */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Open Complaints:</span>
            {hoveredData.openComplaints > 0 ? (
              <span className="inline-flex items-center gap-1 font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-800">
                <Wrench className="w-3 h-3" />
                {hoveredData.openComplaints} Ticket{hoveredData.openComplaints > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                0 Pending
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
