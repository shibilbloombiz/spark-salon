import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { Admin } from '../models/Admin.js';

dotenv.config();

export async function seedAdmin() {
  await connectDB();

  const email = 'admin@sparksalon.com';
  const existing = await Admin.findOne({ email });

  if (!existing) {
    const passwordHash = await bcrypt.hash('SparkAdmin@2026', 10);
    const admin = await Admin.create({
      name: 'Spark Administrator',
      email,
      passwordHash,
      role: 'superadmin',
      isActive: true,
    });
    console.log('✅ [Seed] Default Admin created:', { email: admin.email, role: admin.role });
  } else {
    console.log('ℹ️ [Seed] Default Admin already exists:', existing.email);
  }
}

if (process.argv[1]?.endsWith('seedAdmin.ts')) {
  seedAdmin().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

