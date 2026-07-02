"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedUsers = async () => {
    try {
        console.log('🌱 Seeding database with test users...\n');
        const users = [
            {
                name: 'Srinath',
                email: 'dsprinath@gmail.com',
                password: await bcryptjs_1.default.hash('Srinath@10', 12),
                role: 'admin',
                is_active: true,
            },
            {
                name: 'Admin User',
                email: 'admin@flora.com',
                password: await bcryptjs_1.default.hash('admin123', 12),
                role: 'admin',
                is_active: true,
            },
            {
                name: 'Billing User',
                email: 'billing@flora.com',
                password: await bcryptjs_1.default.hash('bill123', 12),
                role: 'admin',
                is_active: true,
            },
        ];
        for (const user of users) {
            // Check if user already exists
            const [existing] = await database_1.default.execute('SELECT id FROM users WHERE email = ?', [user.email]);
            if (existing.length > 0) {
                // Update existing user - only update password and is_active, keep existing role
                await database_1.default.execute('UPDATE users SET password = ?, is_active = ? WHERE email = ?', [user.password, user.is_active, user.email]);
                console.log(`✅ Updated user: ${user.email}`);
            }
            else {
                // Insert new user - use lowercase 'admin' for all to match ENUM
                await database_1.default.execute('INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)', [user.name, user.email, user.password, 'admin', user.is_active]);
                console.log(`✅ Created user: ${user.email}`);
            }
        }
        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('  Admin:       dsprinath@gmail.com / Srinath@10');
        console.log('  Admin:       admin@flora.com / admin123');
        console.log('  Billing:     billing@flora.com / bill123\n');
        await database_1.default.end();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};
seedUsers();
