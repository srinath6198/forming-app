"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// ─── Middleware ───────────────────────────────────────────────────────────────
// CORS
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://yourdomain.com'
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001', 'http://localhost:4173'],
    credentials: true,
}));
// Parse JSON & URL-encoded bodies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
}));
// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
    res.json({ message: '🚀 Forming Billing API is running', status: 'OK' });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});
// ─── Start Server ─────────────────────────────────────────────────────────────
const start = async () => {
    await (0, database_1.testConnection)(); // Test MySQL connection first
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`📦 Database: forming_billing`);
        console.log(`🔐 Auth: JWT + Sessions\n`);
    });
};
start();
exports.default = app;
