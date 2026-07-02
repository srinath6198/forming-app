import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { UserModel } from '../models/user.model';

const router = Router();

// GET /api/users — Admin only
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

// GET /api/users/:id — Authenticated
router.get('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user.' });
  }
});

export default router;
