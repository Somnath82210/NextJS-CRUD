import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, RegisterState, LoginState } from './types';

const initialState: AuthState = {
  users: [],
  currentUser: null,
  token: null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state: RegisterState, action: PayloadAction<User>) => {
      const existingUser = state.users.find(
        user => user.email === action.payload.email
      );

      if (!existingUser) {
        const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2);
        state.users.push({
          ...action.payload,
          id: userId
        });
      }
    },

    loginUser: (state: LoginState, action: PayloadAction<{ email: string; password: string }>) => {
      const user = state.users.find(
        u => u.email === action.payload.email && u.password === action.payload.password
      );

      if (user) {
        const fakeToken = "token_" + Math.random().toString(36).substring(2);
        state.currentUser = user;
        state.token = fakeToken;
      }
    },

    logoutUser: (state: AuthState) => {
      state.currentUser = null;
      state.token = null;   
    },
  },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;