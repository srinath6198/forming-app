import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login',    AuthController.login);
router.post('/logout',   AuthController.logout);

// Protected routes (JWT required)  
router.get('/me', authenticate, AuthController.getProfile);

export default router;
