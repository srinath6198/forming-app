import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes (you can add authentication if needed)
// GET /api/customers - Get all customers
router.get('/', CustomerController.getAll);

// GET /api/customers/active - Get active customers only
router.get('/active', CustomerController.getActive);

// GET /api/customers/search/:query - Search customers
router.get('/search/:query', CustomerController.search);

// Protected routes (JWT required)
// GET /api/customers/:id - Get customer by ID
router.get('/:id', authenticate, CustomerController.getById);

// POST /api/customers - Create new customer
router.post('/', authenticate, CustomerController.create);

// PUT /api/customers/:id - Update customer
router.put('/:id', authenticate, CustomerController.update);

// DELETE /api/customers/:id - Soft delete customer
router.delete('/:id', authenticate, CustomerController.delete);

// DELETE /api/customers/:id/permanent - Hard delete customer (permanent)
router.delete('/:id/permanent', authenticate, CustomerController.permanentDelete);

export default router;