export interface Product {
    id: number;
    userId: string; 
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    lastUpdated: string;
    [key: string]: unknown;
    image?: string
  }

  export interface ProductFormData {
    name: string;
    category: string;
    price: string;
    stock: string;
    image?: string
  }
  export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface StatItem {
  id: string;
  label: string;
  color: string;
  value: string;
}

  