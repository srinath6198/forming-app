"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes (you can add authentication if needed)
// GET /api/customers - Get all customers
router.get('/', customer_controller_1.CustomerController.getAll);
// GET /api/customers/active - Get active customers only
router.get('/active', customer_controller_1.CustomerController.getActive);
// GET /api/customers/search/:query - Search customers
router.get('/search/:query', customer_controller_1.CustomerController.search);
// Protected routes (JWT required)
// GET /api/customers/:id - Get customer by ID
router.get('/:id', auth_middleware_1.authenticate, customer_controller_1.CustomerController.getById);
// POST /api/customers - Create new customer
router.post('/', auth_middleware_1.authenticate, customer_controller_1.CustomerController.create);
// PUT /api/customers/:id - Update customer
router.put('/:id', auth_middleware_1.authenticate, customer_controller_1.CustomerController.update);
// DELETE /api/customers/:id - Soft delete customer
router.delete('/:id', auth_middleware_1.authenticate, customer_controller_1.CustomerController.delete);
// DELETE /api/customers/:id/permanent - Hard delete customer (permanent)
router.delete('/:id/permanent', auth_middleware_1.authenticate, customer_controller_1.CustomerController.permanentDelete);
exports.default = router;
