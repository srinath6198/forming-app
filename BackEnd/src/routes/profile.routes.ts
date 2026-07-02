import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { ProfileController, upload } from '../controllers/profile.controller';

const router = Router();

// GET /api/profile - Get current user profile
router.get('/', authenticate, ProfileController.getProfile);

// PUT /api/profile/update - Update user profile
router.put('/update', authenticate, ProfileController.updateProfile);

// POST /api/profile/upload-image - Upload profile image
router.post('/upload-image', authenticate, upload.single('profile_image'), ProfileController.uploadProfileImage);

// DELETE /api/profile/delete-image - Delete profile image
router.delete('/delete-image', authenticate, ProfileController.deleteProfileImage);

export default router;