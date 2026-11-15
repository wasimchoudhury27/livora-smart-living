import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoWalkthroughModal } from './components/common/DemoWalkthroughModal';
import { ToastContainer } from './components/common/Toast';
import { CreditCard, ShieldAlert, BarChart3 } from 'lucide-react';

// Layout components
import { Navbar } from './components/layout/Navbar';
import { StudentSidebar } from './components/layout/StudentSidebar';
import { StudentBottomNav } from './components/layout/StudentBottomNav';
import { OwnerSidebar } from './components/layout/OwnerSidebar';
import { StaffSidebar } from './components/layout/StaffSidebar';
import { ManagerSidebar } from './components/layout/ManagerSidebar';
import { BottomNav } from './components/layout/BottomNav';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationsDrawer } from './components/layout/NotificationsDrawer';

// Student Views
import { StudentHomeView } from './components/student/StudentHomeView';
import { StudentRoomView } from './components/student/StudentRoomView';
import { StudentPaymentsView } from './components/student/StudentPaymentsView';
import { StudentFoodMenuView } from './components/student/StudentFoodMenuView';
import { StudentMealRatingsView } from './components/student/StudentMealRatingsView';
import { StudentComplaintsView } from './components/student/StudentComplaintsView';
import { StudentNoticesView } from './components/student/StudentNoticesView';
import { StudentRequestsView } from './components/student/StudentRequestsView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { StudentSettingsView } from './components/student/StudentSettingsView';
import { StudentPayModal } from './components/student/StudentPayModal';

// Operations Views (All restored from project disk)
import { BuildingsFloorsView } from './components/operations/BuildingsFloorsView';
import { BookingsView } from './components/operations/BookingsView';
import { DepositsView } from './components/operations/DepositsView';
import { InventoryView } from './components/operations/InventoryView';
import { HousekeepingView } from './components/operations/HousekeepingView';
import { OwnerSettingsView } from './components/operations/OwnerSettingsView';
import { StaffTasksView } from './components/operations/StaffTasksView';
import { StaffScheduleView } from './components/operations/StaffScheduleView';
import { StaffWorkHistoryView } from './components/operations/StaffWorkHistoryView';
import { CheckinsCheckoutsView } from './components/operations/CheckinsCheckoutsView';
import { RoomReadinessView } from './components/operations/RoomReadinessView';
import { InspectionsView } from './components/operations/InspectionsView';
import { DailyReportsView } from './components/operations/DailyReportsView';

// Staff & Operations Views
import { StaffPortal } from './components/dashboard/StaffPortal';
import { ManagerPortal } from './components/dashboard/ManagerPortal';

// Owner Views
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { PropertiesView } from './components/properties/PropertiesView';
import { AddPropertyModal } from './components/properties/AddPropertyModal';
import { RoomBedManagement } from './components/rooms/RoomBedManagement';
import { RoomDetailDrawer } from './components/rooms/RoomDetailDrawer';
import { StudentsView } from './components/students/StudentsView';
import { AdmissionWizardModal } from './components/students/AdmissionWizardModal';
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { CheckoutModal } from './components/students/CheckoutModal';
import { PaymentsView } from './components/payments/PaymentsView';
import { RecordPaymentModal } from './components/payments/RecordPaymentModal';
import { ReceiptModal } from './components/payments/ReceiptModal';
import { ComplaintsView } from './components/complaints/ComplaintsView';
import { CreateComplaintModal } from './components/complaints/CreateComplaintModal';
import { ComplaintModal } from './components/complaints/ComplaintModal';
import { FoodView } from './components/food/FoodView';
import { StaffView } from './components/staff/StaffView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { AIWeeklyReportModal } from './components/dashboard/AIWeeklyReportModal';
import { AuthModal } from './components/auth/AuthModal';

// Discovery Views
import { PublicDiscoveryHome } from './components/discovery/PublicDiscoveryHome';
import { PropertyDiscoveryProfileView } from './components/operations/PropertyDiscoveryProfileView';

