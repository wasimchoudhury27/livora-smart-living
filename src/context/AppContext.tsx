import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Property, 
  Student, 
  Staff, 
  Payment, 
  Complaint, 
  DailyMenu, 
  FoodRating, 
  ServiceRequest, 
  Announcement, 
  Expense, 
  NotificationItem, 
  AIInsight,
  UserRole,
  BedStatus,
  ComplaintStatus,
  RequestStatus,
  PropertyEnquiry,
  StaffAttendanceRecord,
  StaffLeaveRequest,
  PayrollRecord,
  RecurringProblemCluster,
  PropertyHealthScore
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_STUDENTS, 
  INITIAL_STAFF, 
  INITIAL_PAYMENTS, 
  INITIAL_COMPLAINTS, 
  INITIAL_MENU, 
  INITIAL_FOOD_RATINGS, 
  INITIAL_REQUESTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_EXPENSES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AI_INSIGHTS 
} from '../data/initialData';
import { DISCOVERY_PROPERTIES, INITIAL_ENQUIRIES } from '../data/discoveryData';
import { 
  ENRICHED_INITIAL_STAFF, 
  INITIAL_STAFF_ATTENDANCE, 
  INITIAL_STAFF_LEAVES, 
  INITIAL_PAYROLL_RECORDS,
  calculateNetPay,
  detectRecurringProblems,
  calculatePropertyHealthScore
} from '../data/staffBusinessData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface SettlementDetails {
  studentId: string;
  exitDate: string;
  securityDepositRefund: number;
  damageChargesDeducted: number;
  pendingFeesDeducted: number;
  finalSettlementAmount: number;
  reason?: string;
}

interface AppContextType {
  // Auth & Roles
  isLoggedIn: boolean;
  currentUserRole: UserRole;
  currentRole: UserRole;
  activeStudent: Student;
  currentStudent: Student;
  activeStaff: Staff;
  currentStaff: Staff;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  setCurrentUserRole: (role: UserRole) => void;
  setRole: (role: UserRole) => void;

  // Property
  properties: Property[];
  currentProperty: Property;
  setCurrentPropertyId: (id: string) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  updatePropertyListingDetails: (propertyId: string, updates: Partial<Property>) => void;

  // Rooms & Beds
  updateBedStatus: (
    buildingId: string, 
    floorId: string, 
    roomId: string, 
    bedId: string, 
    newStatus: BedStatus,
    studentId?: string
  ) => void;

  // Students & Check-in / Check-out
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  checkOutStudent: (details: SettlementDetails) => void;
  checkoutStudent: (studentId: string) => void;

  // Staff & Workforce Management
  staff: Staff[];
  addStaff: (staffMember: Staff) => void;
  updateStaff: (staffMember: Staff) => void;
  staffAttendance: StaffAttendanceRecord[];
  markAttendance: (record: Omit<StaffAttendanceRecord, 'id'>) => void;
  batchMarkAttendance: (records: Omit<StaffAttendanceRecord, 'id'>[]) => void;
  staffLeaves: StaffLeaveRequest[];
  applyStaffLeave: (leave: Omit<StaffLeaveRequest, 'id' | 'appliedAt' | 'status'>) => void;
  reviewStaffLeave: (id: string, status: 'approved' | 'rejected', reviewerNotes?: string) => void;
  payrollRecords: PayrollRecord[];
  generateMonthlyPayroll: (month: string) => void;
  updatePayrollRecord: (record: PayrollRecord) => void;
  markPayrollPaid: (id: string, paymentMethod: string, transactionReference: string) => void;

  // Payments & Receipts
  payments: Payment[];
  recordPayment: (payment: any) => Payment;

