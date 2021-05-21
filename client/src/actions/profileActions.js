import axios from "axios";
import {
  CART_SAVE_SHIPPING_ADDRESS_REQUEST,
  CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
  CART_SAVE_SHIPPING_ADDRESS_FAIL,
  CART_SHIPPING_ADDRESS_REQUEST,
  CART_SHIPPING_ADDRESS_SUCCESS,
  CART_SHIPPING_ADDRESS_FAIL,
} from "../constants/profileConstants";

export const getShippingAddress = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_SHIPPING_ADDRESS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/profile`, config);

    dispatch({
      type: CART_SHIPPING_ADDRESS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CART_SHIPPING_ADDRESS_FAIL,
      payload: error.response,
    });
  }
};

export const saveShippingAddress = (data) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS_REQUEST,
      payload: data,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    let res = await axios.post(`/api/profile/save`, data, config);

    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
      payload: res.data,
    });

    localStorage.setItem("shippingAddress", JSON.stringify(data));

    const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    const { products, total } = getCartItems(cartItems);
    axios.post(`/api/cart/add`, { products }, config).then(res => res.data.cartId).then(async cartId => {
      await axios.post(`/api/order/add`, { cartId, total }, config);
    });

  } catch (error) {
    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS_FAIL,
      payload: error.message,
    });
  }
};

const getCartItems = cartItems => {
  const newCartItems = [];
  let total = 0;
  cartItems.map(item => {
      const newItem = {};
      newItem.quantity = item.qty;
      newItem.totalPrice = item.price * item.qty;
      total += newItem.totalPrice;
      newItem.product = item.product;
      newCartItems.push(newItem);
  });

  return { products: newCartItems, total };
};
