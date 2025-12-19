
export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Product {
    image?: string;
    userId: string; 
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
    userId: string;
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
//auth


export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  users: User[];
  currentUser: User | null;
  token?: string | null;
}

//register 
export 
type Register = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}
export interface RegisterState  {
  users: Register[];
}

//login
export type LoginUser = {
  email: string;
  password: string;
  name: string
}
export interface LoginState {
  users: LoginUser[]
  currentUser: User | null;
  token?: string | null
}




  
