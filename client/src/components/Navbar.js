import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Button, Nav } from "react-bootstrap";
import { logout } from "../actions/userActions";

const NavBar = (props) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <Navbar
      bg="light" variant="primary"
      className="navbar shadow-sm p-3 bg-white rounded"
      expand
    >
      <Button variant="outline-primary" onClick={props.toggle}>
        <FontAwesomeIcon icon={faAlignLeft} /> 产品分类
        </Button>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto" navbar>
          <Nav.Link href="/">首页</Nav.Link>
          {userInfo ? <>
          <Nav.Link href="/cart">购物车</Nav.Link>
          <Nav.Link onClick={logoutHandler}>退出</Nav.Link>
          </> :
          <Nav.Link href="/login">登录</Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
