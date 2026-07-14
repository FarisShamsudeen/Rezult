import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Candidate } from './src/models/Candidate';
import { Rezulter } from './src/models/Rezulter';
import { UserRole, AuthProvider } from './src/enums';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rezult';

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to database.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    console.log('Seeding 20 Candidates...');
    const candidates = [];
    for (let i = 1; i <= 20; i++) {
      candidates.push({
        name: `Candidate User ${i}`,
        email: `candidate${i}@example.com`,
        passwordHash,
        isEmailVerified: true,
        authProvider: AuthProvider.LOCAL
      });
    }
    await Candidate.insertMany(candidates);

    console.log('Seeding 20 Rezulters...');
    const rezulters = [];
    for (let i = 1; i <= 20; i++) {
      rezulters.push({
        name: `Rezulter Admin ${i}`,
        email: `rezulter${i}@example.com`,
        passwordHash,
        role: UserRole.REZULTER,
        isEmailVerified: true,
        authProvider: AuthProvider.LOCAL,
        candidateIds: []
      });
    }
    await Rezulter.insertMany(rezulters);

    console.log('Seeding complete! Added 20 candidates and 20 rezulters.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
