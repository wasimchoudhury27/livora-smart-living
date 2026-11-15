import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Room, Bed, BedStatus } from '../../types';
import { BedStatusBadge } from '../common/StatusBadge';
import { 
  Bed as BedIcon, 
  User, 
  Phone, 
  Wrench, 
  Plus, 
  CheckCircle, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  DollarSign
} from 'lucide-react';

interface RoomDetailDrawerProps {
  room: Room | null;
  buildingName?: string;
  floorName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (studentId: string) => void;
  onOpenCreateComplaintForRoom?: (roomNumber: string) => void;
  onOpenCheckInForBed?: (buildingId: string, floorId: string, roomId: string, bedId: string) => void;
  onOpenAdmission?: () => void;
}

export const RoomDetailDrawer: React.FC<RoomDetailDrawerProps> = ({
  room,
  buildingName = 'Main Block',
  floorName = 'Floor 1',
  isOpen,
  onClose,
  onSelectStudent,
  onOpenCreateComplaintForRoom = () => {},
  onOpenCheckInForBed = () => {},
  onOpenAdmission,
}) => {
  const { currentProperty, updateBedStatus, students, complaints, showToast } = useApp();
  const [selectedBedToEdit, setSelectedBedToEdit] = useState<string | null>(null);

  if (!room) return null;

  // Complaints attached to this room
  const roomComplaints = complaints.filter(
    c => c.propertyId === currentProperty.id && c.roomNumber === room.roomNumber
  );

  const handleStatusChange = (bedId: string, newStatus: BedStatus) => {
    updateBedStatus(room.buildingId, room.floorId, room.id, bedId, newStatus);
    setSelectedBedToEdit(null);
    showToast('Bed Status Updated', `Changed to ${newStatus.toUpperCase()}`, 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Room ${room.roomNumber} Overview`}
      subtitle={`${buildingName} • ${floorName} • ${room.sharingType} Sharing`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Room Attributes Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{room.sharingType}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rent / Bed</span>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">₹{room.monthlyRentPerBed.toLocaleString('en-IN')}/mo</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Washroom</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {room.hasAttachedWashroom ? 'Attached' : 'Common'}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Air Conditioned</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {room.hasAc ? 'Yes (AC)' : 'Non-AC'}
            </div>
          </div>
        </div>

        {/* Beds Status & Tenants Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BedIcon className="w-4 h-4 text-indigo-600" />
              <span>Assigned Beds ({room.beds.length})</span>
            </h4>
            <span className="text-xs text-slate-500">
              {room.beds.filter(b => b.status === 'occupied').length} Occupied / {room.beds.filter(b => b.status === 'available').length} Available
            </span>
          </div>

          <div className="space-y-3">
            {room.beds.map(bed => {
              const assignedTenant = students.find(s => s.id === bed.studentId);
              const isEditing = selectedBedToEdit === bed.id;

              return (
                <div
                  key={bed.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {bed.code.replace('Bed ', '')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{bed.code}</span>
                        <BedStatusBadge status={bed.status} />
                      </div>

                      {assignedTenant ? (
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <button
                            onClick={() => {
                              onClose();
                              onSelectStudent(assignedTenant.id);
                            }}
                            className="font-bold text-indigo-600 hover:underline"
                          >
                            {assignedTenant.name}
                          </button>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-mono text-[11px]">{assignedTenant.phone}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 mt-1">
                          No tenant currently allocated to this bed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bed Status Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {bed.status === 'available' ? (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenCheckInForBed(room.buildingId, room.floorId, room.id, bed.id);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Admit Tenant</span>
                      </button>
                    ) : null}

                    {/* Status Changer Menu */}
                    <div className="relative">
                      {isEditing ? (
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                          {(['available', 'occupied', 'reserved', 'maintenance', 'blocked'] as BedStatus[]).map(st => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(bed.id, st)}
                              className={`px-2 py-1 text-[10px] font-bold rounded capitalize ${
                                bed.status === st ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-white'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                          <button
                            onClick={() => setSelectedBedToEdit(null)}
                            className="text-xs px-1 text-slate-400 hover:text-slate-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedBedToEdit(bed.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                        >
                          Change Status
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Complaints / Tickets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-rose-500" />
              <span>Room Maintenance History ({roomComplaints.length})</span>
            </h4>
            <button
              onClick={() => {
                onClose();
                onOpenCreateComplaintForRoom(room.roomNumber);
              }}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Raise Room Ticket
            </button>
          </div>

          {roomComplaints.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No reported maintenance issues for Room {room.roomNumber}
            </div>
          ) : (
            <div className="space-y-2">
              {roomComplaints.map(cmp => (
                <div
                  key={cmp.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{cmp.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-slate-600">
                        {cmp.category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{cmp.description}</p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
                    {cmp.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
