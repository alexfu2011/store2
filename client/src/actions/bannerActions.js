import {
  BANNER_LIST_REQUEST,
  BANNER_LIST_SUCCESS,
  BANNER_LIST_FAIL,
} from "../constants/bannerConstants";

// import axios from "axios";
import axios, * as others from "axios";

export const listBanners = () => async (dispatch) => {
  try {
    dispatch({
      type: BANNER_LIST_REQUEST,
    });

    const { data } = await axios.get("/api/banner");

    dispatch({
      type: BANNER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BANNER_LIST_FAIL,
      payload: error.message,
    });
  }
};
