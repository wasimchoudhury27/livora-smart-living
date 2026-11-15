export interface HourlyEnergyPoint {
  time: string;
  hour: number;
  totalKW: number;
  floor1KW: number;
  floor2KW: number;
  floor3KW: number;
  floor4KW: number;
  commonKW: number;
  optimizedKW?: number;
  isPeakTariff?: boolean;
}

export interface DailyEnergyPoint {
  day: string;
  date: string;
  totalKWh: number;
  costINR: number;
  floor1: number;
  floor2: number;
  floor3: number;
  floor4: number;
  common: number;
  solarGeneratedKWh: number;
}

export interface FloorEfficiencyMetric {
  floor: string;
  name: string;
  totalKWhDay: number;
  bedsCount: number;
  kwhPerBed: number;
  costPerBed: number;
  anomalyDetected: boolean;
  anomalyReason?: string;
  primaryLoad: string;
}

export interface ApplianceBreakdown {
  category: string;
  percentage: number;
  kwhDay: number;
  monthlyCostINR: number;
  color: string;
}

export interface EnergyOpportunity {
  id: string;
  title: string;
  impactLevel: 'High' | 'Medium' | 'Quick Win';
  monthlySavingsINR: number;
  kwhSavedMonthly: number;
  description: string;
  actionLabel: string;
  status: 'recommended' | 'applied';
  affectedZones: string[];
}

// 24-Hour Real-Time Load Profile (kW)
export const HOURLY_ENERGY_DATA: HourlyEnergyPoint[] = [
  { time: '00:00', hour: 0, totalKW: 14.2, floor1KW: 2.1, floor2KW: 3.8, floor3KW: 4.1, floor4KW: 3.2, commonKW: 1.0, isPeakTariff: false, optimizedKW: 10.4 },
  { time: '02:00', hour: 2, totalKW: 12.8, floor1KW: 1.8, floor2KW: 3.5, floor3KW: 3.9, floor4KW: 2.8, commonKW: 0.8, isPeakTariff: false, optimizedKW: 9.1 },
  { time: '04:00', hour: 4, totalKW: 11.5, floor1KW: 1.6, floor2KW: 3.2, floor3KW: 3.5, floor4KW: 2.5, commonKW: 0.7, isPeakTariff: false, optimizedKW: 8.5 },
  { time: '06:00', hour: 6, totalKW: 28.4, floor1KW: 5.8, floor2KW: 7.2, floor3KW: 8.4, floor4KW: 5.6, commonKW: 1.4, isPeakTariff: false, optimizedKW: 22.0 },
  { time: '07:30', hour: 7.5, totalKW: 42.6, floor1KW: 11.2, floor2KW: 9.8, floor3KW: 11.6, floor4KW: 8.2, commonKW: 1.8, isPeakTariff: false, optimizedKW: 31.5 },
  { time: '09:00', hour: 9, totalKW: 34.2, floor1KW: 8.4, floor2KW: 8.2, floor3KW: 9.6, floor4KW: 6.5, commonKW: 1.5, isPeakTariff: false, optimizedKW: 26.0 },
  { time: '11:00', hour: 11, totalKW: 18.5, floor1KW: 4.2, floor2KW: 4.1, floor3KW: 5.2, floor4KW: 3.8, commonKW: 1.2, isPeakTariff: false, optimizedKW: 14.8 },
  { time: '13:00', hour: 13, totalKW: 24.8, floor1KW: 7.8, floor2KW: 5.2, floor3KW: 6.1, floor4KW: 4.3, commonKW: 1.4, isPeakTariff: false, optimizedKW: 19.5 },
  { time: '15:00', hour: 15, totalKW: 17.2, floor1KW: 3.8, floor2KW: 4.2, floor3KW: 4.8, floor4KW: 3.2, commonKW: 1.2, isPeakTariff: false, optimizedKW: 13.5 },
  { time: '17:00', hour: 17, totalKW: 22.4, floor1KW: 4.9, floor2KW: 5.5, floor3KW: 6.2, floor4KW: 4.4, commonKW: 1.4, isPeakTariff: false, optimizedKW: 18.0 },
  { time: '18:30', hour: 18.5, totalKW: 46.8, floor1KW: 10.8, floor2KW: 11.4, floor3KW: 13.8, floor4KW: 8.8, commonKW: 2.0, isPeakTariff: true, optimizedKW: 32.4 },
  { time: '20:00', hour: 20, totalKW: 54.2, floor1KW: 12.4, floor2KW: 13.6, floor3KW: 16.2, floor4KW: 9.8, commonKW: 2.2, isPeakTariff: true, optimizedKW: 36.8 },
  { time: '21:30', hour: 21.5, totalKW: 48.6, floor1KW: 9.2, floor2KW: 12.8, floor3KW: 15.1, floor4KW: 9.4, commonKW: 2.1, isPeakTariff: true, optimizedKW: 34.0 },
  { time: '23:00', hour: 23, totalKW: 26.5, floor1KW: 3.4, floor2KW: 7.8, floor3KW: 8.6, floor4KW: 5.2, commonKW: 1.5, isPeakTariff: false, optimizedKW: 19.2 }
];

