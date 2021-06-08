import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
} from "react-bootstrap";
import { logout } from "../actions/userActions";
import { listOrders } from "../actions/orderAction";
import Message from "../components/Message";
import Loader from "../components/Loader";

const OrderScreen = ({ match, location, history }) => {

  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);

  const { loading, error, orders } = orderList;

  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='info'>请重新 <a href="#" onClick={logoutHandler}>登录</a></Message>
      ) : (
        <>
          {orders &&
            orders.map((order) => (
              <div>
                <h3>订单号：{order.orderID}</h3>
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>产品名称</th>
                      <th>产品数量</th>
                      <th>产品价格</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product) => (
                      <tr>
                        <td>{product.product.name}</td>
                        <td>{product.quantity}</td>
                        <td>{product.totalPrice}</td>
                        <td>{(() => {
                          switch (product.status) {
                            case "not-processed":
                              return "未处理";
                          }
                        })()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default OrderScreen;
