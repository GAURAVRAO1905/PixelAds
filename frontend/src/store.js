import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { campaignApiSlice } from './slices/campaignApiSlice';
import { userApiSlice } from './slices/usersApiSlice'; // Assuming you have a userApiSlice

const store = configureStore({
  reducer: {
    [campaignApiSlice.reducerPath]: campaignApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer, // Add userApiSlice reducer
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(campaignApiSlice.middleware)
      .concat(userApiSlice.middleware), // Add userApiSlice middleware
  devTools: true,
});

export default store;
