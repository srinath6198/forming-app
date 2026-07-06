export type Role = "Super Admin" | "Admin" | "Billing User";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  profile_image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  unit: string;
  expiryDate: string;
  image: string;
}

export interface Customer {
  id: number;
  customer_name: string;
  email: string | null;
  phone: string;
  alternate_phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gst_number: string | null;
  customer_type: 'retail' | 'wholesale' | 'corporate';
  credit_limit: number;
  opening_balance: number;
  current_balance: number;
  notes: string | null;
  is_active: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  mobile: string;
  email: string;
  address: string;
}

export interface BillItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  gst: number;
  discount: number;
  total: number;
}

export interface Bill {
  id: string;
  invoiceNo: string;
  date: string;
  customer: string;
  items: BillItem[];
  subtotal: number;
  gstTotal: number;
  discountTotal: number;
  grandTotal: number;
  payment: "Cash" | "UPI" | "Card";
}
