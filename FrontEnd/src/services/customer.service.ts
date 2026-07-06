import api from './api';
import type { Customer } from '@/types';

export interface CreateCustomerRequest {
  customer_name: string;
  email?: string;
  phone: string;
  alternate_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gst_number?: string;
  customer_type?: 'retail' | 'wholesale' | 'corporate';
  credit_limit?: number;
  opening_balance?: number;
  current_balance?: number;
  notes?: string;
}

export interface UpdateCustomerRequest {
  customer_name?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gst_number?: string;
  customer_type?: 'retail' | 'wholesale' | 'corporate';
  credit_limit?: number;
  opening_balance?: number;
  current_balance?: number;
  notes?: string;
  is_active?: boolean;
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

export interface CustomersListResponse {
  success: boolean;
  count: number;
  data: Customer[];
}

export const customerService = {
  // Get all customers
  async getAll(): Promise<CustomersListResponse> {
    const response = await api.get<CustomersListResponse>('/customers');
    return response.data;
  },

  // Get active customers only
  async getActive(): Promise<CustomersListResponse> {
    const response = await api.get<CustomersListResponse>('/customers/active');
    return response.data;
  },

  // Get customer by ID
  async getById(id: number): Promise<CustomerResponse> {
    const response = await api.get<CustomerResponse>(`/customers/${id}`);
    return response.data;
  },

  // Search customers
  async search(query: string): Promise<CustomersListResponse> {
    const response = await api.get<CustomersListResponse>(`/customers/search/${query}`);
    return response.data;
  },

  // Create new customer
  async create(data: CreateCustomerRequest): Promise<CustomerResponse> {
    const response = await api.post<CustomerResponse>('/customers', data);
    return response.data;
  },

  // Update customer
  async update(id: number, data: UpdateCustomerRequest): Promise<CustomerResponse> {
    const response = await api.put<CustomerResponse>(`/customers/${id}`, data);
    return response.data;
  },

  // Delete customer (soft delete)
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  // Permanent delete customer
  async permanentDelete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/customers/${id}/permanent`);
    return response.data;
  },
};