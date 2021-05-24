import "./App.css";
import LoginPage from "./auth/login";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom"
import { Home } from "./home/home";
import { Product } from "./products/product";
import { OrderList } from "./orders/orderList"
import CategoryList from "./category/categoryList";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { url } from "./constants/auth";
import React, { useEffect, useState } from "react";
import { TokenProivder, useToken } from "./store";

const SecuredRoute = (props) => {
  const [res, setRes] = useState(true);
  const { state, dispatch } = useToken();

  const getToken = () => {
    return new Promise((resolve, reject) => {
      try {
        fetch(url + "/auth/token", {
          method: "POST", credentials: "include", headers: {
            "Content-Type": "application/json",
          }
        }).then(res => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error();
          }
        }).then(data => {
          if (!data.token) {
            reject(false);
          } else {
            localStorage.setItem("token", data.token);
            resolve(true);
          }
        }).catch(err => {
          console.log(err);
          reject(false);
        });
      } catch (err) {
        console.log(err);
        reject(false);
      }
    });
  }

  useEffect(() => {
    getToken().then((res) => setRes(res)).catch((err) => {
      dispatch({ type: "LOGOUT" });
      setRes(false);
    });
  }, []);

  return (
    <Route path={props.path} render={(data) => res ?
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
          <SecuredRoute exact path="/product" component={Product} />
          <SecuredRoute exact path="/order" component={OrderList} />
          <SecuredRoute exact path="/category" component={CategoryList} />
        </Switch>
      </BrowserRouter>
    </TokenProivder>
  );
}

export default App;
