"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../config/jwt");
exports.AuthController = {
    // POST /api/auth/register
    async register(req, res) {
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
            const exists = await user_model_1.UserModel.emailExists(email);
            if (exists) {
                res.status(409).json({ success: false, message: 'Email already registered.' });
                return;
            }
            // Hash password with bcrypt (salt rounds: 12)
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            // Create user
            const userId = await user_model_1.UserModel.create({
                name,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role: role || 'user',
            });
            // Generate JWT
            const token = (0, jwt_1.generateToken)({ id: userId, email, role: role || 'user' });
            // Save token in session
            req.session.token = token;
            req.session.userId = userId;
            res.status(201).json({
                success: true,
                message: 'User registered successfully.',
                data: { userId, token },
            });
        }
        catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
    // POST /api/auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ success: false, message: 'Email and password are required.' });
                return;
            }
            // Find user
            const user = await user_model_1.UserModel.findByEmail(email.toLowerCase().trim());
            if (!user) {
                res.status(401).json({ success: false, message: 'Invalid email or password.' });
                return;
            }
            // Compare password with bcrypt
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ success: false, message: 'Invalid email or password.' });
                return;
            }
            // Generate JWT token
            const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email, role: user.role });
            // Store in session
            req.session.token = token;
            req.session.userId = user.id;
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
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
    // POST /api/auth/logout
    async logout(req, res) {
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
    async getProfile(req, res) {
        try {
            const user = await user_model_1.UserModel.findById(req.user.id);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found.' });
                return;
            }
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
};
