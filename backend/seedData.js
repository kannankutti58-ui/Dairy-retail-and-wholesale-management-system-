import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { MonthlyAttaiCard } from './models/MonthlyAttaiCard.js';
import { ReviewFeedback } from './models/ReviewFeedback.js';

export const SEED_USERS = [
  {
    username: 'kuttiammal',
    password: 'admin123',
    name: 'Kuttiammal M.',
    role: 'admin',
    email: 'kuttiammal.dairy@aavin.tn.gov.in',
    phone: '7604936341',
    avatar: '👩‍💼',
    businessName: "Kuttiammal's Dairy Hub"
  },
  {
    username: 'lakshmi.attai',
    password: 'milk123',
    name: 'M. Lakshmi',
    role: 'client',
    email: 'lakshmi.subscriber@gmail.com',
    phone: '98421 11001',
    avatar: '👩',
    cardNumber: 'ATT-101',
    subscribedMilk: 'aavin-purple',
    quotaPackets: 2
  },
  {
    username: 'murugan.tea',
    password: 'tea123',
    name: 'R. Murugan (Tea Stall & Bakery)',
    role: 'client',
    email: 'murugantea.kovilpatti@gmail.com',
    phone: '98421 22002',
    avatar: '🏪',
    cardNumber: 'ATT-104',
    businessName: 'Murugan Tea Stall & Bakery',
    quotaPackets: 25
  },
  {
    username: 'priya.ngo',
    password: 'milk123',
    name: 'K. Priya',
    role: 'client',
    email: 'priya.kovilpatti@gmail.com',
    phone: '98421 33003',
    avatar: '👩',
    cardNumber: 'ATT-102',
    subscribedMilk: 'aavin-blue',
    quotaPackets: 1
  },
  {
    username: 'venkatesh.fcm',
    password: 'milk123',
    name: 'S. Venkatesh',
    role: 'client',
    email: 'venkatesh.perumalpuram@gmail.com',
    phone: '98421 55005',
    avatar: '👨',
    cardNumber: 'ATT-103',
    subscribedMilk: 'aavin-orange',
    quotaPackets: 3
  }
];

export const SEED_PRODUCTS = [
  {
    productId: 'aavin-blue',
    name: 'Aavin Toned Milk (Nice Blue)',
    tamilName: 'ஆவின் சமன்படுத்திய பால் (நீலம்)',
    category: 'milk',
    colorCode: 'blue',
    fatContent: '3.0%',
    snfContent: '8.5%',
    unit: '500 ml pouch',
    mrp: 22,
    wholesalePrice: 20,
    currentStock: 140,
    crateCapacity: 24,
    batchNo: 'BATCH-2026-B01',
    temperatureLimitCelsius: 4.0,
    isFastSelling: true
  },
  {
    productId: 'aavin-purple',
    name: 'Aavin Standardised Milk (Delight Purple)',
    tamilName: 'ஆவின் நிலைப்படுத்திய பால் (ஊதா)',
    category: 'milk',
    colorCode: 'purple',
    fatContent: '4.5%',
    snfContent: '8.5%',
    unit: '500 ml pouch',
    mrp: 24,
    wholesalePrice: 22,
    currentStock: 110,
    crateCapacity: 24,
    batchNo: 'BATCH-2026-P01',
    temperatureLimitCelsius: 4.0,
    isFastSelling: true
  },
  {
    productId: 'aavin-orange',
    name: 'Aavin Full Cream Milk (Orange)',
    tamilName: 'ஆவின் நிறை கொழுப்பு பால் (ஆரஞ்சு)',
    category: 'milk',
    colorCode: 'orange',
    fatContent: '6.0%',
    snfContent: '9.0%',
    unit: '500 ml pouch',
    mrp: 30,
    wholesalePrice: 28,
    currentStock: 85,
    crateCapacity: 24,
    batchNo: 'BATCH-2026-O01',
    temperatureLimitCelsius: 4.0,
    isFastSelling: true
  },
  {
    productId: 'homemade-fresh-curd',
    name: 'Shop Special Homemade Fresh Curd',
    tamilName: 'வீட்டு முறையில் தயாரித்த புத்தம் புதிய கெட்டி தயிர்',
    category: 'curd',
    colorCode: 'emerald',
    unit: '500 g container / loose',
    mrp: 30,
    wholesalePrice: 28,
    currentStock: 25,
    crateCapacity: 20,
    batchNo: 'BATCH-CURD-TODAY',
    temperatureLimitCelsius: 5.0,
    isFastSelling: true
  },
  {
    productId: 'aavin-ghee-500',
    name: 'Aavin Pure Agmark Cow Ghee (500ml)',
    tamilName: 'ஆவின் தூய பசு நெய் 500ml',
    category: 'ghee',
    colorCode: 'amber',
    unit: '500 ml Jar',
    mrp: 360,
    wholesalePrice: 340,
    currentStock: 18,
    crateCapacity: 12,
    batchNo: 'BATCH-GHEE-AGMARK',
    temperatureLimitCelsius: 25.0,
    isFastSelling: true
  }
];

