"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.UserModel = {
    // Find user by email
    async findByEmail(email) {
        const [rows] = await database_1.default.execute('SELECT * FROM users WHERE email = ? AND is_active = ? LIMIT 1', [email, true]);
        return rows.length > 0 ? rows[0] : null;
    },
    // Find user by ID
    async findById(id) {
        const [rows] = await database_1.default.execute('SELECT id, name, email, role, is_active, first_name, last_name, date_of_birth, profile_image, created_at FROM users WHERE id = ? LIMIT 1', [id]);
        return rows.length > 0 ? rows[0] : null;
    },
    // Create new user
    async create(data) {
        const [result] = await database_1.default.execute('INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)', [
            data.name,
            data.email,
            data.password,
            data.role || 'user',
            true,
        ]);
        return result.insertId;
    },
    // Check if email exists
    async emailExists(email) {
        const [rows] = await database_1.default.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
        return rows.length > 0;
    },
    // Get all users
    async getAll() {
        const [rows] = await database_1.default.execute('SELECT id, name, email, role, is_active, first_name, last_name, date_of_birth, profile_image, created_at FROM users ORDER BY created_at DESC');
        return rows;
    },
    // Update user profile
    async updateProfile(id, data) {
        const fields = [];
        const values = [];
        if (data.first_name !== undefined) {
            fields.push('first_name = ?');
            values.push(data.first_name);
        }
        if (data.last_name !== undefined) {
            fields.push('last_name = ?');
            values.push(data.last_name);
        }
        if (data.date_of_birth !== undefined) {
            fields.push('date_of_birth = ?');
            values.push(data.date_of_birth || null);
        }
        if (data.profile_image !== undefined) {
            fields.push('profile_image = ?');
            values.push(data.profile_image);
        }
        if (fields.length === 0) {
            return false;
        }
        values.push(id);
        const [result] = await database_1.default.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    },
};
