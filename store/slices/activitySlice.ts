import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity, initialState, MAX_ACTIVITIES } from './types';

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp' | 'count'> & { count?: number }>) => {
      // Made this to check all activity
      const existingIndex = state.activities.findIndex(
        (a) => a.productId === action.payload.productId && a.type === action.payload.type
      );

      if (existingIndex !== -1) {
        state.activities[existingIndex].count += 1;
        state.activities[existingIndex].timestamp = Date.now();
        state.activities[existingIndex].productName = action.payload.productName; // Update name in case it changed
        const updatedActivity = state.activities.splice(existingIndex, 1)[0];
        state.activities.unshift(updatedActivity);
      } else {
        // Create new activity
        const newActivity: Activity = {
          ...action.payload,
          id: `${action.payload.productId}-${action.payload.type}-${Date.now()}`,
          timestamp: Date.now(),
          count: action.payload.count || 1
        };
        state.activities.unshift(newActivity);
      }
      if (state.activities.length > MAX_ACTIVITIES) {
        state.activities = state.activities.slice(0, MAX_ACTIVITIES);
      }
    },
    clearActivities: (state) => {
      state.activities = [];
    }
  }
});

export const { addActivity, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
