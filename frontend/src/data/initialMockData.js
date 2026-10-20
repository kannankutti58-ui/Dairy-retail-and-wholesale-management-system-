export const MILK_PRODUCTS = [
  {
    id: 'aavin-blue',
    brand: 'Aavin',
    name: 'Aavin Nice (Blue)',
    tamilName: 'ஆவின் நைஸ் (நீலம்)',
    packetColor: 'blue',
    badgeColor: 'bg-blue-600',
    borderColor: 'border-blue-500',
    fatContent: '3.0% Fat (Low Fat / Light)',
    snf: '8.5% SNF',
    bestFor: 'Infants, babies, elderly, and people who prefer light milk',
    mrp: 22,
    wholesalePrice: 20, // ₹2 discount
    unit: '500 ml packet',
    cratesCapacity: 24, // 24 packets per crate (12 Litres)
    currentStock: 48,
    reservedForBooklet: 28,
    reservedForDelivery: 14,
    image: '🔵'
  },
  {
    id: 'aavin-purple',
    brand: 'Aavin',
    name: 'Aavin Delight (Purple)',
    tamilName: 'ஆவின் டிலைட் (ஊதா)',
    packetColor: 'purple',
    badgeColor: 'bg-purple-600',
    borderColor: 'border-purple-500',
    fatContent: '3.5% Fat (Medium Fat / Standard)',
    snf: '8.5% SNF',
    bestFor: 'Daily family usage, general tea/coffee, household cooking',
    mrp: 24,
    wholesalePrice: 22, // ₹2 discount
    unit: '500 ml packet',
    cratesCapacity: 24,
    currentStock: 72,
    reservedForBooklet: 40,
    reservedForDelivery: 20,
    image: '🟣'
  },
  {
    id: 'aavin-orange',
    brand: 'Aavin',
    name: 'Aavin Full Cream (Orange / Thick)',
    tamilName: 'ஆவின் திக் மில்க் (ஆரஞ்சு)',
    packetColor: 'orange',
    badgeColor: 'bg-orange-600',
    borderColor: 'border-orange-500',
    fatContent: '4.5% - 6.0% Fat (High Fat / Thick Cream)',
    snf: '9.0% SNF',
    bestFor: 'Tea shops, Juice stalls, Hotels, Catering & Rich Sweet preparation',
    mrp: 30,
    wholesalePrice: 28, // ₹2 discount
    unit: '500 ml packet',
    cratesCapacity: 24,
    currentStock: 120,
    reservedForBooklet: 30,
    reservedForDelivery: 50,
    image: '🟠'
  },
  {
    id: 'heritage-daily',
    brand: 'Heritage',
    name: 'Heritage Daily Health Milk',
    tamilName: 'ஹெரிட்டேஜ் பால்',
    packetColor: 'emerald',
    badgeColor: 'bg-emerald-600',
    borderColor: 'border-emerald-500',
    fatContent: '3.5% Fat',
    snf: '8.5% SNF',
    bestFor: 'Alternative brand demand for loyal Heritage consumers',
    mrp: 26,
    wholesalePrice: 24,
    unit: '500 ml packet',
    cratesCapacity: 24,
    currentStock: 24,
    reservedForBooklet: 0,
    reservedForDelivery: 6,
    image: '🥛'
  }
];

