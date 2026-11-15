import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { 
  User, 
  Users, 
  Layers, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Bed as BedIcon
} from 'lucide-react';

interface AdmissionWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedBuildingId?: string;
  preSelectedFloorId?: string;
  preSelectedRoomId?: string;
  preSelectedBedId?: string;
}

export const AdmissionWizardModal: React.FC<AdmissionWizardModalProps> = ({
  isOpen,
  onClose,
  preSelectedBuildingId,
  preSelectedFloorId,
  preSelectedRoomId,
  preSelectedBedId,
}) => {
  const { currentProperty, addStudent, showToast } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    collegeOrWork: '',
    emergencyContact: '',
    guardianName: '',
    guardianRelationship: 'Father',
    guardianPhone: '',
    guardianAddress: '',
    buildingId: preSelectedBuildingId || currentProperty.buildings[0]?.id || '',
    floorId: preSelectedFloorId || currentProperty.buildings[0]?.floors[0]?.id || '',
    roomId: preSelectedRoomId || '',
    bedId: preSelectedBedId || '',
    monthlyFee: 8000,
    securityDeposit: 16000,
    dueDay: 5,
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const activeBuilding = currentProperty.buildings.find(b => b.id === formData.buildingId) || currentProperty.buildings[0];
  const activeFloor = activeBuilding?.floors.find(f => f.id === formData.floorId) || activeBuilding?.floors[0];
  const activeRoom = activeFloor?.rooms.find(r => r.id === formData.roomId);

  // Available beds in active room
  const availableBeds = activeRoom?.beds.filter(b => b.status === 'available') || [];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone) {
        showToast('Required fields', 'Please enter student name and phone number', 'warning');
        return;
      }
    }
    if (step === 2) {
      if (!formData.guardianName || !formData.guardianPhone) {
        showToast('Required fields', 'Please enter guardian contact information', 'warning');
        return;
      }
    }
    if (step === 3) {
      if (!formData.roomId || !formData.bedId) {
        showToast('Select Bed', 'Please allocate a room and bed for this student', 'warning');
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleFinalSubmit = () => {
    const studentId = 'std-' + Date.now();
    const newStudent: Student = {
      id: studentId,
      propertyId: currentProperty.id,
      buildingId: formData.buildingId,
      floorId: formData.floorId,
      name: formData.name,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: formData.phone,
      gender: formData.gender,
      collegeOrWork: formData.collegeOrWork || 'Student',
      emergencyContact: formData.emergencyContact || formData.guardianPhone,
      guardian: {
        name: formData.guardianName,
        relationship: formData.guardianRelationship,
        phone: formData.guardianPhone,
        address: formData.guardianAddress,
      },
      roomId: formData.roomId,
      bedId: formData.bedId,
      joiningDate: formData.joiningDate,
      monthlyFee: Number(formData.monthlyFee),
      securityDeposit: Number(formData.securityDeposit),
      dueDay: Number(formData.dueDay),
      paymentStatus: 'paid', // Initial advance/deposit collected
      status: 'Active',
      avatarUrl: `https://images.unsplash.com/photo-${formData.gender === 'Female' ? '1544005313-94ddf0286df2' : '1507003211169-0a1dd7228f2d'}?w=100&auto=format&fit=crop&q=80`,
      documents: [
        { id: `doc-${Date.now()}-1`, name: 'Aadhaar Card Copy', type: 'Aadhaar', url: '#', uploadedAt: formData.joiningDate, verified: true },
        { id: `doc-${Date.now()}-2`, name: 'Institution ID / Work Proof', type: 'College ID', url: '#', uploadedAt: formData.joiningDate, verified: true },
        { id: `doc-${Date.now()}-3`, name: 'Hostel Tenancy Agreement', type: 'Agreement', url: '#', uploadedAt: formData.joiningDate, verified: true },
      ],
    };

    addStudent(newStudent);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Resident Admission Check-In"
      subtitle="Complete onboarding wizard with automatic bed status allocation"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Step Progress Pills */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
          {[
            { num: 1, label: 'Student Info', icon: User },
            { num: 2, label: 'Guardian', icon: Users },
            { num: 3, label: 'Room & Bed', icon: Layers },
            { num: 4, label: 'Fee & Finalize', icon: CreditCard },
          ].map(s => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 font-semibold ${
                  isCurrent
                    ? 'text-indigo-600'
                    : isCompleted
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Student Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Step 1: Resident Personal Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="rahul.sharma@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / Employer Institute
                </label>
                <input
                  type="text"
                  placeholder="e.g. Christ University / Infosys"
                  value={formData.collegeOrWork}
                  onChange={e => setFormData({ ...formData, collegeOrWork: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Phone Contact
                </label>
                <input
                  type="tel"
                  placeholder="+91 99000 11223"
                  value={formData.emergencyContact}
                  onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Guardian Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Step 2: Parent / Guardian Verification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={formData.guardianName}
                  onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                <select
                  value={formData.guardianRelationship}
                  onChange={e => setFormData({ ...formData, guardianRelationship: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Local Guardian">Local Guardian</option>
                  <option value="Sibling">Sibling</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Guardian Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94444 55555"
                  value={formData.guardianPhone}
                  onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Address</label>
                <input
                  type="text"
                  placeholder="e.g. House 42, Civil Lines, Jaipur"
                  value={formData.guardianAddress}
                  onChange={e => setFormData({ ...formData, guardianAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Space Allocation (Hierarchy) */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Step 3: Building, Floor, Room & Bed Selection
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Building</label>
                <select
                  value={formData.buildingId}
                  onChange={e => {
                    const bId = e.target.value;
                    const bldg = currentProperty.buildings.find(b => b.id === bId);
                    setFormData({
                      ...formData,
                      buildingId: bId,
                      floorId: bldg?.floors[0]?.id || '',
                      roomId: '',
                      bedId: '',
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                >
                  {currentProperty.buildings.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Floor</label>
                <select
                  value={formData.floorId}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      floorId: e.target.value,
                      roomId: '',
                      bedId: '',
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                >
                  {activeBuilding?.floors.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room</label>
                <select
                  value={formData.roomId}
                  onChange={e => {
                    const rId = e.target.value;
                    const rm = activeFloor?.rooms.find(r => r.id === rId);
                    const firstAvail = rm?.beds.find(b => b.status === 'available');
                    setFormData({
                      ...formData,
                      roomId: rId,
                      bedId: firstAvail?.id || '',
                      monthlyFee: rm?.monthlyRentPerBed || formData.monthlyFee,
                    });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
                >
                  <option value="">Select Room</option>
                  {activeFloor?.rooms.map(r => {
                    const avail = r.beds.filter(b => b.status === 'available').length;
                    return (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} ({r.sharingType} - {avail} beds free)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Bed picker */}
            {activeRoom && (
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">
                  Select Available Bed in Room {activeRoom.roomNumber}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {activeRoom.beds.map(bed => {
                    const isAvailable = bed.status === 'available';
                    const isSelected = formData.bedId === bed.id;

                    return (
                      <button
                        type="button"
                        key={bed.id}
                        disabled={!isAvailable}
                        onClick={() => setFormData({ ...formData, bedId: bed.id })}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : isAvailable
                            ? 'bg-white hover:border-indigo-300 text-slate-800'
                            : 'bg-slate-100 opacity-50 cursor-not-allowed text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{bed.code}</span>
                          <span className={`text-[10px] font-semibold uppercase ${isSelected ? 'text-indigo-200' : isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {isAvailable ? 'Free' : bed.status}
                          </span>
                        </div>
                        <span className="text-[11px] mt-1 font-mono">
                          ₹{activeRoom.monthlyRentPerBed.toLocaleString('en-IN')}/mo
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Fees & Finalize */}
        {step === 4 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Step 4: Financial Setup & Due Dates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  value={formData.monthlyFee}
                  onChange={e => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={e => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Due Day
                </label>
                <select
                  value={formData.dueDay}
                  onChange={e => setFormData({ ...formData, dueDay: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600 font-semibold"
                >
                  <option value={1}>1st of Month</option>
                  <option value={5}>5th of Month (Standard)</option>
                  <option value={10}>10th of Month</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Joining / Move-in Date</label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            {/* Final Confirmation Card */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Onboarding Summary</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Confirming check-in for <strong>{formData.name}</strong> into{' '}
                <strong>Room {activeRoom?.roomNumber || formData.roomId} ({formData.bedId.split('-').pop()?.toUpperCase()})</strong>.
                Total initial collection recorded: ₹{(formData.monthlyFee + formData.securityDeposit).toLocaleString('en-IN')}. Bed status will automatically switch to <strong>Occupied</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Admission</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
