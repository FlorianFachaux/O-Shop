import { IArticle } from '../@types/article';

// Types d'actions
export const ADD_TO_CART = 'ADD_TO_CART';
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const INCREASE_QUANTITY = "INCREASE_QUANTITY";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const RESET_CART = 'RESET_CART';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const INITIALIZE_CART = "INITIALIZE_CART";

// Types des actions

export interface InitializeCartAction {
  type: typeof INITIALIZE_CART;
  payload: IArticle[];
}

export interface AddToCartAction {
  type: typeof ADD_TO_CART;
  payload: IArticle;
}

export interface RemoveItemAction {
  type: typeof REMOVE_ITEM;
  payload: IArticle;
}

export interface DecreaseQuantityAction {
  type: typeof DECREASE_QUANTITY;
  payload: IArticle;
}

export interface IncreaseQuantityAction {
  type: typeof INCREASE_QUANTITY;
  payload: IArticle;
}

export interface ResetCartAction {
  type: typeof RESET_CART;
}

export interface LoginAction {
  type: typeof LOGIN;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export type CartActionTypes = 
  AddToCartAction 
  | DecreaseQuantityAction 
  | IncreaseQuantityAction 
  | RemoveItemAction 
  | ResetCartAction
  | InitializeCartAction;
export type AuthActionTypes = LoginAction | LogoutAction;

// Type RootState pour combiner tous les états
export interface RootState {
  cart: CartState;
  auth: AuthState;
}

// Types d'état
export interface CartState {
  cartItems: IArticle[];
}

export interface AuthState {
  isLoggedIn: boolean;
}