export const CURD_PRODUCTS = [
  {
    id: 'aavin-curd-pouch',
    name: 'Aavin Standard Curd Pouch',
    tamilName: 'ஆவின் தயிர் பாக்கெட்',
    category: 'curd',
    brand: 'Aavin',
    unit: '500 ml pouch',
    mrp: 35,
    wholesalePrice: 33,
    currentStock: 30,
    type: 'factory-packed'
  },
  {
    id: 'homemade-fresh-curd',
    name: 'Shop Special Homemade Fresh Curd',
    tamilName: 'வீட்டு முறையில் தயாரித்த புத்தம் புதிய கெட்டி தயிர்',
    category: 'curd',
    brand: 'Homemade (Zero Waste)',
    unit: '500 g container / loose',
    mrp: 30,
    wholesalePrice: 28,
    currentStock: 18,
    type: 'homemade-from-leftover',
    description: 'Freshly cultured every evening from premium unsold Aavin milk. Zero preservatives, thick and naturally sweet.'
  },
  {
    id: 'aavin-curd-cup',
    name: 'Aavin Cup Curd',
    tamilName: 'ஆவின் கப் தயிர்',
    category: 'curd',
    brand: 'Aavin',
    unit: '200 g cup',
    mrp: 15,
    wholesalePrice: 13,
    currentStock: 25,
    type: 'factory-packed'
  }
];

export const DAIRY_PRODUCTS = [
  {
    id: 'aavin-ghee-100',
    name: 'Aavin Pure Cow Ghee (100ml)',
    tamilName: 'ஆவின் நெய் 100ml',
    category: 'ghee',
    mrp: 75,
    unit: '100 ml pouch',
    stock: 25,
    badge: 'Popular',
    icon: '🧈'
  },
  {
    id: 'aavin-ghee-500',
    name: 'Aavin Pure Cow Ghee (500ml)',
    tamilName: 'ஆவின் நெய் 500ml',
    category: 'ghee',
    mrp: 360,
    unit: '500 ml Jar',
    stock: 16,
    badge: 'Best Seller',
    icon: '🧈'
  },
  {
    id: 'aavin-ghee-1000',
    name: 'Aavin Pure Cow Ghee (1 Litre)',
    tamilName: 'ஆவின் நெய் 1 லிட்டர்',
    category: 'ghee',
    mrp: 700,
    unit: '1 Litre Jar',
    stock: 8,
    badge: 'Premium',
    icon: '🧈'
  },
  {
    id: 'aavin-paneer-200',
    name: 'Aavin Fresh Paneer',
    tamilName: 'ஆவின் பன்னீர்',
    category: 'paneer',
    mrp: 100,
    unit: '200 g pack',
    stock: 14,
    badge: 'High Protein',
    icon: '🧀'
  },
  {
    id: 'aavin-butter-salted-100',
    name: 'Aavin Salted Table Butter',
    tamilName: 'ஆவின் வெண்ணெய்',
    category: 'butter',
    mrp: 58,
    unit: '100 g block',
    stock: 20,
    badge: '',
    icon: '🧈'
  },
  {
    id: 'aavin-butter-cooking-500',
    name: 'Aavin Cooking White Butter',
    tamilName: 'ஆவின் சமையல் வெண்ணெய்',
    category: 'butter',
    mrp: 260,
    unit: '500 g pack',
    stock: 6,
    badge: 'Traditional',
    icon: '🧈'
  },
  {
    id: 'aavin-shake-choco',
    name: 'Aavin Chocolate Milkshake',
    tamilName: 'ஆவின் சாக்லேட் மில்க்ஷேக்',
    category: 'beverage',
    mrp: 35,
    unit: '200 ml Tetra/Bottle',
    stock: 30,
    badge: 'Kids Favorite',
    icon: '🥤'
  },
  {
    id: 'aavin-badam-drink',
    name: 'Aavin Badam Flavored Milk',
    tamilName: 'ஆவின் பாதாம் பால்',
    category: 'beverage',
    mrp: 35,
    unit: '200 ml Bottle',
    stock: 35,
    badge: 'Chilled',
    icon: '🥤'
  },
  {
    id: 'aavin-badam-mix-powder',
    name: 'Aavin Badam Drink Mix Powder',
    tamilName: 'ஆவின் பாதாம் மிக்ஸ் பவுடர்',
    category: 'powder',
    mrp: 110,
    unit: '200 g tin',
    stock: 12,
    badge: '',
    icon: '🌾'
  },
  {
    id: 'aavin-skimmed-milk-powder',
    name: 'Aavin Skimmed Milk Powder (SMP)',
    tamilName: 'ஆவின் பால் பவுடர்',
    category: 'powder',
    mrp: 220,
    unit: '500 g pouch',
    stock: 10,
    badge: 'Bulk Pack',
    icon: '🥛'
  },
  {
    id: 'aavin-cookies-butter',
    name: 'Aavin Rich Butter Biscuits',
    tamilName: 'ஆவின் வெண்ணெய் பிஸ்கட்',
    category: 'biscuits',
    mrp: 30,
    unit: '150 g pack',
    stock: 40,
    badge: 'Snack',
    icon: '🍪'
  }
];

