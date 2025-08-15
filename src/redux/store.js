import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import signupReducer from './signupSlice';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['signup', 'authConfigs', 'booking'], // Add 'booking' to persist booking state
};

const rootReducer = combineReducers({
  signup: signupReducer,
  authConfigs: authReducer,
  booking: bookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);
