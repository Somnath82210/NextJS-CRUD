import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productsReducer from './slices/productSlices';
import activityReducer from './slices/activitySlice';
import statsReducer from './slices/statsSlice';

const productsPersistConfig = {
  key: 'products',
  storage,
};

const activityPersistConfig = {
  key: 'activity',
  storage,
};

const statsPersistConfig = {
  key: 'stats',
  storage,
};

const persistedProductsReducer = persistReducer(productsPersistConfig, productsReducer);
const persistedActivityReducer = persistReducer(activityPersistConfig, activityReducer);
const persistedStatsReducer = persistReducer(statsPersistConfig, statsReducer);

export const makeStore = () => {
  return configureStore({
    reducer: {
      products: persistedProductsReducer,
      activity: persistedActivityReducer,
      stats: persistedStatsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];