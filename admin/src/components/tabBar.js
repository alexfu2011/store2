import React from 'react';
import { Navbar, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import NavBar from '../components/navBar'
export default function TabBar(props) {

    return (
        <div >
            <NavBar  {...props} />
            <Navbar bg="light">
                <Link to='/orders/totalOrders'>
                    <Button style={{ margin: "20px 10px" }} variant="primary">
                        所有订单
                    </Button>
                </Link>
                <Link to='/orders/activeOrders'>
                    <Button style={{ margin: "20px 10px" }} variant="primary" >有效订单</Button>
                </Link>
                <Link to='/orders/cancelledOrders'>
                    <Button style={{ margin: "20px 10px" }} variant="primary">已取消订单</Button>
                </Link>
            </Navbar>
        </div>
    );
}
