import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spark_salon';

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✨ [MongoDB] Connected successfully to ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.error('❌ [MongoDB] Connection error:', error.message);
    process.exit(1);
  }
}

