"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_model_1 = require("../models/user.model");
const router = (0, express_1.Router)();
// GET /api/users — Admin only
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const users = await user_model_1.UserModel.getAll();
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
});
// GET /api/users/:id — Authenticated
router.get('/:id', auth_middleware_1.authenticate, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await user_model_1.UserModel.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found.' });
            return;
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
});
exports.default = router;
