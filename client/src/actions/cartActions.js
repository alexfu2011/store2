import axios from "axios";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS_REQUEST,
  CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
  CART_SAVE_SHIPPING_ADDRESS_FAIL,
  CART_SHIPPING_ADDRESS_REQUEST,
  CART_SHIPPING_ADDRESS_SUCCESS,
  CART_SHIPPING_ADDRESS_FAIL,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE,
} from "../constants/cartConstants";


export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/product/id/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      stock: data.stock,
      qty,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

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

    const res = await axios.post(`/api/profile/save`, data, config);

    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS_SUCCESS,
      payload: data,
    });

    localStorage.setItem("shippingAddress", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS_FAIL,
      payload: error.message,
    });
  }
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

export const saveCart = () => (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  const { products, total } = getCartItems(cartItems);
  const code = localStorage.getItem("code");

  axios.post(`/api/cart/add`, { products }, config).then(res => res.data.cartId).then(async cartId => {
    const res = await axios.post(`/api/order/add`, { cartId, total, code }, config);
    console.log(res);
    dispatch({
      type: CART_SAVE,
      payload: res.data.order.orderID,
    });
  });
  
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
