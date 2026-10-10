import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './config/db.js';
import { seedDatabase } from './seedData.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import freezerRoutes from './routes/freezerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Parsing
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/freezer', freezerRoutes);
app.use('/api/payment', paymentRoutes);

// Health & System Info Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: "Kuttiammal's Dairy Hub Backend API",
    auth: 'JSON Web Tokens (JWT) + Google OAuth 2.0',
    database: getDbStatus(),
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🥛 [Kuttiammal's Dairy Hub Backend]: http://localhost:${PORT}`);
    console.log(`🔐 [JWT Authentication]: Active (Store Admin & Client Portals)`);
    console.log(`🗄️ [MongoDB Compass / Mongoose]: ${getDbStatus().engine}`);
    console.log(`======================================================\n`);
  });
};

startServer();
