import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Printer, 
  Layers, 
  Users, 
  CreditCard, 
  PieChart,
  Calendar,
  CheckCircle2,
  Zap,
  Activity
} from 'lucide-react';
import { EnergyUsageVisualizer } from './EnergyUsageVisualizer';

interface AnalyticsViewProps {
  defaultTab?: 'occupancy' | 'energy';
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ defaultTab = 'energy' }) => {
  const { currentProperty, stats, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'occupancy' | 'energy'>(defaultTab);

  const handleExportCSV = () => {
    showToast('Report Exported', 'LIVORA monthly audit & energy telemetry exported to CSV', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{currentProperty.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-600 font-bold">Executive Intelligence</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-500 text-amber-600" />
              Smart IoT Grid
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Operational Analytics & Energy Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time floor energy profiling, peak tariff shaving, bed yield metrics, and financial audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-slate-200 w-fit shadow-2xs">
        <button
          onClick={() => setActiveTab('energy')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'energy'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Real-Time Energy & Floor Telemetry</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${activeTab === 'energy' ? 'bg-amber-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
            Live IoT
          </span>
        </button>

        <button
          onClick={() => setActiveTab('occupancy')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'occupancy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Occupancy & Revenue Yield</span>
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'energy' ? (
        <EnergyUsageVisualizer />
      ) : (
        <div className="space-y-6">
          {/* Analytics KPI Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bed Yield Rate</span>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">₹3,450</div>
              <span className="text-[11px] text-slate-500 mt-1">Average daily asset yield</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Tenancy</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">11.4 Mos</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1">Low tenant churn</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SLA Ticket Turnaround</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">4.2 Hrs</div>
              <span className="text-[11px] text-slate-500 mt-1">92% within 6-hour SLA</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collection Velocity</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">3.2 Days</div>
              <span className="text-[11px] text-slate-500 mt-1">Average settlement time</span>
            </div>
          </div>

          {/* Room Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Room Category Occupancy Breakdown</h4>
                <p className="text-xs text-slate-500 mt-0.5">Asset utilization across sharing formats</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Portfolio Health: 90.6%
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {/* Double Sharing */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Double Sharing (₹8,000/bed)</span>
                  <span className="text-slate-900 font-bold">116 / 120 Beds (96.6% Occupied)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '96.6%' }} />
                </div>
              </div>

              {/* Single Sharing */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Single AC Studio (₹14,000/bed)</span>
                  <span className="text-slate-900 font-bold">18 / 20 Beds (90.0% Occupied)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              {/* Triple Sharing */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Triple Sharing (₹6,500/bed)</span>
                  <span className="text-slate-900 font-bold">11 / 20 Beds (55.0% Occupied)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
