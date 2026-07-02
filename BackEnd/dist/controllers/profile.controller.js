"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.ProfileController = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const user_model_1 = require("../models/user.model");
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profile-images';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
        }
    }
});
exports.upload = upload;
exports.ProfileController = {
    // PUT /api/profile/update - Update user profile
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            const { first_name, last_name, date_of_birth } = req.body;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized.' });
                return;
            }
            // Update profile
            const updated = await user_model_1.UserModel.updateProfile(userId, {
                first_name,
                last_name,
                date_of_birth
            });
            if (!updated) {
                res.status(400).json({ success: false, message: 'Failed to update profile.' });
                return;
            }
            // Fetch updated user data
            const user = await user_model_1.UserModel.findById(userId);
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully.',
                data: user
            });
        }
        catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
    // POST /api/profile/upload-image - Upload profile image
    async uploadProfileImage(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized.' });
                return;
            }
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No image file provided.' });
                return;
            }
            // Get current user to delete old profile image
            const currentUser = await user_model_1.UserModel.findById(userId);
            if (currentUser?.profile_image) {
                const oldImagePath = currentUser.profile_image;
                if (fs_1.default.existsSync(oldImagePath)) {
                    fs_1.default.unlinkSync(oldImagePath);
                }
            }
            // Save the relative path to database
            const imagePath = req.file.path;
            const updated = await user_model_1.UserModel.updateProfile(userId, {
                profile_image: imagePath
            });
            if (!updated) {
                // Delete uploaded file if database update fails
                fs_1.default.unlinkSync(req.file.path);
                res.status(400).json({ success: false, message: 'Failed to save profile image.' });
                return;
            }
            // Fetch updated user data
            const user = await user_model_1.UserModel.findById(userId);
            res.status(200).json({
                success: true,
                message: 'Profile image uploaded successfully.',
                data: user
            });
        }
        catch (error) {
            console.error('Upload image error:', error);
            // Clean up uploaded file if error occurred
            if (req.file && fs_1.default.existsSync(req.file.path)) {
                fs_1.default.unlinkSync(req.file.path);
            }
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
    // DELETE /api/profile/delete-image - Delete profile image
    async deleteProfileImage(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized.' });
                return;
            }
            // Get current user to delete image file
            const currentUser = await user_model_1.UserModel.findById(userId);
            if (currentUser?.profile_image) {
                const imagePath = currentUser.profile_image;
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath);
                }
            }
            // Remove profile image from database
            const updated = await user_model_1.UserModel.updateProfile(userId, {
                profile_image: null
            });
            if (!updated) {
                res.status(400).json({ success: false, message: 'Failed to delete profile image.' });
                return;
            }
            // Fetch updated user data
            const user = await user_model_1.UserModel.findById(userId);
            res.status(200).json({
                success: true,
                message: 'Profile image deleted successfully.',
                data: user
            });
        }
        catch (error) {
            console.error('Delete image error:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
    // GET /api/profile - Get current user profile
    async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized.' });
                return;
            }
            const user = await user_model_1.UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found.' });
                return;
            }
            res.status(200).json({ success: true, data: user });
        }
        catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    }
};
