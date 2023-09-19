import { IArticle } from "../@types/article";
import { LoginAction, LogoutAction } from "./types";
import {
  AddToCartAction,
  RemoveItemAction,
  DecreaseQuantityAction,
  IncreaseQuantityAction,
  ResetCartAction
} from './types';

// Types des actions
export const ADD_TO_CART = 'ADD_TO_CART';
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const INCREASE_QUANTITY = "INCREASE_QUANTITY";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const RESET_CART = 'RESET_CART';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const addToCartAction = (article: IArticle): AddToCartAction => {
  return {
    type: ADD_TO_CART,
    payload: article,
  };
};

export const removeItemAction = (article: IArticle): RemoveItemAction => {
  return {
    type: REMOVE_ITEM,
    payload: article,
  };
};

export const decreaseQuantityAction = (article: IArticle): DecreaseQuantityAction => {
  return {
    type: DECREASE_QUANTITY,
    payload: article,
  };
};

export const increaseQuantityAction = (article: IArticle): IncreaseQuantityAction => {
  return {
    type: INCREASE_QUANTITY,
    payload: article,
  };
};

export const resetCartAction = (): ResetCartAction => {
  return {
    type: RESET_CART,
  };
};

export const loginAction = (): LoginAction => {
  return {
    type: LOGIN,
  };
};

export const logoutAction = (): LogoutAction => {
  return {
    type: LOGOUT,
  };
};

export type CartActionTypes =
  | AddToCartAction
  | DecreaseQuantityAction
  | IncreaseQuantityAction
  | RemoveItemAction
  | ResetCartAction;

export type AuthActionTypes = LoginAction | LogoutAction;