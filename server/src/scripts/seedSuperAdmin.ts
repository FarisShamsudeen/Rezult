import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Rezulter } from '../models/Rezulter';
dotenv.config();
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rezult';
const seedSuperAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    const email = 'admin@rezult.com';
    const password = 'admin';
    // Check if super admin already exists
    const existingAdmin = await Rezulter.findOne({ email });
    if (existingAdmin) {
      console.log(`Super Admin ${email} already exists! Skipping...`);
      process.exit(0);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const superAdmin = new Rezulter({
      name: 'Rezult Super Admin',
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      isEmailVerified: true,
      authProvider: 'local'
    });
    await superAdmin.save();
    console.log(`Super Admin created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
    process.exit(1);
  }
};
seedSuperAdmin();