// 7-Day Daily Consumption & Solar Generation (kWh)
export const WEEKLY_ENERGY_DATA: DailyEnergyPoint[] = [
  { day: 'Mon', date: 'Oct 16', totalKWh: 482, costINR: 3615, floor1: 115, floor2: 128, floor3: 142, floor4: 72, common: 25, solarGeneratedKWh: 88 },
  { day: 'Tue', date: 'Oct 17', totalKWh: 495, costINR: 3712, floor1: 118, floor2: 132, floor3: 146, floor4: 74, common: 25, solarGeneratedKWh: 92 },
  { day: 'Wed', date: 'Oct 18', totalKWh: 512, costINR: 3840, floor1: 122, floor2: 138, floor3: 152, floor4: 75, common: 25, solarGeneratedKWh: 95 },
  { day: 'Thu', date: 'Oct 19', totalKWh: 508, costINR: 3810, floor1: 120, floor2: 135, floor3: 150, floor4: 77, common: 26, solarGeneratedKWh: 84 },
  { day: 'Fri', date: 'Oct 20', totalKWh: 535, costINR: 4012, floor1: 126, floor2: 144, floor3: 158, floor4: 80, common: 27, solarGeneratedKWh: 79 },
  { day: 'Sat', date: 'Oct 21', totalKWh: 588, costINR: 4410, floor1: 142, floor2: 156, floor3: 172, floor4: 88, common: 30, solarGeneratedKWh: 98 },
  { day: 'Sun', date: 'Oct 22', totalKWh: 615, costINR: 4612, floor1: 148, floor2: 165, floor3: 182, floor4: 89, common: 31, solarGeneratedKWh: 104 }
];

// Floor-by-Floor Efficiency Index (per-bed benchmarking)
export const FLOOR_EFFICIENCY_METRICS: FloorEfficiencyMetric[] = [
  {
    floor: 'Floor 1',
    name: 'Ground & Commercial Kitchen / Dining',
    totalKWhDay: 132,
    bedsCount: 20,
    kwhPerBed: 6.6,
    costPerBed: 49.5,
    anomalyDetected: false,
    primaryLoad: 'Commercial Dishwasher & Induction Cookers'
  },
  {
    floor: 'Floor 2',
    name: 'Residential Wing B (Rooms 201–208)',
    totalKWhDay: 142,
    bedsCount: 36,
    kwhPerBed: 3.94,
    costPerBed: 29.5,
    anomalyDetected: false,
    primaryLoad: 'Room AC Units (Inverter)'
  },
  {
    floor: 'Floor 3',
    name: 'Residential Wing A (Rooms 301–308)',
    totalKWhDay: 168,
    bedsCount: 32,
    kwhPerBed: 5.25,
    costPerBed: 39.3,
    anomalyDetected: true,
    anomalyReason: 'Geysers running continuously without thermostat cutoff in Rooms 303 & 305',
    primaryLoad: '3kW Instant Geysers (Unregulated)'
  },
  {
    floor: 'Floor 4',
    name: 'Penthouse & Deluxe Wing (Rooms 401–406)',
    totalKWhDay: 84,
    bedsCount: 24,
    kwhPerBed: 3.5,
    costPerBed: 26.2,
    anomalyDetected: false,
    primaryLoad: 'Lighting, Workstations & AC'
  },
  {
    floor: 'Common',
    name: 'Rooftop Lounge, Gym, Corridor Lighting',
    totalKWhDay: 28,
    bedsCount: 112,
    kwhPerBed: 0.25,
    costPerBed: 1.8,
    anomalyDetected: false,
    primaryLoad: 'Motion Sensor LED Arrays'
  }
];

