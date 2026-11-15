import { Property, PropertyListingDetails, PropertyEnquiry } from '../types';

export const RANKING_METHODOLOGY = [
  {
    title: 'Verified Resident Feedback',
    weight: 35,
    description: 'Direct reviews submitted exclusively by students with verified admission agreements and active fee records in LIVORA. No anonymous or unverified reviews permitted.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Operational Resolution Speed',
    weight: 25,
    description: 'Real-time telemetry measuring ticket response, mean time to resolve (MTTR) plumbing, electrical, and AC complaints logged through the LIVORA staff app.',
    icon: 'Zap'
  },
  {
    title: 'Food Quality & Nutrition Consistency',
    weight: 20,
    description: 'Aggregated daily resident meal ratings on breakfast, lunch, and dinner, factoring in dietary variety, hygiene certifications, and mess uptime.',
    icon: 'Utensils'
  },
  {
    title: 'Facility Standards & Safety Compliance',
    weight: 20,
    description: 'Biometric gate entry uptime, 24x7 CCTV coverage, fire safety certificates, and periodic hygiene inspection audits logged by campus wardens.',
    icon: 'Award'
  }
];

export const INITIAL_ENQUIRIES: PropertyEnquiry[] = [
  {
    id: 'enq-101',
    propertyId: 'prop-1',
    propertyName: 'ABC Student Hostel',
    studentName: 'Vikrant Roy',
    phone: '+91 98450 99881',
    email: 'vikrant.roy@gmail.com',
    sharingPreference: 'Double',
    moveInDate: '2026-11-01',
    type: 'schedule_visit',
    notes: 'Looking for Room with attached washroom on 3rd or 4th floor. Studying at Christ University.',
    status: 'visit_scheduled',
    createdAt: '2026-10-18T14:30:00Z'
  },
  {
    id: 'enq-102',
    propertyId: 'prop-2',
    propertyName: 'XYZ Girls Luxury PG',
    studentName: 'Divya Sharma',
    phone: '+91 97412 33445',
    email: 'divya.s@outlook.com',
    sharingPreference: 'Single',
    moveInDate: '2026-10-28',
    type: 'reserve_bed',
    notes: 'Software engineer joining Flipkart in Bellandur. Interested in Single AC room.',
    status: 'pending',
    createdAt: '2026-10-19T09:15:00Z'
  },
  {
    id: 'enq-103',
    propertyId: 'prop-1',
    propertyName: 'ABC Student Hostel',
    studentName: 'Tanmay Kulkarni',
    phone: '+91 99011 22334',
    email: 'tanmay.k@gmail.com',
    sharingPreference: 'Double',
    moveInDate: '2026-11-05',
    type: 'schedule_visit',
    notes: 'Would like to taste mess lunch during hostel visit.',
    status: 'contacted',
    createdAt: '2026-10-19T08:00:00Z'
  }
];

