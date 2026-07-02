import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { generateToken } from '../config/jwt';

export const AuthController = {

  // POST /api/auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      // Validate input
      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        return;
      }

      // Check if email exists
      const exists = await UserModel.emailExists(email);
      if (exists) {
        res.status(409).json({ success: false, message: 'Email already registered.' });
        return;
      }

      // Hash password with bcrypt (salt rounds: 12)
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const userId = await UserModel.create({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role || 'user',
      });

      // Generate JWT
      const token = generateToken({ id: userId, email, role: role || 'user' });

      // Save token in session
      (req.session as any).token = token;
      (req.session as any).userId = userId;

      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: { userId, token },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }

      // Find user
      const user = await UserModel.findByEmail(email.toLowerCase().trim());
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      // Compare password with bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      // Generate JWT token
      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      // Store in session
      (req.session as any).token = token;
      (req.session as any).userId = user.id;

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // POST /api/auth/logout
  async logout(req: Request, res: Response): Promise<void> {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Logout failed.' });
        return;
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ success: true, message: 'Logged out successfully.' });
    });
  },

  // GET /api/auth/me  (protected)
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },
};
