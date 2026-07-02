"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.CustomerModel = {
    // Get all customers
    async getAll() {
        const [rows] = await database_1.default.execute(`SELECT id, customer_name, email, phone, alternate_phone, address, city, state, 
              pincode, gst_number, customer_type, credit_limit, opening_balance, 
              current_balance, notes, is_active, created_by, created_at, updated_at 
       FROM customers 
       ORDER BY created_at DESC`);
        return rows;
    },
    // Get customer by ID
    async findById(id) {
        const [rows] = await database_1.default.execute(`SELECT id, customer_name, email, phone, alternate_phone, address, city, state, 
              pincode, gst_number, customer_type, credit_limit, opening_balance, 
              current_balance, notes, is_active, created_by, created_at, updated_at 
       FROM customers 
       WHERE id = ? LIMIT 1`, [id]);
        return rows.length > 0 ? rows[0] : null;
    },
    // Get customer by phone
    async findByPhone(phone) {
        const [rows] = await database_1.default.execute('SELECT * FROM customers WHERE phone = ? LIMIT 1', [phone]);
        return rows.length > 0 ? rows[0] : null;
    },
    // Get customer by email
    async findByEmail(email) {
        const [rows] = await database_1.default.execute('SELECT * FROM customers WHERE email = ? LIMIT 1', [email]);
        return rows.length > 0 ? rows[0] : null;
    },
    // Create new customer
    async create(data) {
        const [result] = await database_1.default.execute(`INSERT INTO customers 
       (customer_name, email, phone, alternate_phone, address, city, state, pincode, 
        gst_number, customer_type, credit_limit, opening_balance, current_balance, 
        notes, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            data.customer_name,
            data.email || null,
            data.phone,
            data.alternate_phone || null,
            data.address || null,
            data.city || null,
            data.state || null,
            data.pincode || null,
            data.gst_number || null,
            data.customer_type || 'retail',
            data.credit_limit || 0.00,
            data.opening_balance || 0.00,
            data.current_balance || 0.00,
            data.notes || null,
            data.created_by || null,
        ]);
        return result.insertId;
    },
    // Update customer
    async update(id, data) {
        const fields = [];
        const values = [];
        if (data.customer_name !== undefined) {
            fields.push('customer_name = ?');
            values.push(data.customer_name);
        }
        if (data.email !== undefined) {
            fields.push('email = ?');
            values.push(data.email || null);
        }
        if (data.phone !== undefined) {
            fields.push('phone = ?');
            values.push(data.phone);
        }
        if (data.alternate_phone !== undefined) {
            fields.push('alternate_phone = ?');
            values.push(data.alternate_phone || null);
        }
        if (data.address !== undefined) {
            fields.push('address = ?');
            values.push(data.address || null);
        }
        if (data.city !== undefined) {
            fields.push('city = ?');
            values.push(data.city || null);
        }
        if (data.state !== undefined) {
            fields.push('state = ?');
            values.push(data.state || null);
        }
        if (data.pincode !== undefined) {
            fields.push('pincode = ?');
            values.push(data.pincode || null);
        }
        if (data.gst_number !== undefined) {
            fields.push('gst_number = ?');
            values.push(data.gst_number || null);
        }
        if (data.customer_type !== undefined) {
            fields.push('customer_type = ?');
            values.push(data.customer_type);
        }
        if (data.credit_limit !== undefined) {
            fields.push('credit_limit = ?');
            values.push(data.credit_limit);
        }
        if (data.opening_balance !== undefined) {
            fields.push('opening_balance = ?');
            values.push(data.opening_balance);
        }
        if (data.current_balance !== undefined) {
            fields.push('current_balance = ?');
            values.push(data.current_balance);
        }
        if (data.notes !== undefined) {
            fields.push('notes = ?');
            values.push(data.notes || null);
        }
        if (data.is_active !== undefined) {
            fields.push('is_active = ?');
            values.push(data.is_active);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const [result] = await database_1.default.execute(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`, values);
        return result.affectedRows > 0;
    },
    // Delete customer (soft delete by setting is_active to false)
    async delete(id) {
        const [result] = await database_1.default.execute('UPDATE customers SET is_active = FALSE WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
    // Hard delete customer (permanent deletion)
    async hardDelete(id) {
        const [result] = await database_1.default.execute('DELETE FROM customers WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
    // Search customers by name or phone
    async search(query) {
        const [rows] = await database_1.default.execute(`SELECT id, customer_name, email, phone, alternate_phone, address, city, state, 
              pincode, gst_number, customer_type, credit_limit, opening_balance, 
              current_balance, notes, is_active, created_by, created_at, updated_at 
       FROM customers 
       WHERE customer_name LIKE ? OR phone LIKE ? OR email LIKE ?
       AND is_active = TRUE
       ORDER BY customer_name ASC`, [`%${query}%`, `%${query}%`, `%${query}%`]);
        return rows;
    },
    // Get active customers only
    async getActive() {
        const [rows] = await database_1.default.execute(`SELECT id, customer_name, email, phone, alternate_phone, address, city, state, 
              pincode, gst_number, customer_type, credit_limit, opening_balance, 
              current_balance, notes, is_active, created_by, created_at, updated_at 
       FROM customers 
       WHERE is_active = TRUE
       ORDER BY customer_name ASC`);
        return rows;
    },
};