// Appliance & Load Distribution
export const APPLIANCE_DISTRIBUTION: ApplianceBreakdown[] = [
  { category: 'HVAC & Room Air Conditioning', percentage: 42, kwhDay: 232, monthlyCostINR: 52200, color: '#6366f1' },
  { category: 'Water Heaters & Geysers', percentage: 28, kwhDay: 155, monthlyCostINR: 34800, color: '#f59e0b' },
  { category: 'Mess Cooking & Cold Storage', percentage: 16, kwhDay: 88, monthlyCostINR: 19800, color: '#10b981' },
  { category: 'Lighting, Laptops & Sockets', percentage: 14, kwhDay: 77, monthlyCostINR: 17400, color: '#06b6d4' }
];

// Concrete Efficiency Opportunities with Financial ROI
export const ENERGY_OPPORTUNITIES: EnergyOpportunity[] = [
  {
    id: 'opp-1',
    title: 'Peak Load Shaving: Shift Geyser Window to Off-Peak',
    impactLevel: 'High',
    monthlySavingsINR: 14200,
    kwhSavedMonthly: 1450,
    description: 'Rooms on Floor 3 currently turn on 3kW geysers between 6:30 PM and 8:30 PM (Peak Tariff: ₹9.8/unit). Installing smart timer relays to preheat water during off-peak morning hours (₹5.2/unit) yields immediate savings.',
    actionLabel: 'Deploy Auto-Schedule to Floor 3 & 4',
    status: 'recommended',
    affectedZones: ['Floor 3', 'Floor 4']
  },
  {
    id: 'opp-2',
    title: 'Vampire Load & Nighttime AC Auto-Setpoint (24°C)',
    impactLevel: 'High',
    monthlySavingsINR: 18500,
    kwhSavedMonthly: 1980,
    description: 'Smart meter sensors detected AC compressors running continuously at 18°C between 2:00 AM and 6:00 AM in unoccupied or overcooled rooms. Raising minimum setpoint to 24°C reduces compressor duty cycles by 28%.',
    actionLabel: 'Enforce Eco-Temperature Profile',
    status: 'recommended',
    affectedZones: ['Floor 2', 'Floor 3', 'Floor 4']
  },
  {
    id: 'opp-3',
    title: 'Corridor & Stairwell Motion-Sensor Dimming',
    impactLevel: 'Quick Win',
    monthlySavingsINR: 4200,
    kwhSavedMonthly: 520,
    description: 'Corridor lighting remains at 100% brightness from midnight to 5:00 AM despite zero resident footfall. Dimming to 20% ambient level with 2-second motion ramp cuts corridor consumption by 65%.',
    actionLabel: 'Enable Sensor Auto-Dim',
    status: 'recommended',
    affectedZones: ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4']
  },
  {
    id: 'opp-4',
    title: 'Rooftop Solar Daytime Self-Consumption Sync',
    impactLevel: 'Medium',
    monthlySavingsINR: 12400,
    kwhSavedMonthly: 1320,
    description: 'Schedule mess laundry washing machines and kitchen deep freezers to run between 11:30 AM and 2:30 PM when rooftop solar generation peaks at 14.8 kW.',
    actionLabel: 'Sync Laundry Cycle to Solar Peak',
    status: 'recommended',
    affectedZones: ['Floor 1 (Mess)', 'Rooftop']
  }
];
