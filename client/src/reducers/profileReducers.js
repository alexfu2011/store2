import {
  CART_SAVE_SHIPPING_ADDRESS_REQUEST,
  CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
  CART_SAVE_SHIPPING_ADDRESS_FAIL,
  CART_SHIPPING_ADDRESS_REQUEST,
  CART_SHIPPING_ADDRESS_SUCCESS,
  CART_SHIPPING_ADDRESS_FAIL,
} from "../constants/profileConstants";

export const profileDetailsReducer = (
  state = { profile: {} },
  action
) => {
  switch (action.type) {
    case CART_SAVE_SHIPPING_ADDRESS_REQUEST:
      return { loading: true, profile: {} };
    case CART_SAVE_SHIPPING_ADDRESS_SUCCESS:
      return { loading: false, profile: action.payload }
    case CART_SAVE_SHIPPING_ADDRESS_FAIL:
      return { loading: false, error: action.payload };
    case CART_SHIPPING_ADDRESS_REQUEST:
      return { loading: true, profile: {} };
    case CART_SHIPPING_ADDRESS_SUCCESS:
      console.log(action.payload);
      return { loading: false, profile: action.payload };
    case CART_SHIPPING_ADDRESS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
