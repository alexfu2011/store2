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
  } catch (error) {
    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS_FAIL,
      payload: error.message,
    });
  }
};
