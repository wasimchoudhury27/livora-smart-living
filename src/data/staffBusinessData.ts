import { 
  Staff, 
  StaffAttendanceRecord, 
  StaffLeaveRequest, 
  PayrollRecord, 
  Complaint, 
  PropertyHealthScore,
  RecurringProblemCluster 
} from '../types';

export const ENRICHED_INITIAL_STAFF: Staff[] = [
  {
    id: 'stf-1',
    propertyId: 'prop-1',
    name: 'Imran Ansari',
    role: 'Electrician',
    phone: '+91 98701 23456',
    email: 'imran.tech@livora.io',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 3,
    completedTasksCount: 42,
    shiftTiming: '09:00 AM – 06:00 PM',
    shift: 'Morning Shift',
    assignedBlock: 'Wing A & B',
    joiningDate: '2024-03-15',
    salaryType: 'monthly',
    basicSalary: 22000,
    emergencyContact: '+91 98701 99999 (Brother: Farhan)',
    bankDetails: {
      accountNumber: '918237461928',
      ifsc: 'HDFC0001234',
      upiId: 'imran.ansari@okhdfcbank'
    }
  },
  {
    id: 'stf-2',
    propertyId: 'prop-1',
    name: 'Ramesh Kumar',
    role: 'Plumber',
    phone: '+91 98212 34567',
    email: 'ramesh.kumar@livora.io',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 2,
    completedTasksCount: 38,
    shiftTiming: '08:00 AM – 05:00 PM',
    shift: 'Morning Shift',
    assignedBlock: 'Wing A',
    joiningDate: '2024-06-01',
    salaryType: 'monthly',
    basicSalary: 20000,
    emergencyContact: '+91 98212 88888 (Wife: Sita)',
    bankDetails: {
      accountNumber: '102938475610',
      ifsc: 'SBIN0004321',
      upiId: 'rameshk@oksbi'
    }
  },
  {
    id: 'stf-3',
    propertyId: 'prop-1',
    name: 'Sunita Devi',
    role: 'Housekeeping',
    phone: '+91 99401 98765',
    email: 'sunita.devi@livora.io',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 4,
    completedTasksCount: 110,
    shiftTiming: '07:30 AM – 03:30 PM',
    shift: 'Early Shift',
    assignedBlock: 'All Floors',
    joiningDate: '2023-11-10',
    salaryType: 'monthly',
    basicSalary: 16000,
    emergencyContact: '+91 99401 11111 (Husband: Anil)',
    bankDetails: {
      accountNumber: '554433221100',
      ifsc: 'ICIC0000987',
      upiId: 'sunita@icici'
    }
  },
  {
    id: 'stf-4',
    propertyId: 'prop-1',
    name: 'Rajesh Sharma',
    role: 'Cook',
    phone: '+91 98199 12345',
    email: 'rajesh.chef@livora.io',
    avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 1,
    completedTasksCount: 65,
    shiftTiming: '06:00 AM – 09:00 PM (Mess Splits)',
    shift: 'Kitchen Split',
    assignedBlock: 'Dining Block',
    joiningDate: '2023-08-20',
    salaryType: 'monthly',
    basicSalary: 25000,
    emergencyContact: '+91 98199 77777 (Brother: Mohan)',
    bankDetails: {
      accountNumber: '887766554433',
      ifsc: 'PUNB0123456',
      upiId: 'rajeshcook@axl'
    }
  },
  {
    id: 'stf-5',
    propertyId: 'prop-1',
    name: 'Arvind Nair',
    role: 'Security',
    phone: '+91 98455 66778',
    email: 'arvind.security@livora.io',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 0,
    completedTasksCount: 19,
    shiftTiming: '08:00 PM – 08:00 AM (Night Guard)',
    shift: 'Night Guard',
    assignedBlock: 'Main Gate & Perimeter',
    joiningDate: '2024-01-10',
    salaryType: 'monthly',
    basicSalary: 18000,
    emergencyContact: '+91 98455 22222 (Son: Rahul)',
    bankDetails: {
      accountNumber: '334455667788',
      ifsc: 'BARB0KORAMA',
      upiId: 'arvind.guard@paytm'
    }
  },
  {
    id: 'stf-6',
    propertyId: 'prop-1',
    name: 'Suresh Yadav',
    role: 'Maintenance Worker',
    phone: '+91 99200 44556',
    email: 'suresh.maintenance@livora.io',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    assignedTasksCount: 2,
    completedTasksCount: 52,
    shiftTiming: '10:00 AM – 07:00 PM',
    shift: 'General Maintenance',
    assignedBlock: 'Campus Wide',
    joiningDate: '2024-04-18',
    salaryType: 'monthly',
    basicSalary: 19000,
    emergencyContact: '+91 99200 33333 (Cousin: Deepak)',
    bankDetails: {
      accountNumber: '998877665544',
      ifsc: 'KKBK0000456',
      upiId: 'sureshy@kotak'
    }
  }
];

