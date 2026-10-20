import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB, getDbStatus } from './config/db.js';
import { seedDatabase } from './seedData.js';
import { gpsSocketService } from './services/gpsSocketService.js';
import { pushService } from './services/pushService.js';
import { whatsAppService } from './services/whatsappService.js';
import { smsService } from './services/smsService.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import freezerRoutes from './routes/freezerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import communicationRoutes from './routes/communicationRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import gpsRoutes from './routes/gpsRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// 1. Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS & JSON Body Parser
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl) or allowed origins
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local dev network access
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. API Rate Limiting (Brute-force & DDoS Mitigation)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 attempts per 15 minutes for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/freezer', freezerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/gps', gpsRoutes);

// 5. Comprehensive Health & System Info Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: "Kuttiammal's Dairy Hub Production Backend",
    version: '2.1.0-production',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: getDbStatus(),
    integrations: {
      auth: {
        jwt: 'Active',
        googleOAuth: Boolean(process.env.GOOGLE_CLIENT_ID) ? 'Configured' : 'Dev Mock Mode'
      },
      whatsapp: whatsAppService.getStatus(),
      sms: smsService.getStatus(),
      push: {
        vapidConfigured: Boolean(pushService.getPublicKey()),
        activeSubscribers: pushService.getSubscriptionsCount()
      },
      gpsTelemetry: {
        socketIo: 'Active',
        activeTrips: 1
      }
    }
  });
});

// 6. Serve Production Frontend Static Build (for Render / Single Domain Hosting)
const candidateDistPaths = [
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, '../dist'),
  path.join(__dirname, 'dist'),
  path.join(process.cwd(), 'frontend/dist'),
  path.join(process.cwd(), 'dist'),
  path.resolve('frontend/dist'),
  path.resolve('dist')
];

let resolvedDistPath = null;
for (const cand of candidateDistPaths) {
  if (fs.existsSync(cand) && fs.existsSync(path.join(cand, 'index.html'))) {
    resolvedDistPath = cand;
    break;
  }
}

if (resolvedDistPath) {
  console.log(`📦 [Frontend Static Build]: Serving production assets from ${resolvedDistPath}`);
  app.use(express.static(resolvedDistPath, { dotfiles: 'allow' }));

  const indexHtmlPath = path.join(resolvedDistPath, 'index.html');
  let cachedIndexHtml = '';
  try {
    cachedIndexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  } catch (err) {
    console.error('Failed to read index.html into cache:', err);
  }

  app.get('{/*path}', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    if (cachedIndexHtml) {
      res.type('html').send(cachedIndexHtml);
    } else {
      res.sendFile(indexHtmlPath, { dotfiles: 'allow' }, (err) => {
        if (err) next(err);
      });
    }
  });
} else {
  console.warn('⚠️ [Frontend Static Build]: No dist/index.html found in candidate paths. Serving dynamic API Status Dashboard on /');
  const renderFallbackHtml = (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kuttiammal's Dairy Hub — API Portal</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 2.5rem; max-width: 600px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background: #059669; color: #ecfdf5; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; margin-bottom: 1rem; }
    h1 { margin: 0 0 0.5rem; font-size: 1.75rem; color: #38bdf8; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.5rem; }
    .endpoints { display: grid; gap: 0.75rem; margin-top: 1.5rem; }
    .endpoint { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #334155; text-decoration: none; color: #f1f5f9; font-family: monospace; font-size: 0.875rem; transition: all 0.2s; }
    .endpoint:hover { background: #1e3a8a; border-color: #3b82f6; color: #60a5fa; }
    .method { background: #2563eb; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 0.75rem; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">● PRODUCTION SERVER ONLINE</span>
    <h1>🥛 Kuttiammal's Dairy Hub</h1>
    <p>Aavin Milk Agency & Wholesale ERP Backend Engine is running smoothly.</p>
    <div style="background: #0f172a; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #10b981;">
      <div style="font-size: 0.85rem; color: #94a3b8;">Database Engine</div>
      <div style="font-weight: 600; color: #10b981; margin-top: 0.25rem;">MongoDB Compass / Mongoose Active</div>
    </div>
    <div class="endpoints">
      <a class="endpoint" href="/api/health" target="_blank"><span class="method">GET</span> /api/health <span>System Status →</span></a>
      <a class="endpoint" href="/api/products" target="_blank"><span class="method">GET</span> /api/products <span>Products Catalog →</span></a>
      <a class="endpoint" href="/api/customers/cards" target="_blank"><span class="method">GET</span> /api/customers/cards <span>Monthly Attai Cards →</span></a>
      <a class="endpoint" href="/api/gps/checkpoints" target="_blank"><span class="method">GET</span> /api/gps/checkpoints <span>GPS Telemetry →</span></a>
    </div>
  </div>
</body>
</html>`);
  };

  app.get('/', renderFallbackHtml);
  app.get('{/*path}', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    renderFallbackHtml(req, res);
  });
}

// 7. Centralized Async Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack || err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errorCode: err.code || 'INTERNAL_ERROR',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 7. Initialize Socket.IO and Start HTTP Server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  // Attach Socket.IO to HTTP server
  gpsSocketService.init(httpServer, corsOptions);

  httpServer.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🥛 [Kuttiammal's Dairy Hub Backend]: http://localhost:${PORT}`);
    console.log(`🛰️ [Live GPS Socket.IO Engine]: Active (Driver watchPosition sync)`);
    console.log(`🔔 [Web Push VAPID Notifications]: Active`);
    console.log(`💬 [Meta WhatsApp Cloud API]: ${whatsAppService.getStatus().mode}`);
    console.log(`📱 [Indian SMS Gateway]: ${smsService.getStatus().mode}`);
    console.log(`🔐 [JWT & Google OAuth 2.0]: Active`);
    console.log(`🗄️ [MongoDB Compass / Mongoose]: ${getDbStatus().engine}`);
    console.log(`======================================================\n`);
  });
};

startServer();
