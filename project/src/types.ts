export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  stock: number;
}

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: Date;
  type: 'existing' | 'new';
  newProductData?: {
    name: string;
    description: string;
    categoryId: string;
  };
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: Date;
}

export interface MonthlyData {
  month: string;
  purchases: number;
  sales: number;
  profit: number;
}