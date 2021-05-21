import React from "react";
import classNames from "classnames";
import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import CartScreen from "../screens/CartScreen";
import ProductScreen from "../screens/ProductScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ShippingScreen from "../screens/ShippingScreen";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./Navbar";

class Content extends React.Component {
  render() {
    return (
      <Router>
        <Container
          fluid
          className={classNames("content", { "is-open": this.props.isOpen })}
        >
          <NavBar toggle={this.props.toggle} />
          <Route path='/' component={HomeScreen} exact />
          <Route path='/category/:id' component={CategoryScreen} exact />
          <Route path='/product/:id' component={ProductScreen} />
          <Route path='/cart/:id?' component={CartScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/shipping' component={ShippingScreen} />
        </Container>
      </Router>
    );
  }
}

export default Content;
