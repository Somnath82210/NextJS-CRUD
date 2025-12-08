import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductSlice, ProductsState } from '@/features/Products/types/types';
import { initialProducts } from '@/features/Products/constants/constants';


 const initialState: ProductsState = {
    products: initialProducts,
    loading: false,
    error: null,
  };
  
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductSlice>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<ProductSlice>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    setProducts: (state, action: PayloadAction<ProductSlice[]>) => {
      state.products = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  setProducts,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