// Today's date string helper
const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_STAFF_ATTENDANCE: StaffAttendanceRecord[] = [
  {
    id: 'att-1',
    staffId: 'stf-1',
    staffName: 'Imran Ansari',
    propertyId: 'prop-1',
    date: todayStr,
    status: 'Present',
    checkIn: '08:52 AM',
    checkOut: '06:10 PM',
    overtimeHours: 0.5,
    remarks: 'Resolved AC capacitor issue in Room 102'
  },
  {
    id: 'att-2',
    staffId: 'stf-2',
    staffName: 'Ramesh Kumar',
    propertyId: 'prop-1',
    date: todayStr,
    status: 'Present',
    checkIn: '08:05 AM',
    checkOut: '05:00 PM',
    overtimeHours: 0,
    remarks: 'Replaced washroom flush valve on Floor 2'
  },
  {
    id: 'att-3',
    staffId: 'stf-3',
    staffName: 'Sunita Devi',
    propertyId: 'prop-1',
    date: todayStr,
    status: 'Present',
    checkIn: '07:28 AM',
    checkOut: '03:30 PM',
    overtimeHours: 0,
    remarks: 'Daily mopping and sanitization completed'
  },
  {
    id: 'att-4',
    staffId: 'stf-4',
    staffName: 'Rajesh Sharma',
    propertyId: 'prop-1',
    date: todayStr,
    status: 'Present',
    checkIn: '05:50 AM',
    checkOut: '09:15 PM',
    overtimeHours: 1.0,
    remarks: 'Cooked special Wednesday dinner biryani'
  },
  {
    id: 'att-5',
    staffId: 'stf-5',
    staffName: 'Arvind Nair',
    propertyId: 'prop-1',
    date: todayStr,
    status: 'Present',
    checkIn: '07:55 PM',
    checkOut: 'Pending',
    overtimeHours: 0,
    remarks: 'Gate duty verified by biometric turnstile'
  },
  {
    id: 'att-6',
    staffId: 'stf-6',
    staffName: 'Suresh Yadav',
    propertyId: 'prop-1',
    date: todayStr,
    status: 'Approved Leave',
    checkIn: '—',
    checkOut: '—',
    overtimeHours: 0,
    remarks: 'Approved casual leave for personal work'
  }
];

export const INITIAL_STAFF_LEAVES: StaffLeaveRequest[] = [
  {
    id: 'lev-1',
    staffId: 'stf-6',
    staffName: 'Suresh Yadav',
    staffRole: 'Maintenance Worker',
    propertyId: 'prop-1',
    leaveType: 'Casual',
    startDate: todayStr,
    endDate: todayStr,
    daysCount: 1,
    reason: 'Family wedding event in hometown.',
    status: 'Approved',
    approvedBy: 'Karthik Raman (Owner)',
    responseNote: 'Approved. Imran will cover urgent electrical/civil tickets.',
    appliedAt: '2026-10-18T10:00:00Z'
  },
  {
    id: 'lev-2',
    staffId: 'stf-2',
    staffName: 'Ramesh Kumar',
    staffRole: 'Plumber',
    propertyId: 'prop-1',
    leaveType: 'Sick',
    startDate: '2026-10-26',
    endDate: '2026-10-27',
    daysCount: 2,
    reason: 'Routine dental surgery follow-up.',
    status: 'Pending',
    appliedAt: '2026-10-21T14:30:00Z'
  }
];

