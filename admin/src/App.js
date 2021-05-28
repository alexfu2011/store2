import "./App.css";
import LoginPage from "./auth/login";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom"
import { Home } from "./home/home";
import { ProductList } from "./products/productList";
import { OrderList } from "./orders/orderList";
import { OrderDetails } from "./orders/orderDetails";
import { CategoryList } from "./category/categoryList";
import { DiscountList } from "./discount/discountList";
import { UserList } from "./user/userList";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { url } from "./constants/auth";
import React, { useEffect, useState } from "react";
import { TokenProivder, useToken } from "./store";
import { getToken } from "./services/authService";

const SecuredRoute = (props) => {
  const { state, dispatch } = useToken();

  useEffect(() => {
  }, []);

  return (
    <Route path={props.path} render={(data) => localStorage.getItem('token') ?
      <props.component {...data}></props.component> :
      <Redirect to={{ pathname: "/login" }}></Redirect>
    }></Route>
  );
}

function App() {
  return (
    <TokenProivder>
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/login" component={LoginPage} />
          <Route path="/login" component={LoginPage} />
          <SecuredRoute exact path="/home" component={Home} />
          <SecuredRoute exact path="/product" component={ProductList} />
          <SecuredRoute exact path="/order(/:isActive)?" component={OrderList} />
          <SecuredRoute exact path="/category" component={CategoryList} />
          <SecuredRoute exact path="/discount" component={DiscountList} />
          <SecuredRoute exact path="/user" component={UserList} />
          <SecuredRoute exact path='/order/orderDetails' component={OrderDetails} />
        </Switch>
      </BrowserRouter>
    </TokenProivder>
  );
}

export default App;
