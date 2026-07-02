import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  profile_image?: string;
  created_at: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UpdateProfileDto {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  profile_image?: string | null;
}

export const UserModel = {
  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? AND is_active = ? LIMIT 1',
      [email, true]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  },

  // Find user by ID
  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, name, email, role, is_active, first_name, last_name, date_of_birth, profile_image, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );

    return rows.length > 0 ? (rows[0] as User) : null;
  },

  // Create new user
  async create(data: CreateUserDto): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [
        data.name,
        data.email,
        data.password,
        'admin',
        true,
      ]
    );

    return result.insertId;
  },

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    return rows.length > 0;
  },

  // Get all users
  async getAll(): Promise<Omit<User, 'password'>[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, name, email, role, is_active, first_name, last_name, date_of_birth, profile_image, created_at FROM users ORDER BY created_at DESC'
    );

    return rows as Omit<User, 'password'>[];
  },

  // Update user profile
  async updateProfile(id: number, data: UpdateProfileDto): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

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
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  },
};