export const FESTIVAL_SWEETS = [
  {
    id: 'aavin-sweet-gulabjamun',
    name: 'Aavin Special Gulab Jamun',
    tamilName: 'ஆவின் குலாப் ஜாமூன்',
    mrp: 95,
    unit: '250 g tin',
    stock: 18,
    festivalSpecial: true,
    fastSelling: true,
    tag: 'Diwali & Pongal Hit'
  },
  {
    id: 'aavin-sweet-mysorepak',
    name: 'Aavin Pure Ghee Mysore Pak',
    tamilName: 'ஆவின் நெய் மைசூர் பாக்',
    mrp: 130,
    unit: '250 g box',
    stock: 12,
    festivalSpecial: true,
    fastSelling: true,
    tag: 'Melt-in-mouth'
  },
  {
    id: 'aavin-sweet-peda',
    name: 'Aavin Special Milk Peda',
    tamilName: 'ஆவின் பால்கோவா / பேடா',
    mrp: 125,
    unit: '250 g box',
    stock: 15,
    festivalSpecial: true,
    fastSelling: true,
    tag: 'Pure Mawa'
  },
  {
    id: 'aavin-sweet-rasgulla',
    name: 'Aavin Bengali Rasgulla Tin',
    tamilName: 'ஆவின் ரசகுல்லா',
    mrp: 310,
    unit: '1 kg Tin',
    stock: 6,
    festivalSpecial: true,
    fastSelling: false,
    tag: 'Festival Pack'
  }
];

export const WHOLESALE_CLIENTS = [
  {
    id: 'ws-1',
    businessName: 'Murugan Tea Stall & Snacks',
    ownerName: 'M. Murugesan',
    phone: '98421 55678',
    address: 'Bazaar Main Road, Near Bus Stand',
    preferredMilk: 'aavin-orange',
    dailyQuotaPackets: 24, // 1 crate daily
    rateType: 'wholesale', // ₹2 less
    pendingBalance: 1120,
    creditLimit: 5000,
    lastPaymentDate: '2026-08-22'
  },
  {
    id: 'ws-2',
    businessName: 'Sri Krishna Bakery & Coffee',
    ownerName: 'K. Balaji',
    phone: '94432 99812',
    address: 'South Car Street Junction',
    preferredMilk: 'aavin-orange',
    dailyQuotaPackets: 36, // 1.5 crates
    rateType: 'wholesale',
    pendingBalance: 0,
    creditLimit: 7000,
    lastPaymentDate: '2026-08-24'
  },
  {
    id: 'ws-3',
    businessName: 'Anand Fresh Juice Corner',
    ownerName: 'A. Anand',
    phone: '97890 12345',
    address: 'Opp. Taluk Office',
    preferredMilk: 'aavin-orange',
    dailyQuotaPackets: 16,
    rateType: 'wholesale',
    pendingBalance: 448,
    creditLimit: 3000,
    lastPaymentDate: '2026-08-23'
  },
  {
    id: 'ws-4',
    businessName: 'Kannan Maligai & Grocery Store',
    ownerName: 'S. Kannan',
    phone: '99441 87654',
    address: 'West Mada Street',
    preferredMilk: 'aavin-purple',
    dailyQuotaPackets: 20,
    rateType: 'wholesale',
    pendingBalance: 880,
    creditLimit: 4000,
    lastPaymentDate: '2026-08-21'
  }
];