import { Student, Room, Complaint, Payment, UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { 
    currentUserRole, 
    students, 
    complaints, 
    payments, 
    currentProperty, 
    platformMode, 
    setPlatformMode 
  } = useApp();

  // Navigation View State
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Interactive Food Tab State in Student Mode
  const [studentFoodTab, setStudentFoodTab] = useState<'menu' | 'ratings'>('menu');

  // Interactive Demo Modal State
  const [isDemoWalkthroughOpen, setIsDemoWalkthroughOpen] = useState(false);

  // Common Modals & Drawers State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);

  // Property & Room Modals
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Student Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  const [checkoutStudentTarget, setCheckoutStudentTarget] = useState<Student | null>(null);

  // Payment Modals
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [preSelectedPaymentStudent, setPreSelectedPaymentStudent] = useState<Student | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isStudentPayOpen, setIsStudentPayOpen] = useState(false);

  // Complaint Modals
  const [isCreateComplaintOpen, setIsCreateComplaintOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Role switching callback
  const handleRoleChanged = (newRole: UserRole, defaultView: string) => {
    setCurrentView(defaultView);
    setSelectedRoom(null);
    setSelectedStudent(null);
  };

  // Quick Action Handlers
  const handleSelectStudentById = (studentId: string) => {
    const std = students.find(s => s.id === studentId);
    if (std) {
      setSelectedStudent(std);
      setIsStudentDetailOpen(true);
    }
  };

  const handleSelectComplaintById = (complaintId: string) => {
    const c = complaints.find(item => item.id === complaintId);
    if (c) {
      setSelectedComplaint(c);
    }
  };

  const handleViewReceiptById = (paymentId: string) => {
    const p = payments.find(item => item.id === paymentId);
    if (p) {
      setSelectedPayment(p);
    }
  };

  const handleOpenRoomDetail = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleOpenRoomDetailByNumber = (roomNumber: string) => {
    for (const b of currentProperty.buildings) {
      for (const f of b.floors) {
        const found = f.rooms.find(r => r.roomNumber === roomNumber);
        if (found) {
          setSelectedRoom(found);
          return;
        }
      }
    }
  };

  const handleSelectRoomById = (roomId: string) => {
    for (const b of currentProperty.buildings) {
      for (const f of b.floors) {
        const found = f.rooms.find(r => r.id === roomId);
        if (found) {
          setSelectedRoom(found);
          return;
        }
      }
    }
  };

  const handleOpenRecordPaymentForStudent = (student: Student) => {
    setPreSelectedPaymentStudent(student);
    setIsRecordPaymentOpen(true);
  };

  const handleOpenCheckoutForStudent = (student: Student) => {
    setCheckoutStudentTarget(student);
  };

  const normalizedRole = currentUserRole.toLowerCase();
  const isStudent = normalizedRole === 'student';
  const isStaff = normalizedRole === 'staff' || normalizedRole === 'maintenance' || normalizedRole === 'cleaner' || normalizedRole === 'cook';
  const isManager = normalizedRole === 'manager';
  const isAccountant = normalizedRole === 'accountant';
  const isOwner = normalizedRole === 'owner' || (!isStudent && !isStaff && !isManager && !isAccountant);

  // If in Public Discovery mode, render PublicDiscoveryHome with full access
  if (platformMode === 'discovery') {
    return (
      <>
        <PublicDiscoveryHome onSwitchToManagement={() => setPlatformMode('management')} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased selection:bg-teal-600 selection:text-white">
      {/* 1. Unified Top Navbar with Brand, Role Switcher, Search, Notifications */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAddProperty={() => setIsAddPropertyOpen(true)}
        onOpenAIWeekly={() => setIsWeeklyReportOpen(true)}
        onRoleChanged={handleRoleChanged}
      />

      {/* 3. ROLE WORKSPACES */}

      {/* ROLE A: STUDENT APPLICATION ("My Stay") */}
      {isStudent && (
        <>
          <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
            <StudentSidebar
              currentView={currentView}
              onSelectView={setCurrentView}
            />

            <main className="flex-1 min-w-0">
              {(currentView === 'dashboard' || currentView === 'home') && (
                <StudentHomeView
                  onOpenCreateComplaint={() => setIsCreateComplaintOpen(true)}
                  onNavigate={setCurrentView}
                  onPayNow={() => setIsStudentPayOpen(true)}
                  onViewReceipt={handleViewReceiptById}
                />
              )}

              {currentView === 'my-room' && (
                <StudentRoomView
                  onOpenCreateComplaint={() => setIsCreateComplaintOpen(true)}
                  onNavigate={setCurrentView}
                />
              )}

              {currentView === 'payments' && (
                <StudentPaymentsView
                  onViewReceipt={handleViewReceiptById}
                  onPayNow={() => setIsStudentPayOpen(true)}
                />
              )}

              {currentView === 'complaints' && (
                <StudentComplaintsView
                  onOpenCreateComplaint={() => setIsCreateComplaintOpen(true)}
                />
              )}

              {currentView === 'requests' && (
                <StudentRequestsView />
              )}

              {currentView === 'food' && (
                <div className="space-y-6">
                  {/* Food Subtabs */}
                  <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-slate-200 w-fit shadow-2xs">
                    <button
                      onClick={() => setStudentFoodTab('menu')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        studentFoodTab === 'menu'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Weekly Food Timetable
                    </button>
                    <button
                      onClick={() => setStudentFoodTab('ratings')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        studentFoodTab === 'ratings'
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Rate Meals & Feedback
                    </button>
                  </div>

                  {studentFoodTab === 'menu' ? (
                    <StudentFoodMenuView />
                  ) : (
                    <StudentMealRatingsView />
                  )}
                </div>
              )}

              {currentView === 'announcements' && (
                <StudentNoticesView />
              )}

              {currentView === 'receipts' && (
                <StudentPaymentsView
                  onViewReceipt={handleViewReceiptById}
                  onPayNow={() => setIsStudentPayOpen(true)}
                />
              )}

              {currentView === 'profile' && (
                <StudentProfileView />
              )}

              {currentView === 'settings' && (
                <StudentSettingsView />
              )}
            </main>
          </div>

          <StudentBottomNav
            currentView={currentView}
            onSelectView={setCurrentView}
          />
        </>
      )}

      {/* ROLE B: STAFF APPLICATION ("Service & Maintenance Team") */}
      {isStaff && (
        <>
          <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
            <StaffSidebar
              currentView={currentView}
              onSelectView={setCurrentView}
            />

            <main className="flex-1 min-w-0">
              {currentView === 'dashboard' && (
                <StaffPortal
                  onSelectComplaint={handleSelectComplaintById}
                />
              )}

              {(currentView === 'assigned-tasks' || currentView === 'urgent-requests') && (
                <StaffTasksView />
              )}

              {currentView === 'maintenance-jobs' && (
                <ComplaintsView
                  onOpenCreateComplaint={() => setIsCreateComplaintOpen(true)}
                  onSelectComplaint={handleSelectComplaintById}
                  onSelectStudent={handleSelectStudentById}
                />
              )}

              {currentView === 'work-schedule' && (
                <StaffScheduleView />
              )}

              {currentView === 'inventory-used' && (
                <InventoryView />
              )}

              {currentView === 'work-history' && (
                <StaffWorkHistoryView />
              )}

              {currentView === 'notifications' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <h3 className="text-lg font-bold text-slate-800">Staff Notification Alerts</h3>
                  <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                    All emergency work orders and urgent ticket assignments appear in the notifications drawer.
                  </p>
                  <button
                    onClick={() => setIsNotificationsOpen(true)}
                    className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-all"
                  >
                    Open Notifications Drawer
                  </button>
                </div>
              )}

              {currentView === 'profile' && (
                <StudentProfileView />
              )}

              {currentView === 'settings' && (
                <StudentSettingsView />
              )}

              {currentView === 'public-discovery' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Explore Accommodations Across Bangalore</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Compare verified hostels, transparent livability rankings, and resident reviews.</p>
                    </div>
                    <button
                      onClick={() => setPlatformMode('discovery')}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Fullscreen Discovery Platform
                    </button>
                  </div>
                  <PublicDiscoveryHome onSwitchToManagement={() => setCurrentView('dashboard')} />
                </div>
              )}
            </main>
          </div>

          <BottomNav currentView={currentView} onSelectView={setCurrentView} />
        </>
      )}

      {/* ROLE C: MANAGER APPLICATION ("Campus Warden & Operations") */}
      {isManager && (
        <>
          <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
            <ManagerSidebar
              currentView={currentView}
              onSelectView={setCurrentView}
            />

            <main className="flex-1 min-w-0">
              {currentView === 'dashboard' && (
                <ManagerPortal
                  onNavigate={setCurrentView}
                  onSelectComplaint={handleSelectComplaintById}
                />
              )}

              {(currentView === 'residents' || currentView === 'students') && (
                <StudentsView
                  onOpenAddStudent={() => setIsAddStudentOpen(true)}
                  onSelectStudent={handleSelectStudentById}
                  onOpenRecordPayment={handleOpenRecordPaymentForStudent}
                  onOpenCheckout={handleOpenCheckoutForStudent}
                />
              )}

              {currentView === 'checkins-checkouts' && (
                <CheckinsCheckoutsView />
              )}

              {currentView === 'room-readiness' && (
                <RoomReadinessView />
              )}

              {(currentView === 'maintenance-queue' || currentView === 'complaints') && (
                <ComplaintsView
                  onOpenCreateComplaint={() => setIsCreateComplaintOpen(true)}
                  onSelectComplaint={handleSelectComplaintById}
                  onSelectStudent={handleSelectStudentById}
                />
              )}

              {currentView === 'housekeeping' && (
                <HousekeepingView />
              )}

              {currentView === 'inspections' && (
                <InspectionsView />
              )}

              {(currentView === 'food-operations' || currentView === 'food') && (
                <FoodView />
              )}

              {currentView === 'announcements' && (
                <StudentNoticesView />
              )}

              {currentView === 'daily-reports' && (
                <DailyReportsView />
              )}

              {currentView === 'energy' && (
                <AnalyticsView defaultTab="energy" />
              )}

              {currentView === 'settings' && (
                <OwnerSettingsView />
              )}

              {currentView === 'public-discovery' && (
                <PropertyDiscoveryProfileView />
              )}
            </main>
          </div>

          <BottomNav currentView={currentView} onSelectView={setCurrentView} />
        </>
      )}

      {/* ROLE D: OWNER / ADMIN APPLICATION ("Portfolio Command Center") */}
      {isOwner && (
        <>
          <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
            <OwnerSidebar
              currentView={currentView}
              onSelectView={setCurrentView}
            />

            <main className="flex-1 min-w-0">
              {currentView === 'dashboard' && (
                <OwnerDashboard
                  onNavigate={setCurrentView}
                  onOpenAddStudent={() => setIsAddStudentOpen(true)}
                  onOpenRecordPayment={() => {
                    setPreSelectedPaymentStudent(null);
                    setIsRecordPaymentOpen(true);
                  }}
                  onOpenCreateComplaint={() => setIsCreateComplaintOpen(true)}
                  onOpenWeeklyReport={() => setIsWeeklyReportOpen(true)}
                  onSelectStudent={handleSelectStudentById}
                  onSelectComplaint={handleSelectComplaintById}
                  onOpenRoomDetail={handleOpenRoomDetail}
                />
              )}

              {currentView === 'properties' && (
                <PropertiesView
                  onOpenAddProperty={() => setIsAddPropertyOpen(true)}
                  onManageRooms={() => setCurrentView('rooms')}
                />
              )}

              {currentView === 'buildings-floors' && (
                <BuildingsFloorsView />
              )}

              {currentView === 'rooms' && (
                <RoomBedManagement
                  onSelectRoom={handleOpenRoomDetail}
                  onOpenAddStudent={() => setIsAddStudentOpen(true)}
                />
              )}

              {(currentView === 'residents' || currentView === 'students') && (
                <StudentsView
                  onOpenAddStudent={() => setIsAddStudentOpen(true)}
                  onSelectStudent={handleSelectStudentById}
                  onOpenRecordPayment={handleOpenRecordPaymentForStudent}
                  onOpenCheckout={handleOpenCheckoutForStudent}
                />
              )}

              {currentView === 'bookings' && (
                <BookingsView />
              )}

              {(currentView === 'finance' || currentView === 'payments') && (
                <PaymentsView
                  onOpenRecordPayment={() => {
                    setPreSelectedPaymentStudent(null);
                    setIsRecordPaymentOpen(true);
                  }}
                  onViewReceipt={handleViewReceiptById}
                  onSelectStudent={handleSelectStudentById}
                />
              )}

              {currentView === 'deposits' && (
                <DepositsView />
              )}

              {currentView === 'food' && (
                <FoodView />
              )}

              {(currentView === 'maintenance-overview' || currentView === 'complaints') && (
                <ComplaintsView
                  onOpenCreateComplaint={() => setIsCreateComplaintOpen(true)}
                  onSelectComplaint={handleSelectComplaintById}
                  onSelectStudent={handleSelectStudentById}
                />
              )}

              {currentView === 'staff' && (
                <StaffView />
              )}

              {currentView === 'inventory' && (
                <InventoryView />
              )}

              {currentView === 'housekeeping' && (
                <HousekeepingView />
              )}

              {(currentView === 'reports' || currentView === 'analytics' || currentView === 'energy') && (
                <AnalyticsView defaultTab={currentView === 'energy' ? 'energy' : 'occupancy'} />
              )}

              {currentView === 'settings' && (
                <OwnerSettingsView />
              )}

              {(currentView === 'ai-copilot' || currentView === 'ai-assistant') && (
                <AIAssistantView />
              )}

              {currentView === 'public-discovery' && (
                <PropertyDiscoveryProfileView />
              )}
            </main>
          </div>

          <BottomNav currentView={currentView} onSelectView={setCurrentView} />
        </>
      )}

      {/* ROLE E: ACCOUNTANT / FINANCE APPLICATION ("Finance Center") */}
      {isAccountant && (
        <>
          <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
            <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 h-[calc(100vh-6rem)] sticky top-20 overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Accountant Desk</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Finance, Ledgers & Invoicing</p>
              </div>

              <nav className="flex-1 space-y-1">
                {[
                  { id: 'payments', label: 'Rent & Collections', icon: CreditCard },
                  { id: 'deposits', label: 'Security Deposits Escrow', icon: ShieldAlert },
                  { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id || (item.id === 'payments' && (currentView === 'dashboard' || currentView === 'finance'));
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-2.5 border-t border-slate-100 px-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Audited Ledger</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Reconciled" />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {(currentView === 'payments' || currentView === 'dashboard' || currentView === 'finance') && (
                <PaymentsView
                  onOpenRecordPayment={() => {
                    setPreSelectedPaymentStudent(null);
                    setIsRecordPaymentOpen(true);
                  }}
                  onViewReceipt={handleViewReceiptById}
                  onSelectStudent={handleSelectStudentById}
                />
              )}

              {currentView === 'deposits' && (
                <DepositsView />
              )}

              {(currentView === 'analytics' || currentView === 'reports') && (
                <AnalyticsView />
              )}
            </main>
          </div>

          <BottomNav currentView={currentView} onSelectView={setCurrentView} />
        </>
      )}

      {/* 4. SHARED MODALS & DRAWERS */}

      {/* 2-Minute Guided Flow */}
      <DemoWalkthroughModal
        isOpen={isDemoWalkthroughOpen}
        onClose={() => setIsDemoWalkthroughOpen(false)}
        onNavigate={setCurrentView}
        onOpenRoomDetailByNumber={handleOpenRoomDetailByNumber}
        onOpenCreateComplaint={() => setIsCreateComplaintOpen(true)}
      />

      {/* Student Pay Now Modal */}
      <StudentPayModal
        isOpen={isStudentPayOpen}
        onClose={() => setIsStudentPayOpen(false)}
        amount={8000}
        monthFor="October 2026"
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStudent={handleSelectStudentById}
        onSelectRoom={handleSelectRoomById}
        onSelectComplaint={handleSelectComplaintById}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* AI Weekly Executive Digest Modal */}
      <AIWeeklyReportModal
        isOpen={isWeeklyReportOpen}
        onClose={() => setIsWeeklyReportOpen(false)}
      />

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
      />

      {/* Room Detail Drawer */}
      <RoomDetailDrawer
        room={selectedRoom}
        isOpen={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onSelectStudent={handleSelectStudentById}
        onOpenCreateComplaintForRoom={() => setIsCreateComplaintOpen(true)}
      />

      {/* New Admission Student Wizard Modal */}
      <AdmissionWizardModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />

      {/* Student Profile / Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isStudentDetailOpen}
        onClose={() => {
          setIsStudentDetailOpen(false);
          setSelectedStudent(null);
        }}
        onOpenRecordPayment={handleOpenRecordPaymentForStudent}
        onOpenCheckout={handleOpenCheckoutForStudent}
        onViewReceipt={handleViewReceiptById}
      />

      {/* Student Checkout & Security Deposit Settlement Modal */}
      <CheckoutModal
        student={checkoutStudentTarget}
        isOpen={!!checkoutStudentTarget}
        onClose={() => setCheckoutStudentTarget(null)}
      />

      {/* Record Offline Fee Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => {
          setIsRecordPaymentOpen(false);
          setPreSelectedPaymentStudent(null);
        }}
        preSelectedStudent={preSelectedPaymentStudent}
      />

      {/* Digital Receipt Modal */}
      <ReceiptModal
        payment={selectedPayment}
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />

      {/* Raise Maintenance Ticket Modal */}
      <CreateComplaintModal
        isOpen={isCreateComplaintOpen}
        onClose={() => setIsCreateComplaintOpen(false)}
      />

      {/* Complaint Detail & Resolution Modal */}
      <ComplaintModal
        complaint={selectedComplaint}
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onSelectStudent={handleSelectStudentById}
      />

      {/* Role Switcher & Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
