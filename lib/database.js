import mongoose from 'mongoose';
import { config } from '../config.js';
import { logger } from './logger.js';

const userSchema = new mongoose.Schema({
  jid: { type: String, unique: true },
  username: String,
  balance: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  warnings: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);

export async function connectDB() {
  try {
    await mongoose.connect(config.mongodb);
    logger.success('✅ Database Connected');
  } catch (err) {
    logger.error(`Database Error: ${err.message}`);
    setTimeout(connectDB, 5000);
  }
}