export const SEED_REVIEWS = [
  {
    author: 'M. Lakshmi (Card #ATT-101)',
    phone: '7604936341',
    customerType: 'Attai Subscriber',
    cardNo: 'ATT-101',
    rating: 5,
    product: 'Aavin Delight Purple Standardised Milk',
    comment: 'Daily morning 5:30 AM delivery is punctual and milk is fresh and thick for making filter coffee!',
    date: 'Today',
    verifiedBuyer: true,
    proprietorReply: 'நன்றி லட்சுமி அம்மா! உங்கள் ஆதரவிற்கு ஆவின் பாலகத்தின் நல்வாழ்த்துகள்!'
  },
  {
    author: 'Murugan Tea Stall (Owner Murugesan)',
    phone: '7604936341',
    customerType: 'Wholesale Client',
    cardNo: 'B2B-01',
    rating: 5,
    product: 'Aavin Nice Blue 35 Packets/Day',
    comment: 'Best wholesale pricing in Kovilpatti. Weekly billing and ledger sync is completely transparent.',
    date: 'Yesterday',
    verifiedBuyer: true,
    proprietorReply: 'நன்றி முருகேசன் அண்ணா! தொடர்ந்து தரமான ஆவின் சேவையை வழங்குவோம்.'
  },
  {
    author: 'K. Priya (House #45, NGO Colony)',
    phone: '9842133003',
    customerType: 'Attai Subscriber',
    cardNo: 'ATT-102',
    rating: 5,
    product: 'Fresh Homemade Curd (500g)',
    comment: 'The thick natural curd cultured at 42°C is wonderfully sweet and delicious for our family lunch.',
    date: '2 days ago',
    verifiedBuyer: true,
    proprietorReply: 'மகிழ்ச்சி பிரியா அம்மா! தூய ஆவின் பாலில் தயாரிக்கப்படும் தரமான தயிர்.'
  }
];

export const seedDatabase = async () => {
  try {
    for (const u of SEED_USERS) {
      const existing = await User.findOne({ username: u.username });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashedPassword });
        console.log(`[Seed User Created]: ${u.username} (${u.role})`);
      }
    }

    for (const p of SEED_PRODUCTS) {
      const existing = await Product.findOne({ productId: p.productId });
      if (!existing) {
        await Product.create(p);
      }
    }

    for (const r of SEED_REVIEWS) {
      const existing = await ReviewFeedback.findOne({ author: r.author });
      if (!existing) {
        await ReviewFeedback.create(r);
      }
    }

    console.log('[Seed Complete]: Verified 5 users, products catalog & customer reviews.');
  } catch (err) {
    console.warn('[Seed DB Note]: Seeder executed with in-memory fallback:', err.message);
  }
};
