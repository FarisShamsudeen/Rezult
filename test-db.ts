import mongoose from 'mongoose';
import { Rezulter } from './server/src/models/Rezulter';

const uri = 'mongodb://localhost:27017/rezult';

async function checkDb() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');
    const all = await Rezulter.find({});
    console.log('All users in DB:', all.map(u => ({ email: u.email, role: u.role, name: u.name })));
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

checkDb();