export const DISCOVERY_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'ABC Student Hostel',
    code: 'ABC-BLR',
    type: 'Hostel',
    address: '124, 7th Cross, Koramangala 4th Block',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    managerName: 'Karthik Raman',
    managerPhone: '+91 98450 12345',
    amenities: [
      'High-speed Wi-Fi',
      '3-Time Mess',
      'Biometric Entry',
      '24x7 Power Backup',
      'Gym & Recreation',
      'Daily Housekeeping',
      'RO Water Dispenser',
      'Study Lounge',
      'CCTV Surveillance'
    ],
    totalRooms: 80,
    totalBeds: 160,
    occupiedBeds: 145,
    publicListing: true,
    listingDetails: {
      tagline: 'Premier Academic Corridor Hostel with 3-Time Chef Mess & High-Speed Fiber',
      description: 'Centrally located in Koramangala 4th Block, ABC Student Hostel offers spacious, well-ventilated single and double rooms. Equipped with 200 Mbps enterprise Wi-Fi, biometric turnstiles, 3-time nutritious mess, and a dedicated maintenance team delivering average ticket resolution under 1.8 hours.',
      photos: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80'
      ],
      gender: 'Boys',
      startingPrice: 7000,
      depositMonths: 2,
      noticePeriodDays: 30,
      curfewTime: '11:00 PM (Late pass via warden)',
      visitorPolicy: 'Common lounge access until 8:00 PM',
      livabilityScore: 96,
      cityRank: 1,
      localityRank: 1,
      localityName: 'Koramangala',
      totalReviewsCount: 42,
      avgRating: 4.8,
      avgComplaintResolutionHours: 1.8,
      foodRating: 4.6,
      cleanlinessScore: 95,
      verifiedStatus: 'verified',
      featuredBadge: '🏆 #1 City Top Ranked',
      nearestLandmark: 'Sony World Junction · 1.2 km to Christ University',
      distanceToCampusOrMetro: '1.2 km from Christ University Central Campus',
      coordinates: { lat: 12.9352, lng: 77.6245 },
      roomPricingSummary: {
        single: 14000,
        double: 8000,
        triple: 7000
      },
      verifiedReviews: [
        {
          id: 'rev-1',
          studentName: 'Aryan Sharma',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          rating: 5,
          date: '14 Oct 2026',
          roomType: 'Double Sharing (AC)',
          verifiedStayMonths: 8,
          comment: 'Genuine 200 Mbps fiber speed throughout exam weeks without drops. Warden resolves electrical or plumbing tickets usually within 90 minutes. Wednesday biryani night is top-tier.',
          foodRating: 4.8,
          cleanlinessRating: 4.9,
          maintenanceRating: 5.0,
          wifiRating: 5.0,
          helpfulCount: 28
        },
        {
          id: 'rev-2',
          studentName: 'Rahul Verma',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
          rating: 4.7,
          date: '02 Oct 2026',
          roomType: 'Double Sharing',
          verifiedStayMonths: 6,
          comment: 'Quiet study library on the 4th floor is a lifesaver. Biometric gate check ensures peace of mind. Very transparent billing with zero hidden electricity fees.',
          foodRating: 4.4,
          cleanlinessRating: 4.8,
          maintenanceRating: 4.7,
          wifiRating: 4.8,
          helpfulCount: 19
        }
      ]
    },
    buildings: []
  },
  {
    id: 'prop-2',
    name: 'XYZ Girls Luxury PG',
    code: 'XYZ-BLR',
    type: 'PG',
    address: '88, 17th Main, HSR Layout Sector 3',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560102',
    managerName: 'Pooja Hegde',
    managerPhone: '+91 99801 87654',
    amenities: [
      'High-speed Wi-Fi',
      'Homestyle Food',
      'CCTV Security',
      'Lift',
      'Laundry Service',
      'Terrace Lounge',
      'Biometric Entry',
      'Power Backup',
      'Daily Cleaning'
    ],
    totalRooms: 40,
    totalBeds: 80,
    occupiedBeds: 72,
    publicListing: true,
    listingDetails: {
      tagline: 'Boutique Secure Living for Women with Homestyle Cuisine & Biometric Access',
      description: 'Nestled in peaceful HSR Layout Sector 3, XYZ Girls Luxury PG offers boutique accommodations with modern aesthetic furnishings, 24x7 security guard, biometric access, fresh homestyle South & North Indian meals, and dedicated laundry facilities.',
      photos: [
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80'
      ],
      gender: 'Girls',
      startingPrice: 9500,
      depositMonths: 2,
      noticePeriodDays: 30,
      curfewTime: '10:30 PM (Biometric logging with emergency warden notification)',
      visitorPolicy: 'Female guests only; common lounge for parents until 7:30 PM',
      livabilityScore: 94,
      cityRank: 2,
      localityRank: 1,
      localityName: 'HSR Layout',
      totalReviewsCount: 36,
      avgRating: 4.9,
      avgComplaintResolutionHours: 2.1,
      foodRating: 4.9,
      cleanlinessScore: 98,
      verifiedStatus: 'verified',
      featuredBadge: '🌟 Verified Excellence',
      nearestLandmark: 'Near BDA Complex HSR · 800m to NIFT Campus',
      distanceToCampusOrMetro: '800 meters from NIFT Bangalore campus',
      coordinates: { lat: 12.9121, lng: 77.6446 },
      roomPricingSummary: {
        single: 16500,
        double: 9500
      },
      verifiedReviews: [
        {
          id: 'rev-3',
          studentName: 'Priya Patel',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
          rating: 5,
          date: '08 Oct 2026',
          roomType: 'Single AC',
          verifiedStayMonths: 11,
          comment: 'The cleanliness here is unmatched. Rooms are mopped twice daily and washrooms are spotless. The aunties cooking homestyle chapatis and dal make it feel like home.',
          foodRating: 5.0,
          cleanlinessRating: 5.0,
          maintenanceRating: 4.8,
          wifiRating: 4.7,
          helpfulCount: 34
        },
        {
          id: 'rev-4',
          studentName: 'Ananya Iyer',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          rating: 4.8,
          date: '18 Sep 2026',
          roomType: 'Double Sharing',
          verifiedStayMonths: 4,
          comment: 'Very safe location, nice terrace for yoga in the morning. Fast response on repairs whenever requested on LIVORA app.',
          foodRating: 4.7,
          cleanlinessRating: 4.9,
          maintenanceRating: 4.8,
          wifiRating: 4.8,
          helpfulCount: 15
        }
      ]
    },
    buildings: []
  },
  {
    id: 'prop-3',
    name: 'Student Living Whitefield',
    code: 'SLW-BLR',
    type: 'Co-Living',
    address: 'Plot 45, EPIP Zone, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    managerName: 'Abhishek Roy',
    managerPhone: '+91 97110 54321',
    amenities: [
      'Coworking Hub',
      'High-speed Wi-Fi',
      'Cafeteria',
      'Gaming Zone',
      '24x7 Security',
      'Power Backup',
      'Gym & Fitness',
      'Biometric Entry',
      'Laundry'
    ],
    totalRooms: 50,
    totalBeds: 100,
    occupiedBeds: 88,
    publicListing: true,
    listingDetails: {
      tagline: 'Modern Tech Hub Co-Living with Ergonomic Workstations & High-Speed Transit',
      description: 'Purpose-built for engineering graduates, interns, and postgraduate scholars working in Whitefield & EPIP tech corridors. Features ergonomic standing desks, dedicated 500 Mbps lease line, fitness center, cafeteria with flexible meal plans, and community weekend events.',
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80'
      ],
      gender: 'Co-ed',
      startingPrice: 11000,
      depositMonths: 2,
      noticePeriodDays: 45,
      curfewTime: '24x7 Access via Biometric Keycard',
      visitorPolicy: 'Visitors permitted in coworking and cafeteria lounges till 10:00 PM',
      livabilityScore: 91,
      cityRank: 3,
      localityRank: 1,
      localityName: 'Whitefield',
      totalReviewsCount: 29,
      avgRating: 4.6,
      avgComplaintResolutionHours: 2.8,
      foodRating: 4.3,
      cleanlinessScore: 92,
      verifiedStatus: 'verified',
      featuredBadge: '⚡ Rapid Resolution',
      nearestLandmark: 'Adjacent to ITPL & Sri Sathya Sai Hospital',
      distanceToCampusOrMetro: '400m from Kadugodi Metro Station',
      coordinates: { lat: 12.9698, lng: 77.7499 },
      roomPricingSummary: {
        single: 16000,
        double: 11000
      },
      verifiedReviews: [
        {
          id: 'rev-5',
          studentName: 'Kunal Deshmukh',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
          rating: 4.6,
          date: '25 Sep 2026',
          roomType: 'Single Studio',
          verifiedStayMonths: 9,
          comment: 'The coworking space downstairs saved me so much time. Metro station is 5 minutes walk. Staff is professional and app-driven.',
          foodRating: 4.2,
          cleanlinessRating: 4.6,
          maintenanceRating: 4.8,
          wifiRating: 5.0,
          helpfulCount: 22
        }
      ]
    },
    buildings: []
  },
  {
    id: 'prop-4',
    name: 'Stanza Green Villa PG',
    code: 'SGV-BLR',
    type: 'PG',
    address: '42, 100 Feet Road, HAL 2nd Stage, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    managerName: 'Sunil Rao',
    managerPhone: '+91 98441 55667',
    amenities: [
      'High-speed Wi-Fi',
      'Breakfast & Dinner',
      'AC Rooms',
      'Terrace Rooftop Cafe',
      'Daily Housekeeping',
      'Biometric Entry',
      'CCTV Surveillance'
    ],
    totalRooms: 35,
    totalBeds: 70,
    occupiedBeds: 64,
    publicListing: true,
    listingDetails: {
      tagline: 'Urban Co-Living with Rooftop Cafe, Weekly Housekeeping & Metro Proximity',
      description: 'Right on Indiranagar 100 Feet Road within walking distance of Indiranagar Metro Station. Designed with designer aesthetics, sound-insulated double-glazed windows, private balconies, and high-speed Wi-Fi throughout.',
      photos: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80'
      ],
      gender: 'Co-ed',
      startingPrice: 13500,
      depositMonths: 2,
      noticePeriodDays: 30,
      curfewTime: '11:30 PM',
      visitorPolicy: 'Common lounge access until 8:30 PM',
      livabilityScore: 89,
      cityRank: 4,
      localityRank: 1,
      localityName: 'Indiranagar',
      totalReviewsCount: 24,
      avgRating: 4.5,
      avgComplaintResolutionHours: 3.2,
      foodRating: 4.5,
      cleanlinessScore: 90,
      verifiedStatus: 'verified',
      featuredBadge: '☕ Rooftop Co-Living',
      nearestLandmark: 'Opposite Toit Brewpub · 600m to Metro Station',
      distanceToCampusOrMetro: '600m from Indiranagar Metro',
      coordinates: { lat: 12.9784, lng: 77.6408 },
      roomPricingSummary: {
        single: 19000,
        double: 13500
      },
      verifiedReviews: [
        {
          id: 'rev-6',
          studentName: 'Meera Nambiar',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
          rating: 4.5,
          date: '04 Oct 2026',
          roomType: 'Double Sharing AC',
          verifiedStayMonths: 7,
          comment: 'Best location in Bangalore. Safe night walks, close to cafes and metro. Food is fresh and healthy with weekend special menus.',
          foodRating: 4.6,
          cleanlinessRating: 4.5,
          maintenanceRating: 4.4,
          wifiRating: 4.7,
          helpfulCount: 14
        }
      ]
    },
    buildings: []
  },
  {
    id: 'prop-5',
    name: 'Oxford Scholar Boys Hostel',
    code: 'OSB-BLR',
    type: 'Hostel',
    address: '67, 16th Main, BTM 2nd Stage',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560076',
    managerName: 'Manoj Hegde',
    managerPhone: '+91 99160 44332',
    amenities: [
      '3-Time Mess',
      'Wi-Fi',
      'RO Drinking Water',
      'Hot Water 24x7',
      'Study Room',
      'CCTV'
    ],
    totalRooms: 45,
    totalBeds: 110,
    occupiedBeds: 96,
    publicListing: true,
    listingDetails: {
      tagline: 'High-Value Academic Accommodation near Coaching Hubs & Silk Board',
      description: 'Ideal for competitive exam aspirants, engineering and management students. Features quiet library spaces, strictly enforced silent study hours, nutritious home-style meals, and convenient connectivity to Silk Board and Tavarekere.',
      photos: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80'
      ],
      gender: 'Boys',
      startingPrice: 6500,
      depositMonths: 1,
      noticePeriodDays: 30,
      curfewTime: '10:30 PM',
      visitorPolicy: 'Parents allowed in reception area only',
      livabilityScore: 87,
      cityRank: 5,
      localityRank: 1,
      localityName: 'BTM Layout',
      totalReviewsCount: 31,
      avgRating: 4.4,
      avgComplaintResolutionHours: 2.9,
      foodRating: 4.3,
      cleanlinessScore: 86,
      verifiedStatus: 'verified',
      featuredBadge: '📚 Study Focused',
      nearestLandmark: 'Near Udupi Garden Signal · 1.5 km to Silk Board',
      distanceToCampusOrMetro: '1.5 km from Silk Board Metro Interchange',
      coordinates: { lat: 12.9166, lng: 77.6101 },
      roomPricingSummary: {
        single: 11000,
        double: 7500,
        triple: 6500
      },
      verifiedReviews: [
        {
          id: 'rev-7',
          studentName: 'Shubham Joshi',
          avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
          rating: 4.4,
          date: '10 Oct 2026',
          roomType: 'Triple Sharing',
          verifiedStayMonths: 10,
          comment: 'Very affordable and fair management. They do not charge unnecessary penalties. Silent study room on 2nd floor is great for GRE/GATE preparation.',
          foodRating: 4.2,
          cleanlinessRating: 4.3,
          maintenanceRating: 4.5,
          wifiRating: 4.3,
          helpfulCount: 16
        }
      ]
    },
    buildings: []
  },
  {
    id: 'prop-6',
    name: 'Silicon Heights PG & Residency',
    code: 'SHP-BLR',
    type: 'PG',
    address: '23, Neeladri Road, Electronic City Phase 1',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    managerName: 'Sanjay Nair',
    managerPhone: '+91 98455 77889',
    amenities: [
      'High-speed Wi-Fi',
      '3-Time Food',
      '24x7 Power Backup',
      'Biometric Access',
      'CCTV',
      'Gym',
      'Solar Hot Water'
    ],
    totalRooms: 60,
    totalBeds: 120,
    occupiedBeds: 105,
    publicListing: true,
    listingDetails: {
      tagline: 'Quiet Tech Park Accommodation with Heavy Duty Power Backup & Gym',
      description: 'Prime PG accommodation on Neeladri Road, walking distance to Wipro and Infosys gates. Designed with 100% full load generator backup, spacious wardrobes, attached washrooms, and hygienic dining hall.',
      photos: [
        'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80'
      ],
      gender: 'Co-ed',
      startingPrice: 8000,
      depositMonths: 2,
      noticePeriodDays: 30,
      curfewTime: '11:00 PM',
      visitorPolicy: 'Common lobby access only',
      livabilityScore: 85,
      cityRank: 6,
      localityRank: 1,
      localityName: 'Electronic City',
      totalReviewsCount: 18,
      avgRating: 4.3,
      avgComplaintResolutionHours: 3.5,
      foodRating: 4.1,
      cleanlinessScore: 88,
      verifiedStatus: 'verified',
      featuredBadge: '🔋 100% Power Backup',
      nearestLandmark: 'Neeladri Amusement Park · 800m to Infosys Gate 1',
      distanceToCampusOrMetro: '1.2 km from Electronic City Phase 1 Metro',
      coordinates: { lat: 12.8399, lng: 77.6770 },
      roomPricingSummary: {
        single: 13500,
        double: 9000,
        triple: 8000
      },
      verifiedReviews: [
        {
          id: 'rev-8',
          studentName: 'Nitin Pandey',
          avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
          rating: 4.3,
          date: '01 Oct 2026',
          roomType: 'Double Sharing',
          verifiedStayMonths: 5,
          comment: 'Power backup is uninterrupted during storm blackouts. Food is decent, staff is cordial.',
          foodRating: 4.0,
          cleanlinessRating: 4.4,
          maintenanceRating: 4.3,
          wifiRating: 4.5,
          helpfulCount: 9
        }
      ]
    },
    buildings: []
  },
  {
    id: 'prop-7',
    name: 'Grand Elite Residency',
    code: 'GER-BLR',
    type: 'Hostel',
    address: 'Plot 18, Outer Ring Road, Bellandur',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560103',
    managerName: 'Vikas Reddy',
    managerPhone: '+91 98860 11223',
    amenities: [
      'Wi-Fi',
      'Food Mess',
      'Security Guard',
      'Lift'
    ],
    totalRooms: 30,
    totalBeds: 60,
    occupiedBeds: 12,
    publicListing: true,
    listingDetails: {
      tagline: 'Recently Registered Hostel — Physical Hygiene & Safety Audit In Progress',
      description: 'Brand new facility currently undergoing LIVORA verified physical campus and food mess inspection. Rankings and full scores unlock once initial 15 resident verified stay reviews are accumulated.',
      photos: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&auto=format&fit=crop&q=80'
      ],
      gender: 'Co-ed',
      startingPrice: 8500,
      depositMonths: 2,
      noticePeriodDays: 30,
      curfewTime: '10:30 PM',
      visitorPolicy: 'Visitor reception only',
      livabilityScore: 72,
      cityRank: 7,
      localityRank: 2,
      localityName: 'Bellandur',
      totalReviewsCount: 3,
      avgRating: 3.9,
      avgComplaintResolutionHours: 5.1,
      foodRating: 3.8,
      cleanlinessScore: 75,
      verifiedStatus: 'pending_audit',
      featuredBadge: '⏳ Audit Underway',
      nearestLandmark: 'EcoSpace Tech Park (500m)',
      distanceToCampusOrMetro: '500m to Bellandur EcoSpace',
      coordinates: { lat: 12.9260, lng: 77.6762 },
      roomPricingSummary: {
        single: 14000,
        double: 9500,
        triple: 8500
      },
      verifiedReviews: [
        {
          id: 'rev-9',
          studentName: 'Harish Rao',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          rating: 4.0,
          date: '16 Oct 2026',
          roomType: 'Double Sharing',
          verifiedStayMonths: 1,
          comment: 'New building, rooms are fresh. Wi-Fi setup was recently upgraded.',
          foodRating: 3.9,
          cleanlinessRating: 4.0,
          maintenanceRating: 3.8,
          wifiRating: 4.2,
          helpfulCount: 4
        }
      ]
    },
    buildings: []
  }
];

export const BANGALORE_LOCALITIES = [
  'All Localities',
  'Koramangala',
  'HSR Layout',
  'Whitefield',
  'Indiranagar',
  'BTM Layout',
  'Electronic City',
  'Bellandur'
];
