import { Reducer } from 'redux';
import {
  CartActionTypes,
  ADD_TO_CART,
  RESET_CART,
  DECREASE_QUANTITY,
  INCREASE_QUANTITY,
  REMOVE_ITEM,
} from '../types';
import { CartState } from '../types';

const initialState: CartState = {
  cartItems: [],
};

const cartReducer: Reducer<CartState, CartActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
        };
      }
    case DECREASE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max((item.quantity || 0) - 1, 0) }
            : item
        ),
      };
    case INCREASE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        ),
      };
    case REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload.id),
      };
    case RESET_CART:
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};

export default cartReducer;