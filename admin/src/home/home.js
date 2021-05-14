import React, { useState, useEffect } from 'react';
import NavBar from './../components/navBar'
import { Col, Row, Spinner } from 'react-bootstrap'
import { FiShoppingCart } from "react-icons/fi";
import { BiPackage } from "react-icons/bi";
import { FaTicketAlt } from "react-icons/fa";

import './home.css'
export const Home = (props) => {
    const [data, setData] = useState({
        'TotalProducts': 0,
        'ActiveProducts': 0,
        'ActiveOrders': 0,
        'TotalOrders': 0,
        'loaded': false
    })
    const [dbError, setDbError] = useState(false)
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const getValues = async () => {
        setLoading(false);
    }

    useEffect(() => {
        getValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, [props])
    return (
        <div>
            <NavBar props={props}></NavBar>
            {dbError ?
                <div style={{ width: "100%", height: "100px", marginTop: "300px" }} >
                    <p style={{
                        display: "block", marginLeft: "auto",
                        marginRight: "auto", textAlign: "center"
                    }}>服务器宕机</p>
                </div>
                :
                login ?
                    <div style={{ width: "100%", height: "100px", marginTop: "300px" }} >
                        <p style={{
                            display: "block", marginLeft: "auto",
                            marginRight: "auto", textAlign: "center"
                        }}><a href="/login">重新登陆</a></p>
                    </div>
                    :
                    loading ?
                        <div style={{ width: "100%", height: "100px", marginTop: "300px" }} >
                            <Spinner style={{
                                display: "block", marginLeft: "auto",
                                marginRight: "auto", height: "50px", width: "50px"
                            }} animation="border" variant="primary" />
                            <p style={{
                                display: "block", marginLeft: "auto",
                                marginRight: "auto", textAlign: "center"
                            }}>加载中</p>
                        </div>
                        :
                        <div></div>
            }
        </div>
    )
}
export default Home