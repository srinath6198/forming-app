"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticate = void 0;
const jwt_1 = require("../config/jwt");
// Verify JWT from Authorization header OR session
const authenticate = (req, res, next) => {
    try {
        // 1. Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        // 2. Check session token as fallback
        if (!token && req.session && req.session.token) {
            token = req.session.token;
        }
        if (!token) {
            res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};
exports.authenticate = authenticate;
// Admin-only middleware
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