export const MONTHLY_BOOKLET_CUSTOMERS = [
  {
    id: 'card-101',
    cardNumber: 'AVN-2026-101',
    customerName: 'S. Ramanathan',
    phone: '98421 11001',
    address: 'Door 14, Agraharam Street',
    subscribedMilk: 'aavin-purple', // Delight
    packetQuantity: 2, // 2 packets daily (1 Litre)
    monthlyPaidAmount: 1440,
    month: 'August 2026',
    startDate: '2026-08-01',
    validTill: '2026-08-31',
    punchedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
    todayCollected: true,
    totalDaysInMonth: 31
  },
  {
    id: 'card-102',
    cardNumber: 'AVN-2026-102',
    customerName: 'K. Meenakshi Ammal',
    phone: '94432 22002',
    address: 'Plot 7B, Anna Nagar 2nd Cross',
    subscribedMilk: 'aavin-blue', // Nice (low fat)
    packetQuantity: 1, // 1 packet daily (0.5 Litre)
    monthlyPaidAmount: 682,
    month: 'August 2026',
    startDate: '2026-08-01',
    validTill: '2026-08-31',
    punchedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    todayCollected: false,
    totalDaysInMonth: 31
  },
  {
    id: 'card-103',
    cardNumber: 'AVN-2026-103',
    customerName: 'P. Ganesan (Advocate)',
    phone: '97890 33003',
    address: 'Court Road, Officers Colony',
    subscribedMilk: 'aavin-orange', // Full Cream
    packetQuantity: 2, // 2 packets daily (1 Litre)
    monthlyPaidAmount: 1860,
    month: 'August 2026',
    startDate: '2026-08-01',
    validTill: '2026-08-31',
    punchedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
    todayCollected: true,
    totalDaysInMonth: 31
  },
  {
    id: 'card-104',
    cardNumber: 'AVN-2026-104',
    customerName: 'Dr. Senthil Kumar',
    phone: '99441 44004',
    address: 'Near Hospital Main Gate',
    subscribedMilk: 'aavin-purple',
    packetQuantity: 3, // 1.5 Litres
    monthlyPaidAmount: 2232,
    month: 'August 2026',
    startDate: '2026-08-01',
    validTill: '2026-08-31',
    punchedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    todayCollected: false,
    totalDaysInMonth: 31
  },
  {
    id: 'card-105',
    cardNumber: 'AVN-2026-105',
    customerName: 'V. Lakshmi',
    phone: '98433 55005',
    address: '18/2 Pillayar Kovil Street',
    subscribedMilk: 'aavin-blue',
    packetQuantity: 2,
    monthlyPaidAmount: 1364,
    month: 'August 2026',
    startDate: '2026-08-01',
    validTill: '2026-08-31',
    punchedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
    todayCollected: true,
    totalDaysInMonth: 31
  }
];

export const HOME_DELIVERY_ROUTES = [
  {
    routeId: 'route-north',
    routeName: 'Route 1: Temple Street & North Car Street',
    deliveryBoy: 'S. Selvam (Morning 5:15 AM - 6:30 AM)',
    phone: '96551 23411',
    houses: [
      { id: 'h-101', houseNo: '4/12', name: 'Sundaram Iyer', milkType: 'aavin-purple', qty: 2, plan: 'monthly', status: 'delivered', notes: 'Leave in porch milk bag' },
      { id: 'h-102', houseNo: '7/18', name: 'N. Radhakrishnan', milkType: 'aavin-blue', qty: 1, plan: 'daily_cash', status: 'delivered', notes: 'Daily cash ₹22 collected' },
      { id: 'h-103', houseNo: '12/1', name: 'Mrs. Valliammai', milkType: 'aavin-orange', qty: 2, plan: 'monthly', status: 'delivered', notes: 'Door bell once' },
      { id: 'h-104', houseNo: '19', name: 'Govindaraj', milkType: 'aavin-purple', qty: 1, plan: 'daily_cash', status: 'pending', notes: 'Pending collection' }
    ]
  },
  {
    routeId: 'route-south',
    routeName: 'Route 2: Anna Nagar & Staff Quarters',
    deliveryBoy: 'K. Manikandan (Morning 5:30 AM - 6:45 AM)',
    phone: '97882 77123',
    houses: [
      { id: 'h-201', houseNo: 'B-14', name: 'Prof. Jayachandran', milkType: 'aavin-blue', qty: 2, plan: 'monthly', status: 'delivered', notes: 'Ring bell' },
      { id: 'h-202', houseNo: 'C-08', name: 'K. Saravanan', milkType: 'aavin-orange', qty: 3, plan: 'monthly', status: 'delivered', notes: 'Needs extra curd on Sundays' },
      { id: 'h-203', houseNo: 'D-22', name: 'M. Karthik', milkType: 'aavin-purple', qty: 1, plan: 'daily_cash', status: 'pending', notes: 'Pay via GPay' }
    ]
  }
];

