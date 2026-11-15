import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Users, 
  Layers, 
  CreditCard, 
  Wrench, 
  UserCog, 
  X, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { BedStatusBadge, PaymentStatusBadge, ComplaintStatusBadge } from '../common/StatusBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (studentId: string) => void;
  onSelectRoom: (roomId: string) => void;
  onSelectComplaint: (complaintId: string) => void;
  onNavigate?: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  onSelectRoom,
  onSelectComplaint,
  onNavigate,
}) => {
  const { students, currentProperty, complaints, staff, payments } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Students
  const matchedStudents = q
    ? students.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.collegeOrWork.toLowerCase().includes(q) ||
        s.roomId.toLowerCase().includes(q)
      )
    : students.slice(0, 3);

  // Search Rooms
  const allRooms: { id: string; roomNumber: string; buildingName: string; floorName: string; bedsCount: number; occupiedCount: number }[] = [];
  currentProperty.buildings.forEach(bldg => {
    bldg.floors.forEach(flr => {
      flr.rooms.forEach(rm => {
        allRooms.push({
          id: rm.id,
          roomNumber: rm.roomNumber,
          buildingName: bldg.name,
          floorName: flr.name,
          bedsCount: rm.beds.length,
          occupiedCount: rm.beds.filter(b => b.status === 'occupied').length,
        });
      });
    });
  });

  const matchedRooms = q
    ? allRooms.filter(r => 
        r.roomNumber.toLowerCase().includes(q) ||
        r.buildingName.toLowerCase().includes(q) ||
        r.floorName.toLowerCase().includes(q)
      )
    : allRooms.slice(0, 3);

  // Search Complaints
  const matchedComplaints = q
    ? complaints.filter(c => 
        c.ticketNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.studentName.toLowerCase().includes(q) ||
        c.roomNumber.toLowerCase().includes(q)
      )
    : complaints.slice(0, 2);

  // Search Staff
  const matchedStaff = q
    ? staff.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q)
      )
    : staff.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 no-print">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students, rooms, beds, phone, complaints, staff..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
            autoFocus
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Students Section */}
          {matchedStudents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Students / Residents ({matchedStudents.length})</span>
              </div>
              <div className="space-y-1">
                {matchedStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => {
                      onSelectStudent(student.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/70 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">{student.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Room {student.roomId.replace('rm-', '')} • {student.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PaymentStatusBadge status={student.paymentStatus} />
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rooms Section */}
          {matchedRooms.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Rooms & Floors ({matchedRooms.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => {
                      onSelectRoom(room.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-left transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                        Room {room.roomNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {room.buildingName} • {room.floorName}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {room.occupiedCount}/{room.bedsCount} Beds
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Complaints Section */}
          {matchedComplaints.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                <Wrench className="w-3.5 h-3.5 text-rose-500" />
                <span>Maintenance & Tickets ({matchedComplaints.length})</span>
              </div>
              <div className="space-y-1">
                {matchedComplaints.map(cmp => (
                  <button
                    key={cmp.id}
                    onClick={() => {
                      onSelectComplaint(cmp.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {cmp.ticketNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 truncate">{cmp.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Room {cmp.roomNumber} • {cmp.studentName}
                      </div>
                    </div>
                    <ComplaintStatusBadge status={cmp.status} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Staff Section */}
          {matchedStaff.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                <UserCog className="w-3.5 h-3.5 text-amber-500" />
                <span>Duty Staff ({matchedStaff.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedStaff.map(stf => (
                  <div key={stf.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <img src={stf.avatarUrl} alt={stf.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{stf.name}</div>
                      <div className="text-[10px] text-indigo-600 font-semibold">{stf.role} • {stf.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-400">
          <span>Search query auto-filters across all hostel records</span>
          <span className="flex items-center gap-1 text-[11px]">
            Navigation: Click any result to view full record
          </span>
        </div>
      </div>
    </div>
  );
};