export const INITIAL_PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: 'pay-stf-1',
    staffId: 'stf-1',
    staffName: 'Imran Ansari',
    staffRole: 'Electrician',
    propertyId: 'prop-1',
    month: 'October 2026',
    basicPay: 22000,
    overtimePay: 1200,
    allowances: 1500, // Travel / Tool allowance
    deductions: 500,  // Uniform fund
    advanceRecovery: 2000,
    netPay: 22200, // 22000 + 1200 + 1500 - 500 - 2000
    status: 'Approved',
    paymentMethod: 'Bank Transfer',
    transactionReference: 'NEFT-AXIS-918237461',
    paymentDate: '2026-10-05',
    salarySlipGenerated: true,
    notes: 'Performance bonus for zero downtime during storm blackout.'
  },
  {
    id: 'pay-stf-2',
    staffId: 'stf-2',
    staffName: 'Ramesh Kumar',
    staffRole: 'Plumber',
    propertyId: 'prop-1',
    month: 'October 2026',
    basicPay: 20000,
    overtimePay: 600,
    allowances: 1000,
    deductions: 400,
    advanceRecovery: 0,
    netPay: 21200,
    status: 'Paid',
    paymentMethod: 'UPI',
    transactionReference: 'UPI-SBI-20261005-0912',
    paymentDate: '2026-10-04',
    salarySlipGenerated: true,
    notes: 'Punctual attendance throughout month.'
  },
  {
    id: 'pay-stf-3',
    staffId: 'stf-3',
    staffName: 'Sunita Devi',
    staffRole: 'Housekeeping',
    propertyId: 'prop-1',
    month: 'October 2026',
    basicPay: 16000,
    overtimePay: 0,
    allowances: 800,
    deductions: 0,
    advanceRecovery: 1000,
    netPay: 15800,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    transactionReference: 'IMPS-ICICI-44332211',
    paymentDate: '2026-10-04',
    salarySlipGenerated: true,
    notes: 'Cleanliness audit award recipient.'
  },
  {
    id: 'pay-stf-4',
    staffId: 'stf-4',
    staffName: 'Rajesh Sharma',
    staffRole: 'Cook',
    propertyId: 'prop-1',
    month: 'October 2026',
    basicPay: 25000,
    overtimePay: 2000,
    allowances: 2000, // Festival kitchen incentive
    deductions: 600,
    advanceRecovery: 0,
    netPay: 28400,
    status: 'Approved',
    paymentMethod: 'Bank Transfer',
    transactionReference: 'NEFT-PNB-88776655',
    paymentDate: '2026-10-05',
    salarySlipGenerated: true,
    notes: 'Excellent student mess ratings (4.6★).'
  },
  {
    id: 'pay-stf-5',
    staffId: 'stf-5',
    staffName: 'Arvind Nair',
    staffRole: 'Security',
    propertyId: 'prop-1',
    month: 'October 2026',
    basicPay: 18000,
    overtimePay: 800,
    allowances: 1000,
    deductions: 300,
    advanceRecovery: 0,
    netPay: 19500,
    status: 'Pending',
    notes: 'Awaiting monthly night-duty biometric confirmation.'
  },
  {
    id: 'pay-stf-6',
    staffId: 'stf-6',
    staffName: 'Suresh Yadav',
    staffRole: 'Maintenance Worker',
    propertyId: 'prop-1',
    month: 'October 2026',
    basicPay: 19000,
    overtimePay: 500,
    allowances: 900,
    deductions: 400,
    advanceRecovery: 1500,
    netPay: 18500,
    status: 'Pending',
    notes: 'Monthly cycle review.'
  }
];

export function calculateNetPay(
  basic: number,
  overtime: number,
  allowances: number,
  deductions: number,
  advanceRecovery: number
): number {
  return Math.max(0, basic + overtime + allowances - deductions - advanceRecovery);
}

