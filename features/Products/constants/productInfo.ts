import { ProductFormData, ProductStatus  } from "../types/types";


export const INITIAL_FORM_DATA: ProductFormData = {
  name: '',
  category: '',
  price: '',
  stock: ''
};
// Product categories
export const PRODUCT_CATEGORIES: string[] = [
  'Electronics',
  'Beauty',
  'Food',
  'Clothing',
  'Books',
  'Sports',
  'Home & Garden',
  'Toys',
  'Automotive',
  'Health',
  'Jewelry',
  'Pet Supplies',
  'Office Supplies',
  'Music',
  'Movies',
  'Gaming',
  'Furniture',
  'Tools',
  'Baby Products',
  'Art & Crafts'
];

export const STATUS_COLORS: Record<ProductStatus, string> = {
  'In Stock': 'bg-green-100 text-green-800',
  'Low Stock': 'bg-orange-100 text-orange-800',
  'Out of Stock': 'bg-red-100 text-red-800'
};

export const ITEMS_PER_PAGE = 5;





 
