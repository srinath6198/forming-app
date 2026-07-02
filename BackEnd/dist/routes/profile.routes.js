"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const profile_controller_1 = require("../controllers/profile.controller");
const router = (0, express_1.Router)();
// GET /api/profile - Get current user profile
router.get('/', auth_middleware_1.authenticate, profile_controller_1.ProfileController.getProfile);
// PUT /api/profile/update - Update user profile
router.put('/update', auth_middleware_1.authenticate, profile_controller_1.ProfileController.updateProfile);
// POST /api/profile/upload-image - Upload profile image
router.post('/upload-image', auth_middleware_1.authenticate, profile_controller_1.upload.single('profile_image'), profile_controller_1.ProfileController.uploadProfileImage);
// DELETE /api/profile/delete-image - Delete profile image
router.delete('/delete-image', auth_middleware_1.authenticate, profile_controller_1.ProfileController.deleteProfileImage);
exports.default = router;
