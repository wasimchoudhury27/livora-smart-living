import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import { Wrench, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CreateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedRoomNumber?: string;
}

export const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({
  isOpen,
  onClose,
  preSelectedRoomNumber,
}) => {
  const { currentProperty, students, addComplaint } = useApp();

  const propertyStudents = students.filter(s => s.propertyId === currentProperty.id);

  const [studentId, setStudentId] = useState<string>(propertyStudents[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Electricity');
  const [priority, setPriority] = useState<ComplaintPriority>('high');
  const [description, setDescription] = useState('');

  const selectedStudent = propertyStudents.find(s => s.id === studentId);
  const roomNumber = preSelectedRoomNumber || selectedStudent?.roomId.replace('rm-', '') || '101';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addComplaint({
      propertyId: currentProperty.id,
      studentId: selectedStudent?.id || 'std-guest',
      studentName: selectedStudent?.name || 'Resident',
      roomNumber,
      category,
      priority,
      title,
      description,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Maintenance Complaint"
      subtitle={`Raise ticket for ${currentProperty.name} • Room ${roomNumber}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reporting Resident *
          </label>
          <select
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-semibold"
          >
            {propertyStudents.map(std => (
              <option key={std.id} value={std.id}>
                {std.name} — Room {std.roomId.replace('rm-', '')}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ComplaintCategory)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-medium"
            >
              <option value="Electricity">Electricity / Wiring</option>
              <option value="Plumbing">Plumbing / Water</option>
              <option value="Wi-Fi">Wi-Fi / Internet</option>
              <option value="Cleaning">Cleaning & Housekeeping</option>
              <option value="Carpentry">Carpentry / Furniture</option>
              <option value="Other">Other Facility Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Severity / Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as ComplaintPriority)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-bold"
            >
              <option value="low">Low (General)</option>
              <option value="medium">Medium (Within 24h)</option>
              <option value="high">High (Urgent Attention)</option>
              <option value="urgent">Urgent / Safety Hazard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Issue Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Geyser water not heating or loose wall socket"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description & Exact Details *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what is happening, exact location in room, when it started..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
          />
        </div>

        {/* Priority Advisory */}
        {priority === 'urgent' && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Marking as Urgent will broadcast an instant alert to maintenance technicians.</span>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Ticket</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
