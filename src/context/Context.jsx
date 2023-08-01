import { createContext, useEffect, useMemo, useReducer } from 'react';

// Create a context for the cart
export const CartContext = createContext();

export function Context(props) {
   // Define a reducer function to handle state updates based on actions
  const reducer = (state, action) => {
    switch (action.type) {
      // Handle adding an item to the cart
      case 'ADD':
        // Check if the item is already in the cart
        const index = state.findIndex((article) => action.payload.id === article.id);
        if (index !== -1) {
          // If the item is already in the cart, increase its quantity by 1
          const tempState = [...state];
          tempState[index].quantity += 1;
          return tempState;
        }
         // If the item is not in the cart, add it with a quantity of 1
        const updatedPayload = { ...action.payload, quantity: 1 };
        return [...state, updatedPayload];

      // Handle increasing the quantity of an item in the cart
      case 'INCREASE':
        const tempStateIncrease = state.map((article) => {
          if (article.id === action.payload.id) {
            return { ...article, quantity: article.quantity + 1 };
          }
          return article;
        });
        return tempStateIncrease;

      // Handle decreasing the quantity of an item in the cart
      case 'DECREASE':
        const tempStateDecrease = state.map((article) => {
          if (article.id === action.payload.id) {
            return { ...article, quantity: article.quantity - 1 };
          }
          return article;
        });
        return tempStateDecrease;

      // Handle removing an item from the cart
      case 'REMOVE':
        const tempstateRemove = state.filter(
          (article) => article.id !== action.payload.id
        );
        return tempstateRemove;

      // Clear the entire cart by returning an empty array
      case 'CLEAR_CART':
          return [];
      default:
        return state;
    }
  };

  // Retrieve the state from local storage, or use an empty array as the initial state
  const initialState = JSON.parse(localStorage.getItem('cartState')) || [];
  const [state, dispatch] = useReducer(reducer, initialState);

  // Function to reset the cart by dispatching a CLEAR_CART action
  const resetCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Update local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(state));
  }, [state]);

  // Memoize info to prevent unnecessary re-renders
  const info = useMemo(() => ({ state, dispatch, resetCart }), [state]);

  // Provide info to child components via context
  return <CartContext.Provider value={info}>{props.children}</CartContext.Provider>;
}