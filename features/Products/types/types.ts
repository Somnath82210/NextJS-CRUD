export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    lastUpdated: string;
    [key: string]: unknown;
  }

  export interface ProductFormData {
    name: string;
    category: string;
    price: string;
    stock: string;
  }
  export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface StatItem {
  label: string;
  value: number;
  color: string;
}



  //form
  export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

  export interface FormField {
    name: string;
    label: string;
    type: FormFieldType;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
    colSpan?: number;
  }
  