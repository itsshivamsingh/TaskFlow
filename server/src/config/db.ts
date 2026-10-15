import mongoose from 'mongoose';
import dns from 'dns';
import { ENV } from './env';
import { logger } from '../utils/logger';

// Configure DNS servers and IPv4 preference to prevent querySrv ECONNREFUSED on Windows / local resolvers
try {
  dns.setDefaultResultOrder?.('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if running in environment where setServers is restricted
}

export const connectDB = async (): Promise<boolean> => {
  const uri = ENV.MONGODB_URI;

  const hasPlaceholders =
    !uri ||
    uri.includes('<db_username>') ||
    uri.includes('<db_password>') ||
    uri.includes('<username>') ||
    uri.includes('<password>') ||
    uri.includes('YOUR_USERNAME') ||
    uri.includes('YOUR_PASSWORD');

  if (hasPlaceholders) {
    logger.warn(
      '⚠️ MONGODB_URI contains placeholder credentials in server/.env.\n' +
      'Please replace <db_username> and <db_password> in server/.env with your actual MongoDB Atlas user credentials.\n' +
      'Example: MONGODB_URI=mongodb+srv://myUser:myPass@cluster0.kifrk7a.mongodb.net/task_management?retryWrites=true&w=majority&appName=Cluster0'
    );
    return false;
  }

  try {
    const sanitized = logger.sanitizeUri(uri);
    logger.info(`Connecting to MongoDB at: ${sanitized}...`);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    logger.info(`✅ Successfully connected to MongoDB [Database: ${mongoose.connection.name}]`);
    return true;
  } catch (error: any) {
    logger.error('❌ MongoDB connection failed:', error.message);
    logger.error(
      'Please check your MONGODB_URI in server/.env, verify network access/IP allowlist in MongoDB Atlas, and ensure credentials are correct.'
    );
    return false;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected gracefully.');
  } catch (error: any) {
    logger.error('Error disconnecting MongoDB:', error.message);
  }
};
