export type UserRole = 
  | 'owner' 
  | 'manager' 
  | 'staff'
  | 'accountant' 
  | 'maintenance' 
  | 'cleaner' 
  | 'cook' 
  | 'student'
  | 'Owner'
  | 'Manager'
  | 'Staff'
  | 'Accountant'
  | 'Maintenance'
  | 'Cleaner'
  | 'Cook'
  | 'Student';

export type PaymentMethod = 'UPI' | 'Bank Transfer' | 'Cash' | 'Card' | 'Debit Card' | 'Cheque' | 'Online Gateway';

export type ExpenseCategory = 
  | 'Electricity' 
  | 'Water' 
  | 'Food' 
  | 'Groceries'
  | 'Staff'
  | 'Staff Payroll'
  | 'Staff Salaries' 
  | 'Salaries'
  | 'Maintenance' 
  | 'Cleaning' 
  | 'Repairs' 
  | 'Internet' 
  | 'Other';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface FoodMenuItem {
  name: string;
  type: 'veg' | 'non-veg';
}

export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance' | 'blocked';

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';

export type ComplaintCategory = 
  | 'Fan' 
  | 'Light' 
  | 'Electricity' 
  | 'AC' 
  | 'Water' 
  | 'Bed' 
  | 'Mattress' 
  | 'Table' 
  | 'Chair' 
  | 'Door' 
  | 'Window' 
  | 'Bathroom' 
  | 'Wi-Fi' 
  | 'Cleaning' 
  | 'Plumbing' 
  | 'Other';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintStatus = 
  | 'Submitted' 
  | 'Pending Review' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Completed' 
  | 'Verified' 
  | 'Closed'
  | 'Reopened';

export type RequestType = 'Water' | 'Cleaning' | 'Electricity' | 'General';

export type RequestStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Completed';

export interface Bed {
  id: string;
  code: string; // e.g. "Bed A", "Bed B"
  status: BedStatus;
  studentId?: string;
  monthlyRent: number;
}

export interface Room {
  id: string;
  floorId: string;
  buildingId: string;
  propertyId: string;
  roomNumber: string; // e.g. "101", "401"
  sharingType: 'Single' | 'Double' | 'Triple' | 'Four Sharing';
  beds: Bed[];
  monthlyRentPerBed: number;
  hasAttachedWashroom: boolean;
  hasAc: boolean;
  notes?: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  name: string; // e.g. "Floor 1", "Ground Floor"
  rooms: Room[];
}

export interface Building {
  id: string;
  propertyId: string;
  name: string; // e.g. "Building A", "Block B"
  floors: Floor[];
}

export interface VerifiedReview {
  id: string;
  studentName: string;
  avatarUrl: string;
  rating: number; // 1-5
  date: string;
  roomType: string;
  verifiedStayMonths: number;
  comment: string;
  foodRating: number;
  cleanlinessRating: number;
  maintenanceRating: number;
  wifiRating: number;
  helpfulCount?: number;
}

export interface PropertyListingDetails {
  tagline: string;
  description: string;
  photos: string[];
  gender: 'Boys' | 'Girls' | 'Co-ed';
  startingPrice: number;
  depositMonths: number;
  noticePeriodDays: number;
  curfewTime: string;
  visitorPolicy: string;
  livabilityScore: number; // 0 - 100
  cityRank: number;
  localityRank: number;
  localityName: string;
  totalReviewsCount: number;
  avgRating: number; // e.g. 4.8
  avgComplaintResolutionHours: number;
  foodRating: number; // 1-5
  cleanlinessScore: number; // 0-100
  verifiedStatus: 'verified' | 'pending_audit' | 'unverified';
  featuredBadge?: string;
  nearestLandmark: string;
  distanceToCampusOrMetro: string;
  coordinates: { lat: number; lng: number };
  roomPricingSummary: {
    single?: number;
    double?: number;
    triple?: number;
    four?: number;
  };
  verifiedReviews: VerifiedReview[];
}

export interface PropertyEnquiry {
  id: string;
  propertyId: string;
  propertyName: string;
  studentName: string;
  phone: string;
  email: string;
  sharingPreference: 'Single' | 'Double' | 'Triple' | 'Any';
  moveInDate: string;
  type: 'schedule_visit' | 'reserve_bed' | 'general_enquiry';
  notes?: string;
  status: 'pending' | 'contacted' | 'visit_scheduled' | 'admitted';
  createdAt: string;
}

export interface Property {
  id: string;
  name: string;
  code: string;
  type: 'Hostel' | 'PG' | 'Co-Living' | 'Rental';
  address: string;
  city: string;
  state: string;
  pincode: string;
  managerName: string;
  managerPhone: string;
  amenities: string[];
  buildings: Building[];
  totalRooms?: number;
  totalBeds?: number;
  occupiedBeds?: number;
  publicListing?: boolean;
  listingDetails?: PropertyListingDetails;
}

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: 'Aadhaar' | 'College ID' | 'Agreement' | 'Passport' | 'Police Verification';
  url: string;
  uploadedAt: string;
  verified: boolean;
}

