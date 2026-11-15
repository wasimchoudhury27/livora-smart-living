import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  GraduationCap, 
  Wrench, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Zap,
  Check,
  RefreshCw,
  CreditCard,
  UtensilsCrossed,
  Play,
  Pause,
  AlertTriangle
} from 'lucide-react';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onOpenRoomDetailByNumber: (roomNumber: string) => void;
  onOpenCreateComplaint: () => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenRoomDetailByNumber,
  onOpenCreateComplaint,
}) => {
  const { 
    setCurrentUserRole, 
    setPlatformMode,
    complaints, 
    createComplaint, 
    assignStaffToComplaint, 
    updateComplaintStatus,
    recordPayment,
    staff,
    currentStudent,
    currentProperty,
    showToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const steps = [
    {
      id: 1,
      role: 'public',
      title: '1. Public Discovery Platform & Bangalore Regional Map',
      badge: 'Public Discovery',
      description: 'Explore verified student hostels and PGs across Bangalore (Koramangala, HSR Layout, Whitefield, Indiranagar). Filter by budget, accommodation type, gender eligibility, and interactive regional map.',
      actionLabel: 'Launch Public Discovery Platform',
      execute: () => {
        setPlatformMode('discovery');
        showToast('Step 1 Active', 'Switched to LIVORA Public Discovery Platform with live Bangalore hostels', 'info');
      },
    },
    {
      id: 2,
      role: 'public',
      title: '2. Transparent 4-Pillar Ranking Algorithm & Fair Competition',
      badge: 'Zero-Ad Leaderboard',
      description: 'Zero sponsored placements or paid boosts. Rankings are determined by: Verified Reviews (35%), Maintenance TAT (25%), Dining Rating (20%), and Safety/Hygiene Audits (20%). New properties start with "Audit Pending".',
      actionLabel: 'Inspect Algorithm Leaderboard',
      execute: () => {
        setPlatformMode('discovery');
        showToast('Step 2 Active', 'Displaying transparent 4-pillar ranking methodology', 'info');
      },
    },
    {
      id: 3,
      role: 'public',
      title: '3. Side-by-Side Property Comparison',
      badge: 'Decision Tool',
      description: 'Compare 2 to 4 properties simultaneously. Inspect monthly rent, verified deposits, food menu variety, gate curfews, Wi-Fi speed, and real resident satisfaction.',
      actionLabel: 'Explore Property Comparison',
      execute: () => {
        setPlatformMode('discovery');
        showToast('Step 3 Active', 'Compare top rated Bangalore accommodations side-by-side', 'info');
      },
    },
    {
      id: 4,
      role: 'public',
      title: '4. Public Lead Generation: Free Campus Visit & Bed Reservation',
      badge: 'Admission Funnel',
      description: 'Prospective students and parents can schedule a campus visit or place a bed enquiry. The enquiry immediately flows into the private hostel management CRM.',
      actionLabel: 'View Inbound Admissions Pipeline',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('owner');
        onNavigate('bookings');
        showToast('Step 4 Active', 'Inbound discovery enquiries routed to Owner / Manager CRM', 'success');
      },
    },
    {
      id: 5,
      role: 'owner',
      title: '5. Owner Command Center & Property Health Score (91/100)',
      badge: 'Owner Persona',
      description: 'Switch to private management. The Command Center displays live occupancy (90.6%), cash collection, and the 5-Pillar Health Score (Occupancy, Maintenance, Food, Fee Efficiency, Staff).',
      actionLabel: 'Open Owner Command Center',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('owner');
        onNavigate('dashboard');
        showToast('Step 5 Active', 'Owner Command Center & 5-Pillar Health Score active', 'info');
      },
    },
    {
      id: 6,
      role: 'owner',
      title: '6. Space Architecture & Bed Allocation (Room 401 Drilldown)',
      badge: 'Spatial Hierarchy',
      description: 'Strict entity integrity: Property → Building → Floor → Room → Bed → Student. Inspect Room 401 with Bed A (Rahul Sharma) and Bed B (Aman Khan) generating ₹16,000 monthly revenue.',
      actionLabel: 'Open Room 401 Spatial Drawer',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('owner');
        onNavigate('rooms');
        onOpenRoomDetailByNumber('401');
        showToast('Step 6 Active', 'Opened Room 401: Rahul Sharma (Bed A) & Aman Khan (Bed B)', 'info');
      },
    },
    {
      id: 7,
      role: 'student',
      title: '7. Resident Service Desk & Verified Resolution Lifecycle',
      badge: 'Student Persona',
      description: 'Log in as resident Rahul Sharma. When a technician finishes a repair, Rahul has full authority to "Confirm Fix & Rate (1-5★)" to close the ticket, or click "Problem Still Persists" to reopen it.',
      actionLabel: 'Enter Resident "My Stay" Desk',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('student');
        onNavigate('complaints');
        showToast('Step 7 Active', 'Resident verification and ticket reopening lifecycle active', 'info');
      },
    },
    {
      id: 8,
      role: 'owner',
      title: '8. Recurring Problem Cluster Diagnostics',
      badge: 'Innovation Spotlight',
      description: 'AI cluster engine automatically groups 2+ complaints sharing the same category and wing. Pinpoints root cause (e.g. "Main riser inlet sedimentation") and recommends preventive repairs.',
      actionLabel: 'Inspect Recurring Problem Clusters',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('owner');
        onNavigate('complaints');
        showToast('Step 8 Active', 'Recurring issue clusters identified across property wings', 'warning');
      },
    },
    {
      id: 9,
      role: 'owner',
      title: '9. Daily Workforce Biometrics & Duty Register',
      badge: 'Staff Management',
      description: 'Manage caretakers, electricians, plumbers, cooks, and guards. Mark daily biometric attendance (Present, Half-day, Absent, Leave), track check-in/out times, and log overtime hours.',
      actionLabel: 'Open Staff Duty Register',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('owner');
        onNavigate('staff');
        showToast('Step 9 Active', 'Daily attendance register & biometric duty roster active', 'info');
      },
    },
    {
      id: 10,
      role: 'owner',
      title: '10. Formula-Based Payroll & Official Salary Slip Voucher',
      badge: 'Payroll Engine',
      description: 'Net Pay = Basic Pay + Overtime + Allowances − Deductions − Advance Recovery. Process monthly payout via UPI/NEFT and generate printable LIVORA Salary Slips.',
      actionLabel: 'Inspect Monthly Payroll & Payslips',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('owner');
        onNavigate('staff');
        showToast('Step 10 Active', 'Monthly payroll runs and official voucher generation ready', 'success');
      },
    },
    {
      id: 11,
      role: 'owner',
      title: '11. Operating Surplus Calculation & Expense Control',
      badge: 'Financial Integrity',
      description: 'Surplus = Gross Rent Collected (₹6.4L) − [Direct Outflow (Groceries, Utilities, Repairs) + Staff Payroll (₹1.24L)]. Fully transparent cash flow balance.',
      actionLabel: 'View Operating Surplus Breakdown',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('owner');
        onNavigate('expenses');
        showToast('Step 11 Active', 'Operating Surplus and connected payroll expenses displayed', 'info');
      },
    },
    {
      id: 12,
      role: 'owner',
      title: '12. Enterprise Multi-Role Separation & Single-Click Switcher',
      badge: 'Role Separation',
      description: 'Seamless demonstration of 5 distinct user roles: Owner, Manager, Student Resident, Technician Staff, and Accountant with strict permission isolation.',
      actionLabel: 'Return to Executive Command Center',
      execute: () => {
        setPlatformMode('management');
        setCurrentUserRole('owner');
        onNavigate('dashboard');
        showToast('Step 12 Active', 'Full LIVORA ecosystem demonstration complete!', 'success');
      },
    },
  ];

  const current = steps[currentStep];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isAutoPlaying && isOpen) {
      timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          const nextIdx = currentStep + 1;
          setCurrentStep(nextIdx);
          steps[nextIdx].execute();
        } else {
          setIsAutoPlaying(false);
          showToast('Demo Complete 🎉', 'The full 10-step connected cycle has been demonstrated!', 'success');
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      steps[nextIdx].execute();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      steps[prevIdx].execute();
    }
  };

  const handleStepJump = (idx: number) => {
    setCurrentStep(idx);
    steps[idx].execute();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsAutoPlaying(false);
        onClose();
      }}
      title="Hackathon 2-Minute Connected Live Demo"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Header Hero Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white border border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Full-Stack Connected Workflow Demonstration</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Watch Owner → Student → Staff → AI in Live Action
            </h3>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Demonstrates 100% interconnected live data across all roles without mock page jumps.
            </p>
          </div>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start sm:self-auto ${
              isAutoPlaying
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-900'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Play (5s / step)</span>
              </>
            )}
          </button>
        </div>

        {/* Step Progression Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Workflow Step {currentStep + 1} of {steps.length}</span>
            <span className="text-indigo-600">{current.badge}</span>
          </div>

          <div className="grid grid-cols-10 gap-1.5">
            {steps.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => handleStepJump(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-indigo-600 ring-2 ring-indigo-400 ring-offset-1'
                    : idx < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Step ${st.id}: ${st.title}`}
              />
            ))}
          </div>
        </div>

        {/* Active Step Content Spotlight Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Current Demonstration Stage
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {current.title}
              </h4>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
              {current.badge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {current.description}
          </p>

          <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              onClick={current.execute}
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 10-Step Jump Navigation Matrix */}
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Jump to Any Demonstration Milestone:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => handleStepJump(idx)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  idx === currentStep
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Step {st.id}</span>
                  {idx < currentStep && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </div>
                <div className="truncate font-semibold">{st.title.split('. ')[1] || st.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
