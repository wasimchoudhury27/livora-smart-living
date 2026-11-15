import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';
import { Building2, MapPin, User, Phone, Check } from 'lucide-react';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addProperty } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Hostel' as const,
    address: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    managerName: '',
    managerPhone: '',
    totalRooms: 40,
    totalBeds: 80,
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-speed Wi-Fi',
    '3-Time Mess',
    'Daily Housekeeping',
    'Biometric Entry',
  ]);

  const amenityOptions = [
    'High-speed Wi-Fi',
    '3-Time Mess',
    'Daily Housekeeping',
    'Biometric Entry',
    '24x7 Power Backup',
    'Gym & Recreation',
    'RO Water Dispenser',
    'CCTV Security',
    'Laundry Service',
    'AC Rooms',
  ];

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    const propId = 'prop-' + Date.now();
    const newProperty: Property = {
      id: propId,
      name: formData.name,
      code: formData.code || formData.name.substring(0, 3).toUpperCase(),
      type: formData.type,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      managerName: formData.managerName || 'Property Admin',
      managerPhone: formData.managerPhone || '+91 98000 00000',
      amenities: selectedAmenities,
      totalRooms: Number(formData.totalRooms),
      totalBeds: Number(formData.totalBeds),
      occupiedBeds: 0,
      buildings: [
        {
          id: `bldg-${propId}-1`,
          propertyId: propId,
          name: 'Main Block',
          floors: [
            {
              id: `flr-${propId}-1`,
              buildingId: `bldg-${propId}-1`,
              floorNumber: 1,
              name: 'Floor 1',
              rooms: [
                {
                  id: `rm-${propId}-101`,
                  buildingId: `bldg-${propId}-1`,
                  floorId: `flr-${propId}-1`,
                  propertyId: propId,
                  roomNumber: '101',
                  sharingType: 'Double',
                  monthlyRentPerBed: 8000,
                  hasAttachedWashroom: true,
                  hasAc: false,
                  beds: [
                    { id: `bed-${propId}-101-a`, code: 'Bed A', status: 'available', monthlyRent: 8000 },
                    { id: `bed-${propId}-101-b`, code: 'Bed B', status: 'available', monthlyRent: 8000 },
                  ],
                },
                {
                  id: `rm-${propId}-102`,
                  buildingId: `bldg-${propId}-1`,
                  floorId: `flr-${propId}-1`,
                  propertyId: propId,
                  roomNumber: '102',
                  sharingType: 'Single',
                  monthlyRentPerBed: 14000,
                  hasAttachedWashroom: true,
                  hasAc: true,
                  beds: [
                    { id: `bed-${propId}-102-a`, code: 'Bed A', status: 'available', monthlyRent: 14000 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    addProperty(newProperty);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Property"
      subtitle="Register a new hostel, PG, or co-living branch into StaySphere"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Property Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Greenwood Student Residency"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Property Type
            </label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            >
              <option value="Hostel">Hostel (Student / University)</option>
              <option value="PG">PG (Paying Guest Accommodation)</option>
              <option value="Co-Living">Co-Living Space (Professionals)</option>
              <option value="Rental">Rental Property / Apartments</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            placeholder="e.g. 142, 5th Cross, Near Christ University, Koramangala"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={e => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Branch Manager Name
            </label>
            <input
              type="text"
              value={formData.managerName}
              onChange={e => setFormData({ ...formData, managerName: e.target.value })}
              placeholder="e.g. Vikramaditya Rao"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manager Contact Phone
            </label>
            <input
              type="text"
              value={formData.managerPhone}
              onChange={e => setFormData({ ...formData, managerPhone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Room Capacity
            </label>
            <input
              type="number"
              value={formData.totalRooms}
              onChange={e => setFormData({ ...formData, totalRooms: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Bed Capacity
            </label>
            <input
              type="number"
              value={formData.totalBeds}
              onChange={e => setFormData({ ...formData, totalBeds: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Key Amenities Provided
          </label>
          <div className="flex flex-wrap gap-1.5">
            {amenityOptions.map(amenity => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>

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
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Create Property
          </button>
        </div>
      </form>
    </Modal>
  );
};
