import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room, BedStatus } from '../../types';
import { BedStatusBadge } from '../common/StatusBadge';
import { RoomDetailDrawer } from './RoomDetailDrawer';
import { InteractiveFloorPlan } from './InteractiveFloorPlan';
import { 
  Building2, 
  Layers, 
  Bed as BedIcon, 
  Search, 
  Filter, 
  Plus, 
  Wrench, 
  User, 
  Sparkles,
  CheckCircle2,
  MapPin,
  LayoutGrid
} from 'lucide-react';

interface RoomBedManagementProps {
  onSelectStudent?: (studentId: string) => void;
  onOpenCreateComplaintForRoom?: (roomNumber: string) => void;
  onOpenCheckInForBed?: (buildingId: string, floorId: string, roomId: string, bedId: string) => void;
  onSelectRoom?: (room: Room) => void;
  onOpenAddStudent?: () => void;
}

export const RoomBedManagement: React.FC<RoomBedManagementProps> = ({
  onSelectStudent = () => {},
  onOpenCreateComplaintForRoom = () => {},
  onOpenCheckInForBed = () => {},
  onSelectRoom,
  onOpenAddStudent = () => {},
}) => {
  const { currentProperty, students, complaints } = useApp();

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(
    currentProperty.buildings[0]?.id || ''
  );
  const [selectedFloorId, setSelectedFloorId] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected room for drawer modal
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRoomMeta, setSelectedRoomMeta] = useState<{ bldgName: string; floorName: string }>({
    bldgName: '',
    floorName: '',
  });

  const activeBuilding = currentProperty.buildings.find(b => b.id === selectedBuildingId) || currentProperty.buildings[0];

  // Filtered rooms
  const roomsList: { room: Room; bldgName: string; floorName: string }[] = [];
  if (activeBuilding) {
    activeBuilding.floors.forEach(flr => {
      if (selectedFloorId === 'all' || flr.id === selectedFloorId) {
        flr.rooms.forEach(rm => {
          // Status filter
          let matchesStatus = true;
          if (selectedStatusFilter !== 'all') {
            matchesStatus = rm.beds.some(b => b.status === selectedStatusFilter);
          }

          // Search query
          let matchesSearch = true;
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const hasMatchingBedStudent = rm.beds.some(b => {
              const std = students.find(s => s.id === b.studentId);
              return std?.name.toLowerCase().includes(q);
            });
            matchesSearch = rm.roomNumber.toLowerCase().includes(q) || hasMatchingBedStudent;
          }

          if (matchesStatus && matchesSearch) {
            roomsList.push({ room: rm, bldgName: activeBuilding.name, floorName: flr.name });
          }
        });
      }
    });
  }

  // Count summaries for active building
  let buildingTotalBeds = 0;
  let buildingOccupiedBeds = 0;
  let buildingAvailableBeds = 0;
  activeBuilding?.floors.forEach(flr => {
    flr.rooms.forEach(rm => {
      buildingTotalBeds += rm.beds.length;
      buildingOccupiedBeds += rm.beds.filter(b => b.status === 'occupied').length;
      buildingAvailableBeds += rm.beds.filter(b => b.status === 'available').length;
    });
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span>•</span>
            <span className="text-indigo-600 font-bold">Space Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Room & Bed Hierarchy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time visual map: Property → Building → Floor → Room → Bed allocation.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium p-2 rounded-xl bg-white border border-slate-200">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
          </span>
          <span className="flex items-center gap-1 text-blue-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Occupied
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Maintenance
          </span>
        </div>
      </div>

      {/* Building Selector Tabs & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {currentProperty.buildings.map(bldg => {
            const isSelected = bldg.id === activeBuilding?.id;
            return (
              <button
                key={bldg.id}
                onClick={() => {
                  setSelectedBuildingId(bldg.id);
                  setSelectedFloorId('all');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{bldg.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 px-2 font-medium">
          <span>Capacity: <strong className="text-slate-900">{buildingTotalBeds} Beds</strong></span>
          <span>•</span>
          <span className="text-emerald-600 font-bold">{buildingOccupiedBeds} Occupied</span>
          <span>•</span>
          <span className="text-indigo-600 font-bold">{buildingAvailableBeds} Available</span>
        </div>
      </div>

      {/* Filters: Floor Tabs & Status Dropdown & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Floor Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedFloorId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              selectedFloorId === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Floors
          </button>
          {activeBuilding?.floors.map(flr => (
            <button
              key={flr.id}
              onClick={() => setSelectedFloorId(flr.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                selectedFloorId === flr.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {flr.name}
            </button>
          ))}
        </div>

        {/* Search & Bed Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search room # or resident..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Bed Statuses</option>
            <option value="available">🟢 Available Only</option>
            <option value="occupied">🔵 Occupied Only</option>
            <option value="maintenance">🔴 Maintenance</option>
            <option value="reserved">🟡 Reserved</option>
          </select>
        </div>
      </div>

      {/* Interactive Floor Plan Diagram with hover animations and custom tooltips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Interactive Floor Architecture • {activeBuilding?.floors.find(f => f.id === selectedFloorId)?.name || activeBuilding?.floors[0]?.name || 'Floor 1'}
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Hover over any room shape to inspect occupants & open tickets
          </span>
        </div>

        <InteractiveFloorPlan
          floor={activeBuilding?.floors.find(f => f.id === selectedFloorId) || activeBuilding?.floors[0]}
          onSelectRoom={(rm) => {
            setSelectedRoom(rm);
            setSelectedRoomMeta({
              bldgName: activeBuilding?.name || 'Main Wing',
              floorName: activeBuilding?.floors.find(f => f.id === rm.floorId)?.name || 'Floor 1'
            });
          }}
        />
      </div>

      {/* Visual Room Cards Grid */}
      <div className="pt-2">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
          <span>Detailed Bed Allocation Cards ({roomsList.length} Rooms)</span>
          <span className="text-xs font-normal text-slate-500">Click card for resident lease actions</span>
        </h3>
      </div>

      {roomsList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
          <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <h4 className="text-sm font-bold text-slate-700">No rooms match filter criteria</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting the floor filter or bed status dropdown.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roomsList.map(({ room, bldgName, floorName }) => {
            const occupiedCount = room.beds.filter(b => b.status === 'occupied').length;
            const availableCount = room.beds.filter(b => b.status === 'available').length;
            const roomComplaintsCount = complaints.filter(
              c => c.propertyId === currentProperty.id && c.roomNumber === room.roomNumber && c.status !== 'Completed' && c.status !== 'Closed'
            ).length;

            return (
              <div
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setSelectedRoomMeta({ bldgName, floorName });
                }}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-5 cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  {/* Card Header: Room Number, Floor, Complaints Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
                          Room {room.roomNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {room.sharingType}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {floorName} • {room.hasAttachedWashroom ? 'Attached Bath' : 'Common Bath'} {room.hasAc ? '• AC' : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {roomComplaintsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <Wrench className="w-3 h-3" /> {roomComplaintsCount}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-700">
                        {occupiedCount}/{room.beds.length}
                      </span>
                    </div>
                  </div>

                  {/* Bed Chips List */}
                  <div className="space-y-2 mt-4">
                    {room.beds.map(bed => {
                      const assignedTenant = students.find(s => s.id === bed.studentId);
                      return (
                        <div
                          key={bed.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-bold text-slate-800 text-[11px] font-mono shrink-0">
                              {bed.code}:
                            </span>
                            {assignedTenant ? (
                              <span className="font-semibold text-slate-700 truncate">
                                {assignedTenant.name}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Vacant Bed</span>
                            )}
                          </div>
                          <BedStatusBadge status={bed.status} size="sm" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Footer: Rent and click prompt */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    ₹{room.monthlyRentPerBed.toLocaleString('en-IN')}<span className="text-[11px] text-slate-400 font-normal">/bed/mo</span>
                  </span>
                  <span className="text-indigo-600 font-semibold text-[11px] group-hover:underline">
                    View Room Drawer →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Room Detail Drawer Modal */}
      <RoomDetailDrawer
        room={selectedRoom}
        buildingName={selectedRoomMeta.bldgName}
        floorName={selectedRoomMeta.floorName}
        isOpen={Boolean(selectedRoom)}
        onClose={() => setSelectedRoom(null)}
        onSelectStudent={onSelectStudent}
        onOpenCreateComplaintForRoom={onOpenCreateComplaintForRoom}
        onOpenCheckInForBed={onOpenCheckInForBed}
      />
    </div>
  );
};
