# 🥛 Dairy Retail and Wholesale Management System
### Enterprise Full-Stack Application for Kuttiammal's Dairy Hub

This project is cleanly organized into two distinct modules:
- 📁 **`frontend/`** — React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet Maps, Multi-channel Communication UI.
- 📁 **`backend/`** — Node.js, Express 5, MongoDB / Mongoose, Socket.IO Live Telemetry, UltraMsg WhatsApp Gateway, VAPID Web Push, Indian SMS Gateway.

---

## 🚀 How to Run the Project

### Method 1: Open 2 Terminals in VS Code (Standard College Review Way)

#### Terminal 1 — Start Backend Server:
```bash
cd backend
npm start
```
* Backend runs at: `http://localhost:5000`
* Automatically connects to MongoDB Compass database `aavin_dairy_db`.
* Initializes live UltraMsg WhatsApp gateway, Socket.IO GPS engine, and VAPID Push.

#### Terminal 2 — Start Frontend Application:
```bash
cd frontend
npm run dev
```
* Frontend runs at: `http://localhost:5173` (or `http://localhost:3000`)
* Open in browser to view the Dairy Management System.

---

### Method 2: Run directly from Root Directory
```bash
npm run backend    # Starts the backend server
npm run frontend   # Starts the frontend Vite dev server
```

---

## 📁 Project Architecture & Folder Structure

```
aavin-milk-agency/
│
├── 📁 backend/
│   ├── 📁 config/           # Database connection (db.js)
│   ├── 📁 controllers/      # Business logic handlers
│   ├── 📁 middleware/       # JWT Auth and security middleware
│   ├── 📁 models/           # Mongoose schemas (User, Product, Sales, Freezer, etc.)
│   ├── 📁 routes/           # REST API route endpoints
│   ├── 📁 services/         # WhatsApp (UltraMsg), SMS, GPS Socket.IO, Web Push
│   ├── 📄 .env              # Backend environment variables & UltraMsg credentials
│   ├── 📄 package.json      # Backend dependencies
│   ├── 📄 seedData.js       # Auto-seed initial catalog and users
│   └── 📄 server.js         # Express server entry point
│
├── 📁 frontend/
│   ├── 📁 public/           # Static logos and assets
│   ├── 📁 src/
│   │   ├── 📁 components/   # UI components (POS, Freezer, WhatsApp Hub, Orders, etc.)
│   │   ├── 📁 context/      # ShopContext and global state management
│   │   ├── 📁 data/         # Translations, initial catalog, mock fallbacks
│   │   ├── 📄 App.jsx       # Main layout and routing
│   │   ├── 📄 index.css     # Global CSS and Tailwind directives
│   │   └── 📄 main.jsx      # React root mount
│   ├── 📄 .env              # Frontend environment variables
│   ├── 📄 index.html        # HTML entry point
│   ├── 📄 package.json      # Frontend dependencies
│   ├── 📄 postcss.config.js # PostCSS configuration
│   ├── 📄 tailwind.config.js# Tailwind CSS configuration
│   └── 📄 vite.config.js    # Vite configuration
│
├── 📄 .gitignore
├── 📄 package.json          # Root scripts to orchestrate frontend & backend
└── 📄 README.md
```
