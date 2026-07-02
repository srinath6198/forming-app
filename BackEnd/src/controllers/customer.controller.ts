import { Request, Response } from 'express';
import { CustomerModel, CreateCustomerDto, UpdateCustomerDto } from '../models/customer.model';

export const CustomerController = {

  // GET /api/customers - Get all customers
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const customers = await CustomerModel.getAll();
      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers,
      });
    } catch (error) {
      console.error('Get all customers error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // GET /api/customers/active - Get active customers only
  async getActive(req: Request, res: Response): Promise<void> {
    try {
      const customers = await CustomerModel.getActive();
      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers,
      });
    } catch (error) {
      console.error('Get active customers error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // GET /api/customers/:id - Get customer by ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const customer = await CustomerModel.findById(id);

      if (!customer) {
        res.status(404).json({ success: false, message: 'Customer not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      console.error('Get customer by ID error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // GET /api/customers/search/:query - Search customers
  async search(req: Request, res: Response): Promise<void> {
    try {
      const query = req.params.query;
      const customers = await CustomerModel.search(query);

      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers,
      });
    } catch (error) {
      console.error('Search customers error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // POST /api/customers - Create new customer
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateCustomerDto = req.body;

      // Validate required fields
      if (!data.customer_name || !data.phone) {
        res.status(400).json({
          success: false,
          message: 'Customer name and phone number are required.',
        });
        return;
      }

      // Check if phone already exists
      const existingByPhone = await CustomerModel.findByPhone(data.phone);
      if (existingByPhone) {
        res.status(409).json({
          success: false,
          message: 'Customer with this phone number already exists.',
        });
        return;
      }

      // Check if email already exists (if provided)
      if (data.email) {
        const existingByEmail = await CustomerModel.findByEmail(data.email);
        if (existingByEmail) {
          res.status(409).json({
            success: false,
            message: 'Customer with this email already exists.',
          });
          return;
        }
      }

      // Create customer
      const customerId = await CustomerModel.create({
        ...data,
        created_by: req.user?.id || null,
      });

      // Fetch the created customer
      const newCustomer = await CustomerModel.findById(customerId);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully.',
        data: newCustomer,
      });
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // PUT /api/customers/:id - Update customer
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateCustomerDto = req.body;

      // Check if customer exists
      const existingCustomer = await CustomerModel.findById(id);
      if (!existingCustomer) {
        res.status(404).json({ success: false, message: 'Customer not found.' });
        return;
      }

      // Check if phone is being changed to an existing phone
      if (data.phone && data.phone !== existingCustomer.phone) {
        const phoneExists = await CustomerModel.findByPhone(data.phone);
        if (phoneExists) {
          res.status(409).json({
            success: false,
            message: 'Phone number already in use by another customer.',
          });
          return;
        }
      }

      // Check if email is being changed to an existing email
      if (data.email && data.email !== existingCustomer.email) {
        const emailExists = await CustomerModel.findByEmail(data.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            message: 'Email already in use by another customer.',
          });
          return;
        }
      }

      // Update customer
      const updated = await CustomerModel.update(id, data);

      if (!updated) {
        res.status(400).json({ success: false, message: 'Failed to update customer.' });
        return;
      }

      // Fetch updated customer
      const updatedCustomer = await CustomerModel.findById(id);

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully.',
        data: updatedCustomer,
      });
    } catch (error) {
      console.error('Update customer error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // DELETE /api/customers/:id - Soft delete customer
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      // Check if customer exists
      const customer = await CustomerModel.findById(id);
      if (!customer) {
        res.status(404).json({ success: false, message: 'Customer not found.' });
        return;
      }

      // Soft delete
      const deleted = await CustomerModel.delete(id);

      if (!deleted) {
        res.status(400).json({ success: false, message: 'Failed to delete customer.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully.',
      });
    } catch (error) {
      console.error('Delete customer error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  // DELETE /api/customers/:id/permanent - Hard delete customer
  async permanentDelete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      // Check if customer exists
      const customer = await CustomerModel.findById(id);
      if (!customer) {
        res.status(404).json({ success: false, message: 'Customer not found.' });
        return;
      }

      // Hard delete
      const deleted = await CustomerModel.hardDelete(id);

      if (!deleted) {
        res.status(400).json({ success: false, message: 'Failed to permanently delete customer.' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Customer permanently deleted successfully.',
      });
    } catch (error) {
      console.error('Permanent delete customer error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },
};