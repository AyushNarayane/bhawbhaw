import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import serviceReducer from "./serviceSlice";
import wishlistReducer from "./wishlistSlice";
import addressesReducer from "./addressesSlice";  // Import the addressesReducer

const persistConfig = {
  key: "root",
  storage: storage.default || storage,
  whitelist: ["cart", "wishlist"],  // Make sure to whitelist "addresses" if you want to persist it
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  service: serviceReducer,
  addresses: addressesReducer,  // Add addressesReducer here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
