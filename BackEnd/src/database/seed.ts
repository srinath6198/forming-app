import pool from '../config/database';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding database with test users...\n');

    const users = [
      {
        name: 'Srinath',
        email: 'dsprinath@gmail.com',
        password: await bcrypt.hash('Srinath@10', 12),
        role: 'admin',
        is_active: true,
      },
      {
        name: 'Admin User',
        email: 'admin@flora.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        is_active: true,
      },
      {
        name: 'Billing User',
        email: 'billing@flora.com',
        password: await bcrypt.hash('bill123', 12),
        role: 'admin',
        is_active: true,
      },
    ];

    for (const user of users) {
      // Check if user already exists
      const [existing] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [user.email]
      );

      if (existing.length > 0) {
        // Update existing user - only update password and is_active, keep existing role
        await pool.execute(
          'UPDATE users SET password = ?, is_active = ? WHERE email = ?',
          [user.password, user.is_active, user.email]
        );
        console.log(`✅ Updated user: ${user.email}`);
      } else {
        // Insert new user - use lowercase 'admin' for all to match ENUM
        await pool.execute(
          'INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
          [user.name, user.email, user.password, 'admin', user.is_active]
        );
        console.log(`✅ Created user: ${user.email}`);
      }
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('  Admin:       dsprinath@gmail.com / Srinath@10');
    console.log('  Admin:       admin@flora.com / admin123');
    console.log('  Billing:     billing@flora.com / bill123\n');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();