import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine, 
  ReferenceArea,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Zap, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Building2, 
  Sun, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Sliders,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { 
  HOURLY_ENERGY_DATA, 
  WEEKLY_ENERGY_DATA, 
  FLOOR_EFFICIENCY_METRICS, 
  APPLIANCE_DISTRIBUTION, 
  ENERGY_OPPORTUNITIES,
  EnergyOpportunity,
  HourlyEnergyPoint
} from '../../data/energyData';
import { useApp } from '../../context/AppContext';

type TimeRange = '24h' | '7d';
type ViewMode = 'all_floors' | 'stacked_floors' | 'efficiency_index';

export const EnergyUsageVisualizer: React.FC = () => {
  const { currentProperty, properties, setCurrentPropertyId, showToast } = useApp();

  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [viewMode, setViewMode] = useState<ViewMode>('all_floors');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(true);
  const [liveKWOffset, setLiveKWOffset] = useState<number>(0);
  const [appliedOpportunities, setAppliedOpportunities] = useState<string[]>([]);
  const [showOptimizedCurve, setShowOptimizedCurve] = useState<boolean>(false);

  // Live telemetry pulse simulation
  useEffect(() => {
    if (!isSimulatingLive) return;
    const interval = setInterval(() => {
      // Small jitter between -1.2 kW and +1.5 kW
      const jitter = (Math.random() * 2.7) - 1.2;
      setLiveKWOffset(Number(jitter.toFixed(1)));
    }, 3000);
    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  // Current real-time metrics
  const currentKW = useMemo(() => {
    const base = 34.2;
    const offset = showOptimizedCurve ? -8.2 : 0;
    return Math.max(12, Number((base + liveKWOffset + offset).toFixed(1)));
  }, [liveKWOffset, showOptimizedCurve]);

  // Dynamic hourly data with optimization applied
  const dynamicHourlyData = useMemo(() => {
    return HOURLY_ENERGY_DATA.map(pt => {
      if (selectedFloor === 'Floor 1') {
        return { ...pt, totalKW: pt.floor1KW, optimizedKW: Number((pt.floor1KW * 0.8).toFixed(1)) };
      }
      if (selectedFloor === 'Floor 2') {
        return { ...pt, totalKW: pt.floor2KW, optimizedKW: Number((pt.floor2KW * 0.75).toFixed(1)) };
      }
      if (selectedFloor === 'Floor 3') {
        return { ...pt, totalKW: pt.floor3KW, optimizedKW: Number((pt.floor3KW * 0.7).toFixed(1)) };
      }
      if (selectedFloor === 'Floor 4') {
        return { ...pt, totalKW: pt.floor4KW, optimizedKW: Number((pt.floor4KW * 0.82).toFixed(1)) };
      }
      return pt;
    });
  }, [selectedFloor]);

  // Opportunities calculation
  const totalPotentialSavings = useMemo(() => {
    return ENERGY_OPPORTUNITIES.reduce((sum, opp) => sum + opp.monthlySavingsINR, 0);
  }, []);

  const totalRealizedSavings = useMemo(() => {
    return ENERGY_OPPORTUNITIES
      .filter(opp => appliedOpportunities.includes(opp.id))
      .reduce((sum, opp) => sum + opp.monthlySavingsINR, 0);
  }, [appliedOpportunities]);

  const toggleOpportunity = (id: string, title: string) => {
    if (appliedOpportunities.includes(id)) {
      setAppliedOpportunities(prev => prev.filter(item => item !== id));
      showToast('Optimization Disabled', `${title} reverted to standard grid profile.`, 'info');
    } else {
      setAppliedOpportunities(prev => [...prev, id]);
      setShowOptimizedCurve(true);
      showToast('Optimization Active 🎉', `${title} applied! Peak load reduced.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Visualizer Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              LIVORA Smart Grid & Energy Intelligence
            </span>
            <span aria-hidden="true">·</span>
            <span>Sub-Meter Telemetry</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 font-medium">Bespoke IoT Sensors</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Real-Time Energy Usage & Efficiency Telemetry
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Monitor floor-level kilowatt draw, isolate phantom night loads, and enforce peak-tariff shaving schedules.
          </p>
        </div>

        {/* Live Pulse Badge & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className={`w-2.5 h-2.5 rounded-full ${isSimulatingLive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Live Grid Draw</div>
              <div className="text-base font-black text-slate-900 font-mono leading-none mt-0.5">
                {currentKW} <span className="text-xs font-semibold text-slate-500">kW</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSimulatingLive(!isSimulatingLive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              isSimulatingLive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isSimulatingLive ? 'Live Stream Active' : 'Feed Paused'}
          </button>
        </div>
      </div>

      {/* Grid of Key Telemetry Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Consumption</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            524 <span className="text-sm font-semibold text-slate-500">kWh</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-8.4% vs 7-day average</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly Bill</span>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            ₹{showOptimizedCurve ? '51,500' : '84,200'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Commercial Tier (BESCOM ₹7.8/unit)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solar Rooftop Offset</span>
          <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
            92 <span className="text-sm font-semibold text-slate-500">kWh</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-1">
            <Sun className="w-3.5 h-3.5" />
            <span>18.4% daytime load offset</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 border border-indigo-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Unrealized Opportunity</span>
          <div className="text-2xl font-black text-indigo-900 mt-1 font-mono">
            ₹{(totalPotentialSavings - totalRealizedSavings).toLocaleString('en-IN')}
            <span className="text-xs font-semibold text-indigo-700">/mo</span>
          </div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1">
            {appliedOpportunities.length} of {ENERGY_OPPORTUNITIES.length} optimizations active
          </div>
        </div>
      </div>

      {/* Main Energy Chart Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
        {/* Chart Header & Interactive Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">
                {timeRange === '24h' ? '24-Hour Real-Time Demand Curve (kW)' : '7-Day Energy Consumption & Cost (kWh)'}
              </h4>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                IoT Sub-meters
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlighting evening peak tariff window (6:00 PM – 10:00 PM) where electricity costs +45%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setTimeRange('24h')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeRange === '24h'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                24 Hours (Real-Time)
              </button>
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeRange === '7d'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7-Day Profile
              </button>
            </div>

            {/* Floor Filter */}
            <select
              value={selectedFloor}
              onChange={e => setSelectedFloor(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="all">All Floors Combined</option>
              <option value="Floor 1">Floor 1 (Commercial Mess)</option>
              <option value="Floor 2">Floor 2 (Rooms 201–208)</option>
              <option value="Floor 3">Floor 3 (Rooms 301–308)</option>
              <option value="Floor 4">Floor 4 (Deluxe Rooms)</option>
            </select>

            {/* Toggle Eco-Optimization Overlay */}
            <button
              onClick={() => setShowOptimizedCurve(!showOptimizedCurve)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                showOptimizedCurve 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showOptimizedCurve ? 'Hide Shaved Profile' : 'Overlay Shaved Curve'}</span>
            </button>
          </div>
        </div>

        {/* Recharts Render Area */}
        <div className="h-80 w-full pt-2">
          {timeRange === '24h' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicHourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalKWGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  unit=" kW" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 65]}
                />
                
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as HourlyEnergyPoint;
                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-2 border border-slate-800">
                          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5 font-bold">
                            <span>Time: {label}</span>
                            {data.isPeakTariff && (
                              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded">
                                Peak Tariff (₹9.8/unit)
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-400">Current Grid Load:</span>
                              <span className="font-mono font-bold text-amber-400">{data.totalKW} kW</span>
                            </div>
                            {showOptimizedCurve && (
                              <div className="flex justify-between gap-4">
                                <span className="text-emerald-400">Optimized Shaved Load:</span>
                                <span className="font-mono font-bold text-emerald-400">{data.optimizedKW} kW</span>
                              </div>
                            )}
                            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                              <span>Flr 1: {data.floor1KW}kW · Flr 2: {data.floor2KW}kW · Flr 3: {data.floor3KW}kW · Flr 4: {data.floor4KW}kW</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Highlight Peak Tariff Window: 18:30 to 22:00 */}
                <ReferenceArea 
                  x1="18:30" 
                  x2="21:30" 
                  fill="#ef4444" 
                  fillOpacity={0.07} 
                  label={{ 
                    value: 'Peak Tariff Window (6:30 PM – 10:00 PM)', 
                    position: 'insideTopRight', 
                    fill: '#b91c1c', 
                    fontSize: 10,
                    fontWeight: 700
                  }}
                />

                <ReferenceLine y={45} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Contracted Max Demand (45 kW)', fill: '#dc2626', fontSize: 10, position: 'insideTopLeft' }} />

                {/* Main Actual Curve */}
                <Area 
                  type="monotone" 
                  dataKey="totalKW" 
                  name="Actual Load (kW)" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#totalKWGradient)" 
                />

                {/* Simulated Shaved Curve */}
                {showOptimizedCurve && (
                  <Area 
                    type="monotone" 
                    dataKey="optimizedKW" 
                    name="Optimized Load (kW)" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#optimizedGradient)" 
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_ENERGY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                <YAxis unit=" kWh" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-1.5">
                          <div className="font-bold border-b border-slate-800 pb-1">{data.day} ({data.date})</div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Total Consumption:</span>
                            <span className="font-mono font-bold text-amber-400">{data.totalKWh} kWh</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Electricity Cost:</span>
                            <span className="font-mono font-bold text-white">₹{data.costINR.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-emerald-400">
                            <span>Solar Generation Offset:</span>
                            <span className="font-mono font-bold">{data.solarGeneratedKWh} kWh</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="floor1" name="Floor 1 (Mess)" fill="#6366f1" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="floor2" name="Floor 2 (Rooms)" fill="#818cf8" stackId="a" />
                <Bar dataKey="floor3" name="Floor 3 (High Load)" fill="#f59e0b" stackId="a" />
                <Bar dataKey="floor4" name="Floor 4 (Deluxe)" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Two Column Section: Floor Benchmarking & Load Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Floor-by-Floor Efficiency Index */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Floor Energy Intensity Benchmark (kWh / Bed)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Normalizes energy against room occupancy to detect abnormal appliance waste.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              Target: &le; 4.0 kWh/bed
            </span>
          </div>

          <div className="space-y-3.5">
            {FLOOR_EFFICIENCY_METRICS.map(item => (
              <div 
                key={item.floor}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.anomalyDetected 
                    ? 'bg-rose-50/70 border-rose-200' 
                    : 'bg-slate-50/70 border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.floor}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-500">{item.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Primary Consumer: <strong className="text-slate-800">{item.primaryLoad}</strong>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black font-mono text-slate-900">
                      {item.kwhPerBed} <span className="text-[10px] font-normal text-slate-500">kWh/bed</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ₹{item.costPerBed}/bed daily
                    </div>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="mt-2.5 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      item.anomalyDetected 
                        ? 'bg-rose-600' 
                        : item.kwhPerBed > 4.0 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${Math.min(100, (item.kwhPerBed / 7) * 100)}%` }} 
                  />
                </div>

                {item.anomalyDetected && item.anomalyReason && (
                  <div className="mt-2 text-[11px] font-semibold text-rose-700 flex items-center gap-1.5 pt-1 border-t border-rose-200/60">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Waste Alert: {item.anomalyReason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Load Category Distribution Donut & Cost Impact */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Sub-System Energy Split
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Breakdown by end-use load category
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600">
                100% Sub-Metered
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              {/* Donut Chart */}
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={APPLIANCE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="percentage"
                    >
                      {APPLIANCE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any, name: any, item: any) => [
                        `${val}% (${item.payload.kwhDay} kWh/day • ₹${item.payload.monthlyCostINR.toLocaleString('en-IN')}/mo)`,
                        item.payload.category
                      ]} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with Cost figures */}
              <div className="space-y-2.5 text-xs">
                {APPLIANCE_DISTRIBUTION.map(cat => (
                  <div key={cat.category} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-semibold text-slate-800">{cat.category}</span>
                      </div>
                      <span className="font-bold text-slate-900 font-mono">{cat.percentage}%</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 pl-4 font-mono">
                      <span>{cat.kwhDay} kWh/day</span>
                      <span>₹{cat.monthlyCostINR.toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Tariff Insight */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Time-of-Day (ToD) Tariff Rule Applied</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Standard commercial rate is ₹5.80/unit (06:00 to 18:00). Peak surcharge rate is ₹9.80/unit (18:00 to 22:00). Night off-peak concession is ₹5.20/unit (22:00 to 06:00).
            </p>
          </div>
        </div>
      </div>

      {/* Actionable Efficiency Opportunities & Autonomous Recommendations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="text-base font-bold text-slate-900">
                Actionable Energy Efficiency Opportunities
              </h4>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Potential Savings: ₹{totalPotentialSavings.toLocaleString('en-IN')}/month
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted IoT interventions based on actual load profile patterns in {currentProperty.name}.
            </p>
          </div>

          {appliedOpportunities.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>₹{totalRealizedSavings.toLocaleString('en-IN')}/mo in Active Shaving</span>
            </div>
          )}
        </div>

        {/* Opportunity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ENERGY_OPPORTUNITIES.map(opp => {
            const isApplied = appliedOpportunities.includes(opp.id);

            return (
              <div
                key={opp.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isApplied
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        opp.impactLevel === 'High' 
                          ? 'bg-rose-100 text-rose-800' 
                          : opp.impactLevel === 'Quick Win' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {opp.impactLevel} Impact
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 mt-1">
                        {opp.title}
                      </h5>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-emerald-700 font-mono">
                        +₹{opp.monthlySavingsINR.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {opp.kwhSavedMonthly} kWh saved/mo
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700">Affected Zones:</span>
                    <span>{opp.affectedZones.join(', ')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Status: <strong className={isApplied ? 'text-emerald-700' : 'text-slate-700'}>{isApplied ? '✓ Enforced' : 'Awaiting Deployment'}</strong>
                  </span>

                  <button
                    onClick={() => toggleOpportunity(opp.id, opp.title)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isApplied
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enforced (Click to Revert)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>{opp.actionLabel}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
