// app/types/index.ts
export type UserRole = 'admin' | 'cashier';

export interface User {
  id: string;
  name: string;
  username?: string;
  fullName?: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName?: string;
  items: CartItem[];
  total: number;
  subTotal?: number;
  deliveryCharge?: number;
  discount?: number;
  paymentMethod?: string;
  cashierName?: string;
  orderNumber?: string;
  status: 'completed' | 'pending';
  date: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}