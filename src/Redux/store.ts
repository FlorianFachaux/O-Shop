import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Reducers/AuthReducer'; // Import your authReducer and other reducers if needed
import cartReducer from './Reducers/cartReducer'; // Import your cartReducer

const initialState = {
  cartItems: [],
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;