
export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: ProductStatus;
    lastUpdated: string;
  }
  
  export interface ProductsState {
    products: Product[];
  }

// activity slice
  export type ActivityType = 'added' | 'edited' | 'removed';

  export interface Activity {
    id: string;
    type: ActivityType;
    productId: number;
    productName: string;
    timestamp: number;
    count: number;
  }
  
 export interface ActivityState {
    activities: Activity[];
  }
  
 export const MAX_ACTIVITIES = 10;
  
  export const initialState: ActivityState = {
    activities: []
  };

  //stats

export interface StatsHistory {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  timestamp: number;
}

export interface StatsState {
  history: StatsHistory[];
}



  
