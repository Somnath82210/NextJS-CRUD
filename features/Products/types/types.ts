//store
export interface ProductSlice {
    id: string;
    name: string;
    price: number;
    pageSize: number;
    qty: number;
    date: string;
    status: 'Available' | 'Out of Stock';
  }
  
  export interface ProductsState {
    products: ProductSlice[];
    loading: boolean;
    error: string | null;
  }
  // create products
  export interface ProductFormData {
      productName: string;
      pageSize: string;
      format: string;
      category: string;
      price: string;
      quantity: string;
      status: string;
      photos: string[];
      reportFile: File | null;
    }

    export interface ValidationErrors {
      productName?: string;
      pageSize?: string;
      format?: string;
      category?: string;
      price?: string;
      quantity?: string;
      status?: string;
    }

    // edit modal 

    export interface EditModalProps {
      isOpen: boolean;
      onClose: () => void;
      productData: {
        id: string;
        name: string;
        price: string;
        pageSize: string;
      };
      setProductData: React.Dispatch<
        React.SetStateAction<{
          id: string;
          name: string;
          price: string;
          pageSize: string;
        }>
      >;
      onSubmit: () => void;
    }
    
    