export interface Student {
  id: string;
  propertyId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  avatarUrl: string;
  collegeOrWork: string;
  joiningDate: string;
  exitDate?: string;
  monthlyFee: number;
  securityDeposit: number;
  dueDay: number; // e.g. 5th of each month
  paymentStatus: PaymentStatus;
  status: 'Active' | 'Notice Period' | 'Checked Out';
  guardian: Guardian;
  documents: StudentDocument[];
  bloodGroup?: string;
  emergencyContact: string;
}

export interface Staff {
  id: string;
  propertyId: string;
  name: string;
  role: 'Electrician' | 'Plumber' | 'Cleaner' | 'Cook' | 'Security' | 'Maintenance Worker' | 'General Staff' | 'Manager' | 'Accountant' | 'Housekeeping' | 'Maintenance' | 'Caretaker';
  phone: string;
  email?: string;
  avatarUrl: string;
  status: 'Active' | 'On Leave' | 'Off Duty' | 'Terminated';
  assignedTasksCount?: number;
  completedTasksCount?: number;
  shiftTiming?: string;
  shift?: string;
  assignedBlock?: string;
  joiningDate?: string;
  salaryType?: 'monthly' | 'daily' | 'hourly';
  basicSalary?: number;
  emergencyContact?: string;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    upiId?: string;
  };
}

export type AttendanceStatus = 
  | 'Present' 
  | 'Absent' 
  | 'Half-Day' 
  | 'Approved Leave' 
  | 'present' 
  | 'absent' 
  | 'half-day' 
  | 'leave';

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  propertyId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkInTime?: string;
  checkOut?: string;
  checkOutTime?: string;
  overtimeHours?: number;
  remarks?: string;
  notes?: string;
}

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  propertyId: string;
  leaveType: 'Casual' | 'Sick' | 'Emergency' | 'Paid Leave' | 'Medical';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  reviewedBy?: string;
  responseNote?: string;
  reviewerNotes?: string;
  appliedAt: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  propertyId: string;
  month: string; // e.g. "October 2026"
  basicPay: number;
  overtimePay: number;
  allowances: number;
  deductions: number;
  advanceRecovery: number;
  netPay: number; // Basic + Overtime + Allowances - Deductions - Advance
  status: 'Pending' | 'Approved' | 'Paid';
  paymentDate?: string;
  paymentMethod?: 'Bank Transfer' | 'UPI' | 'Cash' | 'Cheque';
  transactionReference?: string;
  salarySlipGenerated?: boolean;
  notes?: string;
}

export interface RecurringProblemCluster {
  id: string;
  category: ComplaintCategory;
  buildingName: string;
  affectedRooms: string[];
  complaintCount: number;
  firstReportedAt: string;
  latestReportedAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probableRootCause: string;
  recommendedAction: string;
  isResolved: boolean;
  investigationNotes?: string;
}

export interface PropertyHealthScore {
  overallScore: number;
  occupancyScore: number;
  maintenanceScore: number;
  foodScore: number;
  collectionScore: number;
  staffPerformanceScore: number;
  insights: Array<{
    type: 'positive' | 'warning' | 'alert';
    metric: string;
    message: string;
    recommendation: string;
  }>;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  propertyId: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  bedCode: string;
  amount: number;
  monthFor: string; // e.g. "September 2026"
  paymentDate: string;
  dueDate: string;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card' | 'Online Gateway';
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  remainingBalance: number;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  propertyId: string;
  buildingName: string;
  floorName: string;
  roomNumber: string;
  bedCode?: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffRole?: string;
  resolutionNotes?: string;
  verifiedByResident?: boolean;
  verifiedAt?: string;
  studentVerifiedAt?: string;
  verifiedResolutionRating?: number;
  residentFeedbackRating?: number;
  reopenReason?: string;
  aiDiagnostic?: {
    suggestedCategory: string;
    possibleCauses: string[];
    suggestedFixes: string[];
    safetyWarning?: string;
  };
}

export interface Meal {
  title: string;
  items: string[];
  calories?: string;
  timing: string;
}

export interface DailyMenu {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  date: string;
  breakfast: Meal;
  lunch: Meal;
  snacks?: Meal;
  dinner: Meal;
}

export interface FoodRating {
  id: string;
  propertyId: string;
  studentId: string;
  studentName: string;
  date: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  taste: number; // 1-5
  quality: number; // 1-5
  quantity: number; // 1-5
  overall: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  propertyId: string;
  studentId: string;
  studentName: string;
  buildingName: string;
  floorName: string;
  roomNumber: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  assignedStaffName?: string;
}

export interface Announcement {
  id: string;
  propertyId: string;
  title: string;
  content: string;
  category: 'Water' | 'Electricity' | 'Food' | 'Holiday' | 'Emergency' | 'Rules' | 'General';
  targetAudience: 'All' | 'Building' | 'Floor' | 'Specific Students';
  targetDetails?: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  isPinned: boolean;
  priority: 'normal' | 'urgent' | 'important';
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'fee' | 'payment' | 'complaint' | 'staff' | 'food' | 'announcement' | 'request' | 'emergency';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  date: string;
  paidTo: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'UPI' | 'Cheque';
  receiptUrl?: string;
  notes?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'alert' | 'recommendation' | 'positive' | 'warning';
  category: 'maintenance' | 'finance' | 'occupancy' | 'food' | 'operations';
  metric?: string;
  actionLabel?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}
