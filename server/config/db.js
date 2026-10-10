import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aavin_dairy_db';

let isConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if local mongodb service isn't active
    });
    isConnected = true;
    console.log(`[MongoDB Compass Connected]: Host ${conn.connection.host} • Database: aavin_dairy_db`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning]: Local MongoDB daemon not detected (${error.message}).`);
    console.log(`[Database Fallback]: Operating in Resilient In-Memory & Synchronized Store Mode.`);
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isConnected,
  uri: MONGODB_URI,
  engine: isConnected ? 'MongoDB Compass / Local Daemon' : 'Resilient In-Memory Mock Store'
});
