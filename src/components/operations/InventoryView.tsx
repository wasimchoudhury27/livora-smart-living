import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Boxes, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Wrench, 
  Tag, 
  RefreshCw 
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Furniture' | 'Electrical' | 'Plumbing' | 'Linen' | 'Appliance';
  inStock: number;
  minThreshold: number;
  unit: string;
  location: string;
  condition: 'Optimal' | 'Refurbished' | 'Needs Restock';
}

export const InventoryView: React.FC = () => {
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [items, setItems] = useState<InventoryItem[]>([
    { id: 'inv-1', name: '1.5 Ton Split AC Units (Daikin)', category: 'Appliance', inStock: 32, minThreshold: 30, unit: 'Units', location: 'Wing A & B Rooms', condition: 'Optimal' },
    { id: 'inv-2', name: 'Instant Geysers 15L (Havells)', category: 'Appliance', inStock: 28, minThreshold: 28, unit: 'Units', location: 'Attached Baths', condition: 'Optimal' },
    { id: 'inv-3', name: 'Orthopedic Foam Mattresses (Single)', category: 'Furniture', inStock: 6, minThreshold: 10, unit: 'Pieces', location: 'Central Store B2', condition: 'Needs Restock' },
    { id: 'inv-4', name: 'LED Batten 20W Warm/White', category: 'Electrical', inStock: 42, minThreshold: 15, unit: 'Pcs', location: 'Electrical Store', condition: 'Optimal' },
    { id: 'inv-5', name: 'Brass Ceramic Tap Spindles', category: 'Plumbing', inStock: 5, minThreshold: 12, unit: 'Sets', location: 'Maintenance Workshop', condition: 'Needs Restock' },
    { id: 'inv-6', name: 'Study Chairs Ergonomic Mesh', category: 'Furniture', inStock: 14, minThreshold: 8, unit: 'Chairs', location: 'Basement Storage', condition: 'Optimal' },
    { id: 'inv-7', name: 'Premium Cotton Bed Linen Sets', category: 'Linen', inStock: 75, minThreshold: 40, unit: 'Sets', location: 'Linen Laundry Store', condition: 'Optimal' },
  ]);

  const categories = ['all', 'Appliance', 'Furniture', 'Electrical', 'Plumbing', 'Linen'];

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleRestock = (id: string, name: string) => {
    setItems(items.map(it => it.id === id ? { ...it, inStock: it.inStock + 10, condition: 'Optimal' } : it));
    showToast('Restock Order Placed', `Added 10 units to stock for ${name}.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-700/50 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Boxes className="w-3.5 h-3.5" />
              Property Assets & Inventory Register
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Inventory & Assets</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Monitor room appliances, replacement spares, bedding stock, and maintenance materials across the property.
            </p>
          </div>
          <button
            onClick={() => showToast('New Asset Entry', 'Opening asset registration modal...', 'info')}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset Item</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items, appliances, spares, room locations..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterCategory === c
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c === 'all' ? 'All Inventory' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {item.category}
                </span>
                {item.inStock <= item.minThreshold ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertTriangle className="w-3 h-3" /> Low Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">
                    <CheckCircle2 className="w-3 h-3" /> In Stock
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{item.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{item.location}</p>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Current Stock</p>
                  <p className="text-lg font-extrabold text-slate-900">{item.inStock} {item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Threshold</p>
                  <p className="text-sm font-semibold text-slate-600">{item.minThreshold} {item.unit}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRestock(item.id, item.name)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Log Restock / Replenish</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
