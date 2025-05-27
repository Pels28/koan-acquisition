import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "@/features/auth/authSlice";

// Redux-persist configuration
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "userInfo"] // Only persist these fields from auth slice
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
      }
    })
});

export const persistor = persistStore(store);

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;