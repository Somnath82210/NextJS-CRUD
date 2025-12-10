import { ProductFormData, FormField, ProductStatus } from "../types/types";

export const INITIAL_FORM_DATA: ProductFormData = {
  name: '',
  category: '',
  price: '',
  stock: ''
};

export const FORM_FIELDS: FormField[] = [
  {
    name: 'name',
    label: 'Product Name',
    type: 'text',
    placeholder: 'Enter product name',
    required: true,
    colSpan: 2
  },
  {
    name: 'category',
    label: 'Category',
    type: 'text',
    placeholder: 'e.g., Electronics, Accessories',
    required: true
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    placeholder: '0.00',
    required: true
  },
  {
    name: 'stock',
    label: 'Stock Quantity',
    type: 'number',
    placeholder: '0',
    required: true,
    colSpan: 2
  }
];

export const STATUS_COLORS: Record<ProductStatus, string> = {
  'In Stock': 'bg-green-100 text-green-800',
  'Low Stock': 'bg-orange-100 text-orange-800',
  'Out of Stock': 'bg-red-100 text-red-800'
};