  // Complaints & Maintenance
  complaints: Complaint[];
  createComplaint: (complaint: Omit<Complaint, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => Complaint;
  addComplaint: (complaint: any) => Complaint;
  updateComplaintStatus: (id: string, status: ComplaintStatus, resolutionNotes?: string) => void;
  assignStaffToComplaint: (complaintId: string, staffId: string) => void;
  assignComplaintStaff: (complaintId: string, staffId: string, staffName?: string, staffRole?: string) => void;
  verifyComplaintResolution: (complaintId: string, verified: boolean, feedbackRating?: number, reopenReason?: string) => void;
  recurringProblems: RecurringProblemCluster[];

  // Property Health & Intelligence
  healthScore: PropertyHealthScore;

  // Service Requests (Water, Cleaning, etc.)
  requests: ServiceRequest[];
  serviceRequests: ServiceRequest[];
  createRequest: (request: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => ServiceRequest;
  addServiceRequest: (request: any) => ServiceRequest;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
  updateServiceRequestStatus: (id: string, status: RequestStatus) => void;

  // Food & Mess
  weeklyMenu: DailyMenu[];
  foodMenus: DailyMenu[];
  updateMenu: (day: string, menu: Partial<DailyMenu>) => void;
  foodRatings: FoodRating[];
  submitFoodRating: (rating: Omit<FoodRating, 'id' | 'createdAt'>) => void;

  // Announcements
  announcements: Announcement[];
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Announcement;
  addAnnouncement: (announcement: any) => Announcement;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Expense;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // AI Insights
  aiInsights: AIInsight[];

  // Computed KPIs & Financial Breakdown
  stats: {
    totalRooms: number;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    occupancyRate: number;
    feesCollected: number;
    feesPending: number;
    openComplaints: number;
    totalRevenueMonth: number;
    totalExpensesMonth: number;
    averageFoodRating: number;
    totalPayrollExpense: number;
    totalOperatingExpenses: number;
    operatingSurplus: number;
  };

  // Toast System
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;

  // Discovery & Enquiries
  enquiries: PropertyEnquiry[];
  addEnquiry: (enquiry: Omit<PropertyEnquiry, 'id' | 'createdAt' | 'status'>) => PropertyEnquiry;
  updateEnquiryStatus: (id: string, status: PropertyEnquiry['status']) => void;
  platformMode: 'discovery' | 'management';
  setPlatformMode: (mode: 'discovery' | 'management') => void;

  // Reset to initial demo
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'livora_v1_';
const LEGACY_STORAGE_KEY_PREFIX = 'staysphere_v1_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key) || localStorage.getItem(LEGACY_STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Failed to read ${key} from storage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => loadFromStorage('is_logged_in', true));
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => loadFromStorage('user_role', 'owner'));

  // Core Data
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = loadFromStorage<Property[]>('properties', INITIAL_PROPERTIES);
    // Enrich saved with DISCOVERY_PROPERTIES listing details
    const map = new Map<string, Property>();
    saved.forEach(p => map.set(p.id, p));
    DISCOVERY_PROPERTIES.forEach(dp => {
      const existing = map.get(dp.id);
      if (existing) {
        map.set(dp.id, {
          ...existing,
          publicListing: existing.publicListing ?? dp.publicListing,
          listingDetails: existing.listingDetails ?? dp.listingDetails,
          totalRooms: existing.totalRooms || dp.totalRooms,
          totalBeds: existing.totalBeds || dp.totalBeds,
          occupiedBeds: existing.occupiedBeds || dp.occupiedBeds,
        });
      } else {
        map.set(dp.id, dp);
      }
    });
    return Array.from(map.values());
  });
  const [currentPropertyId, setCurrentPropertyIdState] = useState<string>(() => loadFromStorage('current_property_id', 'prop-1'));

  // Platform Mode: 'discovery' (Public discovery & rankings) or 'management' (Property management portal)
  const [platformMode, setPlatformModeState] = useState<'discovery' | 'management'>(() => 
    loadFromStorage<'discovery' | 'management'>('platform_mode', 'discovery')
  );

  const setPlatformMode = (mode: 'discovery' | 'management') => {
    setPlatformModeState(mode);
    saveToStorage('platform_mode', mode);
  };

  // Public Enquiries & Scheduled Visits
  const [enquiries, setEnquiries] = useState<PropertyEnquiry[]>(() => 
    loadFromStorage('enquiries', INITIAL_ENQUIRIES)
  );

  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', INITIAL_STUDENTS));
  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = loadFromStorage<Staff[]>('staff', ENRICHED_INITIAL_STAFF);
    // Enrich with new fields if older data exists
    return saved.map(s => {
      const enriched = ENRICHED_INITIAL_STAFF.find(e => e.id === s.id);
      return enriched ? { ...enriched, ...s, basicSalary: s.basicSalary ?? enriched.basicSalary } : s;
    });
  });
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>(() => 
    loadFromStorage('staff_attendance', INITIAL_STAFF_ATTENDANCE)
  );
  const [staffLeaves, setStaffLeaves] = useState<StaffLeaveRequest[]>(() => 
    loadFromStorage('staff_leaves', INITIAL_STAFF_LEAVES)
  );
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => 
    loadFromStorage('payroll_records', INITIAL_PAYROLL_RECORDS)
  );

  const [payments, setPayments] = useState<Payment[]>(() => loadFromStorage('payments', INITIAL_PAYMENTS));
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadFromStorage('complaints', INITIAL_COMPLAINTS));
  const [weeklyMenu, setWeeklyMenu] = useState<DailyMenu[]>(() => loadFromStorage('menu', INITIAL_MENU));
  const [foodRatings, setFoodRatings] = useState<FoodRating[]>(() => loadFromStorage('food_ratings', INITIAL_FOOD_RATINGS));
  const [requests, setRequests] = useState<ServiceRequest[]>(() => loadFromStorage('requests', INITIAL_REQUESTS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadFromStorage('announcements', INITIAL_ANNOUNCEMENTS));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadFromStorage('expenses', INITIAL_EXPENSES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [aiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to storage
  useEffect(() => { saveToStorage('is_logged_in', isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { saveToStorage('user_role', currentUserRole); }, [currentUserRole]);
  useEffect(() => { saveToStorage('properties', properties); }, [properties]);
  useEffect(() => { saveToStorage('current_property_id', currentPropertyId); }, [currentPropertyId]);
  useEffect(() => { saveToStorage('platform_mode', platformMode); }, [platformMode]);
  useEffect(() => { saveToStorage('enquiries', enquiries); }, [enquiries]);
  useEffect(() => { saveToStorage('students', students); }, [students]);
  useEffect(() => { saveToStorage('staff', staff); }, [staff]);
  useEffect(() => { saveToStorage('staff_attendance', staffAttendance); }, [staffAttendance]);
  useEffect(() => { saveToStorage('staff_leaves', staffLeaves); }, [staffLeaves]);
  useEffect(() => { saveToStorage('payroll_records', payrollRecords); }, [payrollRecords]);
  useEffect(() => { saveToStorage('payments', payments); }, [payments]);
  useEffect(() => { saveToStorage('complaints', complaints); }, [complaints]);
  useEffect(() => { saveToStorage('menu', weeklyMenu); }, [weeklyMenu]);
  useEffect(() => { saveToStorage('food_ratings', foodRatings); }, [foodRatings]);
  useEffect(() => { saveToStorage('requests', requests); }, [requests]);
  useEffect(() => { saveToStorage('announcements', announcements); }, [announcements]);
  useEffect(() => { saveToStorage('expenses', expenses); }, [expenses]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);

  const showToast = (title: string, description?: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentProperty = useMemo(() => {
    return properties.find(p => p.id === currentPropertyId) || properties[0] || INITIAL_PROPERTIES[0];
  }, [properties, currentPropertyId]);

  const setCurrentPropertyId = (id: string) => {
    setCurrentPropertyIdState(id);
    const prop = properties.find(p => p.id === id);
    if (prop) {
      showToast('Switched Property', `Now managing: ${prop.name}`, 'info');
    }
  };

  const activeStudent = useMemo(() => {
    return students.find(s => s.id === 'std-1') || students[0] || INITIAL_STUDENTS[0];
  }, [students]);

  const activeStaff = useMemo(() => {
    return staff.find(s => s.role === 'Electrician') || staff[0] || INITIAL_STAFF[0];
  }, [staff]);

  const loginAs = (role: UserRole) => {
    setCurrentUserRole(role);
    setIsLoggedIn(true);
    showToast('Logged In Successfully', `Welcome to LIVORA as ${role.toUpperCase()}`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Logged Out', 'You have securely signed out of your session', 'info');
  };

  // KPI Calculations
  const stats = useMemo(() => {
    let totalRooms = 0;
    let totalBeds = 0;
    let occupiedBeds = 0;

    currentProperty.buildings.forEach(bldg => {
      bldg.floors.forEach(flr => {
        totalRooms += flr.rooms.length;
        flr.rooms.forEach(rm => {
          totalBeds += rm.beds.length;
          occupiedBeds += rm.beds.filter(b => b.status === 'occupied').length;
        });
      });
    });

    const fallbackTotalRooms = currentProperty.totalRooms || 80;
    const fallbackTotalBeds = currentProperty.totalBeds || 160;
    const finalTotalRooms = totalRooms > 0 ? totalRooms : fallbackTotalRooms;
    const finalTotalBeds = totalBeds > 0 ? totalBeds : fallbackTotalBeds;
    const finalOccupiedBeds = occupiedBeds > 0 ? occupiedBeds : (currentProperty.occupiedBeds || 145);
    const availableBeds = Math.max(0, finalTotalBeds - finalOccupiedBeds);
    const occupancyRate = Number(((finalOccupiedBeds / finalTotalBeds) * 100).toFixed(1));

    // Fees for current property
    const propPayments = payments.filter(p => p.propertyId === currentProperty.id);
    const rawFeesCollected = propPayments
      .filter(p => p.status === 'paid' || p.status === 'partial')
      .reduce((sum, p) => sum + p.amount, 0);
    const feesCollected = rawFeesCollected > 0 ? rawFeesCollected : 640000;

    const rawFeesPending = propPayments
      .filter(p => p.status === 'pending' || p.status === 'overdue' || p.status === 'partial')
      .reduce((sum, p) => sum + (p.remainingBalance || 0), 0);
    const feesPending = rawFeesPending > 0 ? rawFeesPending : 48000;

    const openComplaints = complaints.filter(
      c => c.propertyId === currentProperty.id && c.status !== 'Completed' && c.status !== 'Verified' && c.status !== 'Closed'
    ).length;

    // Staff Payroll expense for property
    const propPayroll = payrollRecords.filter(pr => pr.propertyId === currentProperty.id && pr.status === 'Paid');
    const totalPayrollExpense = propPayroll.length > 0 
      ? propPayroll.reduce((sum, pr) => sum + pr.netPay, 0)
      : 124500;

    // Other operating expenses (groceries/mess, electricity, water, repairs)
    const directExpenses = expenses
      .filter(e => e.propertyId === currentProperty.id)
      .reduce((sum, e) => sum + e.amount, 0);
    const baseExpenses = directExpenses > 0 ? directExpenses : 183700;

    // Total Operating Expenses = Direct Operating Expenses + Staff Payroll
    const totalOperatingExpenses = baseExpenses + totalPayrollExpense;

    // Operating Surplus = Fees Collected - Total Operating Expenses
    const operatingSurplus = feesCollected - totalOperatingExpenses;
    const totalRevenueMonth = feesCollected;

    const propRatings = foodRatings.filter(r => r.propertyId === currentProperty.id);
    const averageFoodRating = propRatings.length > 0 
      ? Number((propRatings.reduce((sum, r) => sum + r.overall, 0) / propRatings.length).toFixed(1))
      : 4.1;

    return {
      totalRooms: finalTotalRooms,
      totalBeds: finalTotalBeds,
      occupiedBeds: finalOccupiedBeds,
      availableBeds,
      occupancyRate,
      feesCollected,
      feesPending,
      openComplaints: openComplaints > 0 ? openComplaints : 3,
      totalRevenueMonth,
      totalExpensesMonth: totalOperatingExpenses,
      averageFoodRating,
      totalPayrollExpense,
      totalOperatingExpenses,
      operatingSurplus,
    };
  }, [currentProperty, payments, complaints, expenses, foodRatings, payrollRecords]);

  // Recurring Problems Detection across rooms & wings in property
  const recurringProblems = useMemo(() => {
    return detectRecurringProblems(complaints, currentProperty.id);
  }, [complaints, currentProperty.id]);

  // Property Health Score computation
  const healthScore = useMemo(() => {
    const propAttendance = staffAttendance.filter(a => a.propertyId === currentProperty.id);
    const presentCount = propAttendance.filter(a => a.status?.toLowerCase() === 'present' || a.status?.toLowerCase() === 'half-day').length;
    const staffAttendanceRate = propAttendance.length > 0 ? (presentCount / propAttendance.length) * 100 : 92;
    return calculatePropertyHealthScore(
      stats.occupancyRate,
      stats.openComplaints,
      stats.averageFoodRating,
      stats.feesCollected,
      stats.feesPending,
      staffAttendanceRate
    );
  }, [stats, staffAttendance, currentProperty.id]);

  // Update Bed Status in hierarchical tree
  const updateBedStatus = (
    buildingId: string, 
    floorId: string, 
    roomId: string, 
    bedId: string, 
    newStatus: BedStatus,
    studentId?: string
  ) => {
    setProperties(prev => prev.map(prop => {
      if (prop.id !== currentProperty.id) return prop;
      return {
        ...prop,
        buildings: prop.buildings.map(bldg => {
          if (bldg.id !== buildingId) return bldg;
          return {
            ...bldg,
            floors: bldg.floors.map(flr => {
              if (flr.id !== floorId) return flr;
              return {
                ...flr,
                rooms: flr.rooms.map(rm => {
                  if (rm.id !== roomId) return rm;
                  return {
                    ...rm,
                    beds: rm.beds.map(b => {
                      if (b.id !== bedId) return b;
                      return {
                        ...b,
                        status: newStatus,
                        studentId: newStatus === 'available' ? undefined : (studentId || b.studentId),
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    }));
  };

  // Property operations
  const addProperty = (newProp: Property) => {
    setProperties(prev => [newProp, ...prev]);
    setCurrentPropertyIdState(newProp.id);
    showToast('Property Added', `${newProp.name} has been set up successfully!`, 'success');
  };

  const updateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast('Property Updated', 'Changes have been saved', 'success');
  };

  const updatePropertyListingDetails = (propertyId: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return {
          ...p,
          ...updates,
          listingDetails: p.listingDetails ? {
            ...p.listingDetails,
            ...(updates.listingDetails || {})
          } : updates.listingDetails
        };
      }
      return p;
    }));
    showToast('Listing Updated', 'Public discovery profile updated successfully', 'success');
  };

  const addEnquiry = (enquiryData: Omit<PropertyEnquiry, 'id' | 'createdAt' | 'status'>): PropertyEnquiry => {
    const newEnquiry: PropertyEnquiry = {
      ...enquiryData,
      id: `ENQ-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setEnquiries(prev => [newEnquiry, ...prev]);

    // Create real notification for property management
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Student Booking Enquiry',
      message: `${newEnquiry.studentName} requested to ${newEnquiry.type === 'schedule_visit' ? 'visit' : 'reserve a bed at'} ${newEnquiry.propertyName} (${newEnquiry.sharingPreference} Sharing).`,
      type: 'announcement',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    showToast('Enquiry Submitted!', `Your booking request has been sent to ${newEnquiry.propertyName}. Reference: ${newEnquiry.id}`, 'success');
    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: PropertyEnquiry['status']) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    showToast('Enquiry Updated', `Status changed to ${status}`, 'info');
  };

  // Students & Admission
  const addStudent = (student: Student) => {
    setStudents(prev => [student, ...prev]);
    // Automatically set bed to occupied
    updateBedStatus(student.buildingId, student.floorId, student.roomId, student.bedId, 'occupied', student.id);
    
    // Create initial invoice/payment record
    const newPayment: Payment = {
      id: 'pay-' + Date.now(),
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: student.propertyId,
      studentId: student.id,
      studentName: student.name,
      roomNumber: student.roomId.replace('rm-', ''),
      bedCode: 'Bed',
      amount: student.monthlyFee,
      monthFor: 'September 2026',
      paymentDate: new Date().toISOString().split('T')[0],
      dueDate: `2026-09-${String(student.dueDay).padStart(2, '0')}`,
      paymentMethod: 'UPI',
      status: 'paid',
      transactionId: `TXN/ADM/${Math.floor(10000000 + Math.random() * 90000000)}`,
      remainingBalance: 0,
      notes: 'Initial admission fee & first month advance',
    };
    setPayments(prev => [newPayment, ...prev]);

    // Create notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'New Student Admitted',
      message: `${student.name} checked into Bed at ${currentProperty.name}.`,
      type: 'payment',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('Admission Complete 🎉', `${student.name} admitted & assigned to room!`, 'success');
  };

  const updateStudent = (student: Student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    showToast('Student Profile Updated', student.name, 'success');
  };

  const checkOutStudent = (details: SettlementDetails) => {
    const student = students.find(s => s.id === details.studentId);
    if (!student) return;

    // Mark student status as Checked Out
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: 'Checked Out', exitDate: details.exitDate } : s));

    // Release bed to available
    updateBedStatus(student.buildingId, student.floorId, student.roomId, student.bedId, 'available');

    // Create settlement record / receipt
    const settlementReceipt: Payment = {
      id: 'pay-settle-' + Date.now(),
      receiptNumber: `SETTLE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: student.propertyId,
      studentId: student.id,
      studentName: student.name,
      roomNumber: student.roomId.replace('rm-', ''),
      bedCode: 'Bed',
      amount: details.finalSettlementAmount,
      monthFor: 'Checkout Settlement',
      paymentDate: details.exitDate,
      dueDate: details.exitDate,
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      transactionId: `REFUND/TXN/${Math.floor(100000 + Math.random() * 900000)}`,
      remainingBalance: 0,
      notes: `Security deposit refund ₹${details.securityDepositRefund} after damage deductions (₹${details.damageChargesDeducted}) and pending dues (₹${details.pendingFeesDeducted}).`,
    };
    setPayments(prev => [settlementReceipt, ...prev]);

    showToast('Checkout Processed', `${student.name} checked out. Bed is now AVAILABLE.`, 'success');
  };

  // Staff operations
  const addStaff = (newStaff: Staff) => {
    setStaff(prev => [newStaff, ...prev]);
    showToast('Staff Member Added', `${newStaff.name} (${newStaff.role})`, 'success');
  };

  const updateStaff = (updated: Staff) => {
    setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
    showToast('Staff Updated', updated.name, 'success');
  };

  // Staff Attendance Register & Biometrics
  const markAttendance = (record: Omit<StaffAttendanceRecord, 'id'>) => {
    setStaffAttendance(prev => {
      const existingIdx = prev.findIndex(a => a.staffId === record.staffId && a.date === record.date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...record };
        return updated;
      } else {
        const newRecord: StaffAttendanceRecord = {
          ...record,
          id: 'att-' + Date.now() + Math.random().toString(36).substring(2, 5),
        };
        return [newRecord, ...prev];
      }
    });
    showToast('Attendance Logged', `${record.staffName}: Marked as ${record.status.toUpperCase()}`, 'success');
  };

  const batchMarkAttendance = (records: Omit<StaffAttendanceRecord, 'id'>[]) => {
    setStaffAttendance(prev => {
      const updated = [...prev];
      records.forEach(rec => {
        const idx = updated.findIndex(a => a.staffId === rec.staffId && a.date === rec.date);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...rec };
        } else {
          updated.unshift({
            ...rec,
            id: 'att-' + Date.now() + Math.random().toString(36).substring(2, 5),
          });
        }
      });
      return updated;
    });
    showToast('Duty Roster Updated', `Attendance saved for ${records.length} staff members.`, 'success');
  };

  // Staff Leaves
  const applyStaffLeave = (leaveData: Omit<StaffLeaveRequest, 'id' | 'appliedAt' | 'status'>) => {
    const newLeave: StaffLeaveRequest = {
      ...leaveData,
      id: 'leave-' + Date.now(),
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setStaffLeaves(prev => [newLeave, ...prev]);
    showToast('Leave Request Submitted', `${newLeave.staffName} applied for ${newLeave.daysCount} day(s) leave.`, 'info');
  };

  const reviewStaffLeave = (id: string, status: 'approved' | 'rejected', reviewerNotes?: string) => {
    const leave = staffLeaves.find(l => l.id === id);
    if (!leave) return;

    const normalizedStatus = status === 'approved' ? 'Approved' : 'Rejected';

    setStaffLeaves(prev => prev.map(l => l.id === id ? {
      ...l,
      status: normalizedStatus,
      reviewedBy: 'Warden / Manager',
      reviewedAt: new Date().toISOString().split('T')[0],
      reviewerNotes
    } : l));

    // If approved, automatically mark attendance as 'leave' for that date range
    if (status === 'approved') {
      const datesToMark = [leave.startDate];
      if (leave.endDate && leave.endDate !== leave.startDate) {
        datesToMark.push(leave.endDate);
      }
      datesToMark.forEach(d => {
        markAttendance({
          staffId: leave.staffId,
          staffName: leave.staffName,
          propertyId: currentProperty.id,
          date: d,
          status: 'leave',
          notes: `Approved leave: ${leave.reason}`
        });
      });
    }

    showToast(`Leave Request ${status.toUpperCase()}`, `${leave.staffName}'s leave has been ${status}.`, status === 'approved' ? 'success' : 'info');
  };

  // Payroll Management
  const generateMonthlyPayroll = (month: string) => {
    const currentStaffMembers = staff.filter(s => s.propertyId === currentProperty.id && s.status === 'Active');
    const newRecords: PayrollRecord[] = [];

    currentStaffMembers.forEach(stf => {
      const exists = payrollRecords.find(p => p.staffId === stf.id && p.month === month);
      if (!exists) {
        const basic = stf.basicSalary || 18000;
        const overtime = 0;
        const allowances = Math.round(basic * 0.05);
        const deductions = 300;
        const advanceRecovery = 0;
        const net = calculateNetPay(basic, overtime, allowances, deductions, advanceRecovery);

        newRecords.push({
          id: 'pay-' + stf.id + '-' + month.replace(/\s+/g, '-').toLowerCase(),
          staffId: stf.id,
          staffName: stf.name,
          staffRole: stf.role,
          propertyId: currentProperty.id,
          month,
          basicPay: basic,
          overtimePay: overtime,
          allowances,
          deductions,
          advanceRecovery,
          netPay: net,
          status: 'Pending',
          notes: `Monthly payroll run for ${month}`
        });
      }
    });

    if (newRecords.length > 0) {
      setPayrollRecords(prev => [...newRecords, ...prev]);
      showToast('Payroll Generated', `Drafted payroll slips for ${newRecords.length} staff members for ${month}`, 'success');
    } else {
      showToast('Payroll Current', `Payroll records for ${month} already exist.`, 'info');
    }
  };

  const updatePayrollRecord = (record: PayrollRecord) => {
    const netPay = calculateNetPay(
      record.basicPay,
      record.overtimePay,
      record.allowances,
      record.deductions,
      record.advanceRecovery
    );
    const updated = { ...record, netPay };
    setPayrollRecords(prev => prev.map(p => p.id === record.id ? updated : p));
    showToast('Salary Slip Updated', `Net Pay recalculated: ₹${netPay.toLocaleString('en-IN')}`, 'success');
  };

  const markPayrollPaid = (id: string, paymentMethod: string, transactionReference: string) => {
    const record = payrollRecords.find(p => p.id === id);
    if (!record) return;

    const paidRecord: PayrollRecord = {
      ...record,
      status: 'Paid',
      paymentMethod: paymentMethod as PayrollRecord['paymentMethod'],
      transactionReference,
      paymentDate: new Date().toISOString().split('T')[0],
      salarySlipGenerated: true,
    };

    setPayrollRecords(prev => prev.map(p => p.id === id ? paidRecord : p));

    // Automatically record an Expense in Operating Expenses so surplus is accurate!
    addExpense({
      propertyId: record.propertyId,
      title: `Staff Payroll: ${record.staffName} (${record.staffRole})`,
      category: 'Staff',
      amount: record.netPay,
      date: new Date().toISOString().split('T')[0],
      paidTo: record.staffName,
      paymentMethod: (paymentMethod as any) || 'Bank Transfer',
      receiptUrl: '',
      notes: `Disbursed via ${paymentMethod}. Ref: ${transactionReference}. Month: ${record.month}`
    });

    showToast('Salary Disbursed 🎉', `₹${record.netPay.toLocaleString('en-IN')} paid to ${record.staffName}`, 'success');
  };

  // Payments
  const recordPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber'>): Payment => {
    const newPayment: Payment = {
      ...paymentData,
      id: 'pay-' + Date.now(),
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setPayments(prev => [newPayment, ...prev]);

    // Update student payment status
    if (newPayment.remainingBalance === 0) {
      setStudents(prev => prev.map(s => s.id === newPayment.studentId ? { ...s, paymentStatus: 'paid' } : s));
    }

    // Add notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Payment Recorded',
      message: `₹${newPayment.amount.toLocaleString('en-IN')} received from ${newPayment.studentName} (${newPayment.paymentMethod}).`,
      type: 'payment',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('Payment Recorded', `Receipt #${newPayment.receiptNumber} generated!`, 'success');
    return newPayment;
  };

  // Complaints & Maintenance
  const createComplaint = (complaintData: Omit<Complaint, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): Complaint => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: 'cmp-' + Date.now(),
      ticketNumber: `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setComplaints(prev => [newComplaint, ...prev]);

    // Auto notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'New Complaint Logged',
      message: `${newComplaint.studentName} in Room ${newComplaint.roomNumber} reported ${newComplaint.category} issue: "${newComplaint.title}"`,
      type: 'complaint',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('Ticket Raised', `Complaint #${newComplaint.ticketNumber} registered`, 'success');
    return newComplaint;
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, resolutionNotes?: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        status,
        resolutionNotes: resolutionNotes || c.resolutionNotes,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
    }));

    showToast('Ticket Updated', `Status changed to: ${status}`, 'info');
  };

  const verifyComplaintResolution = (complaintId: string, verified: boolean, feedbackRating?: number, reopenReason?: string) => {
    const complaint = complaints.find(c => c.id === complaintId);
    if (!complaint) return;

    if (verified) {
      setComplaints(prev => prev.map(c => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: 'Verified',
          verifiedResolutionRating: feedbackRating || 5,
          studentVerifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
      }));

      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: 'Resolution Confirmed by Resident',
        message: `${complaint.studentName} confirmed issue #${complaint.ticketNumber} is satisfactorily fixed (${feedbackRating || 5}★).`,
        type: 'complaint',
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
      showToast('Resolution Confirmed', 'Thank you for verifying! Ticket is now permanently closed.', 'success');
    } else {
      setComplaints(prev => prev.map(c => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: 'Reopened',
          reopenReason: reopenReason || 'Resident flagged that issue still persists after staff inspection.',
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
      }));

      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: '⚠️ Ticket Reopened: Issue Still Persists',
        message: `${complaint.studentName} reported that issue #${complaint.ticketNumber} was not resolved properly: "${reopenReason || 'Unresolved'}"`,
        type: 'complaint',
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
      showToast('Ticket Reopened', 'Warden and Technician notified for immediate re-visit.', 'warning');
    }
  };

  const assignStaffToComplaint = (complaintId: string, staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    setComplaints(prev => prev.map(c => {
      if (c.id !== complaintId) return c;
      return {
        ...c,
        assignedStaffId: staffMember.id,
        assignedStaffName: staffMember.name,
        assignedStaffRole: staffMember.role,
        status: 'Assigned',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
    }));

    // Update staff task count
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, assignedTasksCount: (s.assignedTasksCount || 0) + 1 } : s));

    showToast('Staff Assigned', `Assigned to ${staffMember.name} (${staffMember.role})`, 'success');
  };

  // Quick Service Requests
  const createRequest = (reqData: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'createdAt' | 'status'>): ServiceRequest => {
    const newReq: ServiceRequest = {
      ...reqData,
      id: 'req-' + Date.now(),
      ticketNumber: `REQ-${reqData.type.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Submitted',
    };
    setRequests(prev => [newReq, ...prev]);

    showToast('Request Submitted', `Your ${reqData.type} request has been queued!`, 'success');
    return newReq;
  };

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast('Request Updated', `Status is now ${status}`, 'info');
  };

  // Food Menu & Ratings
  const updateMenu = (day: string, menuPartial: Partial<DailyMenu>) => {
    setWeeklyMenu(prev => prev.map(m => m.day === day ? { ...m, ...menuPartial } : m));
    showToast('Mess Menu Updated', `${day}'s menu updated successfully`, 'success');
  };

  const submitFoodRating = (ratingData: Omit<FoodRating, 'id' | 'createdAt'>) => {
    const newRating: FoodRating = {
      ...ratingData,
      id: 'fr-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setFoodRatings(prev => [newRating, ...prev]);
    showToast('Thank You!', 'Your feedback helps the kitchen team serve better meals.', 'success');
  };

  // Announcements
  const createAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt'>): Announcement => {
    const newAnn: Announcement = {
      ...data,
      id: 'ann-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    // Add notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `Announcement: ${newAnn.title}`,
      message: newAnn.content.substring(0, 80) + '...',
      type: 'announcement',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('Announcement Published', `Broadcasted to ${newAnn.targetAudience}`, 'success');
    return newAnn;
  };

  // Expenses
  const addExpense = (expenseData: Omit<Expense, 'id'>): Expense => {
    const newExp: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now(),
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast('Expense Recorded', `₹${newExp.amount.toLocaleString('en-IN')} for ${newExp.title}`, 'success');
    return newExp;
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All marked as read', 'info');
  };

  // Reset to initial demo
  const resetDemoData = () => {
    setProperties(INITIAL_PROPERTIES);
    setCurrentPropertyIdState('prop-1');
    setStudents(INITIAL_STUDENTS);
    setStaff(ENRICHED_INITIAL_STAFF);
    setStaffAttendance(INITIAL_STAFF_ATTENDANCE);
    setStaffLeaves(INITIAL_STAFF_LEAVES);
    setPayrollRecords(INITIAL_PAYROLL_RECORDS);
    setPayments(INITIAL_PAYMENTS);
    setComplaints(INITIAL_COMPLAINTS);
    setWeeklyMenu(INITIAL_MENU);
    setFoodRatings(INITIAL_FOOD_RATINGS);
    setRequests(INITIAL_REQUESTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setExpenses(INITIAL_EXPENSES);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Demo Data Reset', 'Restored to original showcase state', 'info');
  };

  // Aliases for components
  const currentRole = currentUserRole;
  const setRole = (role: UserRole) => {
    loginAs(role);
  };
  const currentStudent = activeStudent;
  const currentStaff = activeStaff;

  const checkoutStudent = (studentId: string) => {
    const std = students.find(s => s.id === studentId);
    if (!std) return;
    checkOutStudent({
      studentId: std.id,
      exitDate: new Date().toISOString().split('T')[0],
      securityDepositRefund: std.securityDeposit,
      damageChargesDeducted: 0,
      pendingFeesDeducted: std.paymentStatus !== 'paid' ? std.monthlyFee : 0,
      finalSettlementAmount: Math.max(0, std.securityDeposit - (std.paymentStatus !== 'paid' ? std.monthlyFee : 0)),
      reason: 'Regular Tenancy Completion & Settlement',
    });
  };

  const addComplaint = (c: any) => {
    return createComplaint({
      propertyId: c.propertyId || currentProperty.id,
      buildingName: currentProperty.buildings[0]?.name || 'Block A',
      floorName: 'Floor 1',
      roomNumber: c.roomNumber || '101',
      studentId: c.studentId || 'std-1',
      studentName: c.studentName || 'Resident',
      studentPhone: '+91 98765 43210',
      category: c.category || 'Other',
      title: c.title,
      description: c.description,
      priority: c.priority || 'medium',
      status: 'Submitted',
    });
  };

  const assignComplaintStaff = (complaintId: string, staffId: string, staffName?: string, staffRole?: string) => {
    assignStaffToComplaint(complaintId, staffId);
    if (staffName) {
      setComplaints(prev => prev.map(c => c.id === complaintId ? {
        ...c,
        assignedStaffName: staffName,
        assignedStaffRole: staffRole,
        status: 'Assigned',
      } : c));
    }
  };

  const serviceRequests = requests;
  const addServiceRequest = (req: any) => {
    return createRequest({
      propertyId: req.propertyId || currentProperty.id,
      studentId: req.studentId || 'std-1',
      studentName: req.studentName || 'Resident',
      buildingName: 'Block A',
      floorName: 'Floor 1',
      roomNumber: req.roomNumber || '101',
      type: req.type || 'General',
      title: `${req.type || 'Service'} Request`,
      description: req.notes || req.description || `${req.type} service requested`,
    });
  };

  const updateServiceRequestStatus = (id: string, status: RequestStatus) => {
    updateRequestStatus(id, status);
  };

  const foodMenus = weeklyMenu;

  const addAnnouncement = (a: any) => {
    return createAnnouncement({
      propertyId: a.propertyId || currentProperty.id,
      title: a.title,
      content: a.content,
      category: 'General',
      targetAudience: a.targetAudience || 'All',
      authorName: a.authorName || 'Property Admin',
      authorRole: 'Manager',
      isPinned: false,
      priority: a.priority || 'normal',
    });
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        currentUserRole,
        currentRole,
        activeStudent,
        currentStudent,
        activeStaff,
        currentStaff,
        loginAs,
        logout,
        setCurrentUserRole,
        setRole,

        properties,
        currentProperty,
        setCurrentPropertyId,
        addProperty,
        updateProperty,
        updatePropertyListingDetails,

        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        platformMode,
        setPlatformMode,

        updateBedStatus,

        students,
        addStudent,
        updateStudent,
        checkOutStudent,
        checkoutStudent,

        staff,
        addStaff,
        updateStaff,
        staffAttendance,
        markAttendance,
        batchMarkAttendance,
        staffLeaves,
        applyStaffLeave,
        reviewStaffLeave,
        payrollRecords,
        generateMonthlyPayroll,
        updatePayrollRecord,
        markPayrollPaid,

        payments,
        recordPayment,

        complaints,
        createComplaint,
        addComplaint,
        updateComplaintStatus,
        assignStaffToComplaint,
        assignComplaintStaff,
        verifyComplaintResolution,
        recurringProblems,

        healthScore,

        requests,
        serviceRequests,
        createRequest,
        addServiceRequest,
        updateRequestStatus,
        updateServiceRequestStatus,

        weeklyMenu,
        foodMenus,
        updateMenu,
        foodRatings,
        submitFoodRating,

        announcements,
        createAnnouncement,
        addAnnouncement,

        expenses,
        addExpense,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        aiInsights,
        stats,

        toasts,
        showToast,
        dismissToast,

        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
