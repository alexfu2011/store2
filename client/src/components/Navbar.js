import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { Navbar, Button, Nav } from "react-bootstrap";

class NavBar extends React.Component {
  render() {
    return (
      <Navbar
        bg="light" variant="primary" 
        className="navbar shadow-sm p-3 bg-white rounded"
        expand
      >
        <Button variant="outline-primary" onClick={this.props.toggle}>
          <FontAwesomeIcon icon={faAlignLeft} /> 产品分类
        </Button>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto" navbar>
            <Nav.Link href="/">首页</Nav.Link>
            <Nav.Link href="#">购物车</Nav.Link>
            <Nav.Link href="#">登录</Nav.Link>
            <Nav.Link href="#">退出</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