// Recurring Problem Detector: Scans complaints for duplicate patterns in the same building/floor
export function detectRecurringProblems(complaints: Complaint[], propertyId: string): RecurringProblemCluster[] {
  const propComplaints = complaints.filter(c => c.propertyId === propertyId);
  const clusters: Record<string, {
    category: Complaint['category'];
    buildingName: string;
    affectedRooms: Set<string>;
    complaints: Complaint[];
  }> = {};

  propComplaints.forEach(c => {
    // Group key by Category + Building
    const key = `${c.category}_${c.buildingName || 'Building A'}`;
    if (!clusters[key]) {
      clusters[key] = {
        category: c.category,
        buildingName: c.buildingName || 'Building A',
        affectedRooms: new Set<string>(),
        complaints: []
      };
    }
    clusters[key].complaints.push(c);
    if (c.roomNumber) {
      clusters[key].affectedRooms.add(c.roomNumber);
    }
  });

  const result: RecurringProblemCluster[] = [];

  Object.entries(clusters).forEach(([key, group], idx) => {
    // If 2 or more complaints share the same category in the building, it is a recurring issue pattern
    if (group.complaints.length >= 2) {
      const dates = group.complaints.map(c => c.createdAt).sort();
      const allResolved = group.complaints.every(c => c.status === 'Completed' || c.status === 'Verified' || c.status === 'Closed');
      
      let probableRootCause = 'Isolated repeated wear and tear.';
      let recommendedAction = 'Standard staff inspection.';
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

      if (group.category === 'Water' || group.category === 'Plumbing') {
        probableRootCause = `Main riser pressure drop or inlet valve sedimentation in ${group.buildingName}.`;
        recommendedAction = 'Inspect overhead tank distribution valve and clean secondary filter mesh.';
        severity = group.affectedRooms.size >= 3 ? 'critical' : 'high';
      } else if (group.category === 'Wi-Fi') {
        probableRootCause = `Corridor wireless access point channel interference or switch port flap.`;
        recommendedAction = 'Reboot floor PoE switch and balance 5 GHz channel allocation.';
        severity = 'high';
      } else if (group.category === 'AC') {
        probableRootCause = `Refrigerant line leak or dust clogged evaporator coils on common compressor bank.`;
        recommendedAction = 'Service outdoor condenser units and check compressor amperage.';
        severity = 'medium';
      } else if (group.category === 'Electricity') {
        probableRootCause = `Floor phase imbalance tripping MCB breakers during peak evening loads.`;
        recommendedAction = 'Redistribute geyser/appliance loads across 3-phase distribution box.';
        severity = 'high';
      }

      result.push({
        id: `cluster-${idx + 1}`,
        category: group.category,
        buildingName: group.buildingName,
        affectedRooms: Array.from(group.affectedRooms),
        complaintCount: group.complaints.length,
        firstReportedAt: dates[0] || todayStr,
        latestReportedAt: dates[dates.length - 1] || todayStr,
        severity,
        probableRootCause,
        recommendedAction,
        isResolved: allResolved
      });
    }
  });

  return result;
}

// Property Health Score Calculation
export function calculatePropertyHealthScore(
  occupancyRate: number,
  openComplaints: number,
  averageFoodRating: number,
  feesCollected: number,
  feesPending: number,
  staffAttendanceRate: number = 92
): PropertyHealthScore {
  // 1. Occupancy score (0 - 100)
  const occupancyScore = Math.min(100, Math.round(occupancyRate));

  // 2. Maintenance score (lower open complaints -> higher score)
  const maintenanceScore = Math.max(40, Math.min(100, 100 - openComplaints * 8));

  // 3. Food score (1-5 scaled to 0-100)
  const foodScore = Math.min(100, Math.round((averageFoodRating / 5) * 100));

  // 4. Collection efficiency
  const totalBilled = feesCollected + feesPending;
  const collectionScore = totalBilled > 0 
    ? Math.min(100, Math.round((feesCollected / totalBilled) * 100))
    : 85;

  // 5. Staff Performance Score
  const staffPerformanceScore = Math.round(staffAttendanceRate);

  // Overall weighted score
  const overallScore = Math.round(
    occupancyScore * 0.25 +
    maintenanceScore * 0.25 +
    foodScore * 0.20 +
    collectionScore * 0.20 +
    staffPerformanceScore * 0.10
  );

  const insights: PropertyHealthScore['insights'] = [];

  if (collectionScore < 85) {
    insights.push({
      type: 'warning',
      metric: 'Fee Collection',
      message: `Pending dues represent ${(100 - collectionScore)}% of monthly revenue.`,
      recommendation: 'Trigger automated WhatsApp reminders to residents with overdue balances.'
    });
  } else {
    insights.push({
      type: 'positive',
      metric: 'Fee Collection',
      message: `High collection rate (${collectionScore}%). Excellent cash flow stability.`,
      recommendation: 'Maintain automatic 1st-of-month digital invoicing.'
    });
  }

  if (openComplaints > 3) {
    insights.push({
      type: 'alert',
      metric: 'Maintenance Queue',
      message: `${openComplaints} unresolved resident complaints in queue.`,
      recommendation: 'Review technician task allocations in staff duty roster.'
    });
  }

  if (averageFoodRating >= 4.5) {
    insights.push({
      type: 'positive',
      metric: 'Dining Quality',
      message: `Mess satisfaction is strong at ${averageFoodRating}★.`,
      recommendation: 'Highlight dining score on public discovery profile to drive admissions.'
    });
  }

  return {
    overallScore,
    occupancyScore,
    maintenanceScore,
    foodScore,
    collectionScore,
    staffPerformanceScore,
    insights
  };
}
