import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductsState } from './types';

const initialState: ProductsState = {
  products: []
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state: ProductsState, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state: ProductsState, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        p => p.id === action.payload.id && p.userId === action.payload.userId
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state: ProductsState, action: PayloadAction<{ id: number; userId: string }>) => {
      state.products = state.products.filter(
        p => !(p.id === action.payload.id && p.userId === action.payload.userId)
      );
    }
  }
});

export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer;