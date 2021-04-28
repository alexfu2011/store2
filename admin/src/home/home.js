import React, { useState, useEffect } from 'react';
import NavBar from './../components/navBar'
import { Col, Row, Spinner } from 'react-bootstrap'
import { FiShoppingCart } from "react-icons/fi";
import { BiPackage } from "react-icons/bi";
import { FaTicketAlt } from "react-icons/fa";
import { getTotalProducts, getActiveProducts } from './../services/productService'
import { getActiveOrders, getTotalOrders } from './../services/orderService'

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
    const getValues = async () => {
        const totalProducts = await getTotalProducts()
        const activeProducts = await getActiveProducts()
        const totalOrder = await getTotalOrders()
        const activeOrder = await getActiveOrders()
        console.log(totalOrder)
        console.log(totalProducts)
        console.log(activeOrder)
        console.log(activeProducts)
        //if(!totalOrder.error && !totalProducts.error && !activeOrder.error && !activeProducts.error){
        setData({
            ...data,
            'TotalProducts': 0,
            'ActiveProducts': [],
            'ActiveOrders': [],
            'TotalOrders': 0,
            'loaded': true
        })
        //}
        //else{
        //    setDbError(true)
        //}

    }
    // const View=()=>{
    //     console.log('-----',data)
    // }
    useEffect(() => {
        getValues()
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, [props])
    return (
        <div className='body'>
            <NavBar props={props}></NavBar>
            {  data.loaded ?
                <div >
                    Loaded
                </div> :
                dbError ?
                    <div style={{ width: '100%', height: '100px', marginTop: '300px' }} >
                        <p style={{
                            display: 'block', marginLeft: 'auto',
                            marginRight: 'auto', textAlign: 'center'
                        }}>
                            服务器出错<br />
                            <a href="/home">请稍后再试。</a>
                        </p>
                    </div>
                    :
                    <div style={{ width: '100%', height: '100px', marginTop: '300px' }} >
                        <Spinner style={{
                            display: 'block', marginLeft: 'auto',
                            marginRight: 'auto', height: '50px', width: '50px'
                        }} animation="border" variant="primary" />
                        <p style={{
                            display: 'block', marginLeft: 'auto',
                            marginRight: 'auto', textAlign: 'center'
                        }}>加载中</p>
                    </div>
            }
        </div>
    )
}
export default Home