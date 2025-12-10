import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatsHistory, StatsState } from './types';

const initialState: StatsState = {
    history: []
  };
  
const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateStatsHistory: (state, action: PayloadAction<Omit<StatsHistory, 'timestamp'>>) => {
      const newHistory: StatsHistory = {
        ...action.payload,
        timestamp: Date.now()
      };
      state.history.push(newHistory);
      if (state.history.length > 100) { // takes 100 entries
        state.history = state.history.slice(-100);
      }
    }
  }
});

export const { updateStatsHistory } = statsSlice.actions;
export default statsSlice.reducer;
