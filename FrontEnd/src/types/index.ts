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
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  gst: string;
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