export const EVENT_BULK_ORDERS = [
  {
    id: 'evt-501',
    eventName: 'St. Joseph School Morning Nutrition Supply',
    contactPerson: 'Sister Superior Mary',
    phone: '94421 88776',
    date: '2026-08-25 (Tomorrow)',
    eventTime: '06:00 AM Delivery',
    items: [
      { type: 'aavin-purple', name: 'Aavin Delight (Purple)', qtyPackets: 80, liters: 40, unitRate: 22, total: 1760 }
    ],
    status: 'Confirmed & Included in Advance Order',
    advanceReceived: 1000,
    balanceDue: 760
  },
  {
    id: 'evt-502',
    eventName: 'Raja & Priya Wedding Reception (Vasantha Mahal)',
    contactPerson: 'R. Soundararajan (Father)',
    phone: '98433 99110',
    date: '2026-08-26',
    eventTime: '04:30 AM Early Delivery',
    items: [
      { type: 'aavin-orange', name: 'Aavin Full Cream (Orange)', qtyPackets: 240, liters: 120, unitRate: 28, total: 6720 },
      { type: 'homemade-fresh-curd', name: 'Fresh Homemade Curd', qtyPackets: 40, liters: 20, unitRate: 28, total: 1120 },
      { type: 'aavin-ghee-1000', name: 'Aavin Pure Ghee (1L)', qtyPackets: 10, liters: 10, unitRate: 680, total: 6800 }
    ],
    status: 'Deposit Paid (Advance ₹5000)',
    advanceReceived: 5000,
    balanceDue: 9640
  }
];

export const SUPPLY_CHAIN_INFO = {
  headDairyLocation: 'Aavin Feeder Dairy, Reddiarpatti / Tirunelveli District Co-operative Milk Producers Union Ltd.',
  tenderAgentName: 'Thiru. R. Shanmugam (Regional Milk Tender Distributor)',
  tenderAgentPhone: '+91 94431 54321',
  deliveryTruckNumber: 'TN 72 AJ 4492 (Eicher Insulated Milk Tanker)',
  driverName: 'Muthuvelan',
  driverPhone: '+91 98421 09876',
  expectedNightArrival: '03:45 AM - 04:15 AM',
  status: 'Night Dispatch in Transit from Tirunelveli Dairy',
  lastDispatchedDate: '2026-08-24 Night (for 25th Aug Morning)',
  cratesDispatchedYesterday: 38,
  totalLitersYesterday: 456
};

export const INITIAL_LEFTOVER_CURD_LOGS = [
  {
    id: 'curd-log-01',
    date: '2026-08-23',
    leftoverMilkPackets: 16, // 8 Litres (Orange + Purple mix)
    convertedToCurdKg: 8,
    starterCultureAddedAt: '09:30 PM',
    readyByTime: '05:00 AM (Next Day)',
    batchQuality: 'Thick & Mild (Excellent)',
    sellingPricePerKg: 60,
    status: 'Ready & Sold at Counter',
    wastePreventedValue: 480
  }
];
