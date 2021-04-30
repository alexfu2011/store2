import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaGripVertical, FaShoppingCart, FaTags } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import './navBar.css';

export const NavBar = (props) => {
    return (
        <Navbar bg="primary">
            <Link to='/home'>
                <Button variant="primary">
                    <FaHome size={30} color='white'></FaHome>
                </Button>
            </Link>
            <Link to='/product'>
                <Button variant="primary">
                    <BiPackage size={30} color='white'></BiPackage>产品
                </Button>
            </Link>
            <Link to='/category'>
                <Button variant="primary">
                    <FaGripVertical size={30} color='white'></FaGripVertical>分类
                </Button>
            </Link>
            <Link to='/orders'>
                <Button variant="primary" >
                    <FaShoppingCart size={30} color='white'></FaShoppingCart>订单
                </Button>
            </Link>
        </Navbar>
    );
};

export default NavBar;