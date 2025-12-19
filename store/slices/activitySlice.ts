import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity, ActivityState, MAX_ACTIVITIES } from './types';

const initialState: ActivityState = {
  activities: []
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity: (state: ActivityState, action: PayloadAction<Omit<Activity, 'id' | 'timestamp' | 'count'> & { count?: number }>) => {
      // Find existing activity for this user, product, and type
      const existingIndex = state.activities.findIndex(
        (a) => 
          a.userId === action.payload.userId &&
          a.productId === action.payload.productId && 
          a.type === action.payload.type
      );

      if (existingIndex !== -1) {
        // Update existing activity
        state.activities[existingIndex].count += 1;
        state.activities[existingIndex].timestamp = Date.now();
        state.activities[existingIndex].productName = action.payload.productName;
        
        const updatedActivity = state.activities.splice(existingIndex, 1)[0];
        state.activities.unshift(updatedActivity);
      } else {
        const newActivity: Activity = {
          ...action.payload,
          id: `${action.payload.userId}-${action.payload.productId}-${action.payload.type}-${Date.now()}`,
          timestamp: Date.now(),
          count: action.payload.count || 1,
          userId: action.payload.userId
        };
        state.activities.unshift(newActivity);
      }

      if (state.activities.length > MAX_ACTIVITIES) {
        state.activities = state.activities.slice(0, MAX_ACTIVITIES);
      }
    },
    
    clearActivities: (state) => {
      state.activities = [];
    },
    
    clearUserActivities: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter(a => a.userId !== action.payload);
    }
  }
});

export const { addActivity, clearActivities, clearUserActivities } = activitySlice.actions;
export default activitySlice.reducer;