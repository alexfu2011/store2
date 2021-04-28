import React, { useEffect, useState } from 'react'
import {  Container, Col, Row } from 'react-bootstrap'
import './orderDetails.css'
import { FiTruck } from "react-icons/fi";
import { BiMessageError } from "react-icons/bi";

export const OrderDetails = (props) => {
    const [details, setDetails] = useState([])
    const [products, setProduct] = useState([])
    useEffect(() => {
        if (props.location.state) {
            setDetails(props.location.state)
            setProduct(props.location.state.products)
            console.log(props.location.state)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, [])

    return (
        <div>
            <h2>Order Details</h2>
            <Container >
                {/* 
            <Row>   
                    <Col>
                    <Row><h4>User Details</h4></Row>
                    <Row>
                        <Col>Name</Col>
                        <Col>{details.user.nickName}</Col>
                    </Row>
                    </Col>
                    <Col>
                    <Row><h4> </h4></Row>
                    <Row>
                        <Col>Email</Col>
                        <Col>{details.user.email}</Col>
                    </Row>
                    </Col>
                </Row> */}
                <Row >
                    <Col className='box' >
                        <Row className="titleHead"><h4>Product Details</h4></Row>
                        <Row>
                            <Col>
                                <h5 className="title">Product Name</h5>
                                {products.map((item) => <p>{item.product.name}</p>)}
                            </Col>
                            <Col>
                                <h5 className="title">Quantity</h5>
                                {products.map((item) => <p className="product_quantity">{item.quantity}</p>)}
                            </Col>
                        </Row>
                    </Col>
                    <Col className='box'>
                        <Row className="titleHead"><h4>Price Details</h4></Row>
                        <Row>
                            <Col>Total Price</Col>
                            <Col>{details.totalPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Discount Price</Col>
                            <Col>{details.discountPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Cashback Price</Col>
                            <Col>{details.cashBackPrice}</Col>
                        </Row>
                        <div className="line"></div>
                        <Row >
                            <Col> Grand Total</Col>
                            <Col>{details.totalPrice}</Col>
                        </Row>

                    </Col>
                </Row>
                <Row >
                    <Col className='box'>
                        <Row className="titleHead">
                            <h4>Transaction Details</h4>
                        </Row>
                        <Row >
                            <Col> Amount to be paid </Col>
                            <Col>{details.totalPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Payment Method</Col>
                            <Col>{details.paymentType}</Col>
                        </Row>
                        <Row>
                            <Col>Payment Status</Col>
                            <Col>{details.paymentStatus}</Col>
                        </Row>
                        <Row>
                            <Col>Transaction Provider</Col>
                            <Col>{details.transactionProvider}</Col>
                        </Row>
                    </Col>
                    <Col className='box'>
                        <Row className="titleHead"><h4>Order Details</h4></Row>
                        <Row>
                            <Col>Order Status</Col>
                            <Col>{details.status}</Col>
                        </Row>
                        <Row>
                            <Col>Order Created</Col>
                            <Col>{details.createdAt}</Col>
                        </Row>
                        <Row>
                            <Col>Order Updated</Col>
                            <Col>{details.updatedAt}</Col>
                        </Row>
                        <Row>
                            <Col>Order Cancellation</Col>
                            <Col className={details.isCancelled?"danger":"success"}>{details.isCancelled ? "Cancelled" : "Not Cancelled"}</Col>
                        </Row>
                        <Row>
                            <Col>Order Delivered</Col>
                            <Col className={details.isDelivered?"sucess":"warn"}>{details.isDelivered ? "Delivered" :<div><FiTruck size={30}></FiTruck>
                                 On-Transist</div>}</Col>
                        </Row>
                        <Row>
                            <Col>Push Status</Col>
                            <Col className={details.pushStatus?"success":"warn"}>{details.pushStatus ? "Send" : 
                            <div><BiMessageError size={30}></BiMessageError>Not Send</div>}</Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default OrderDetails