import React, { useEffect, useState } from "react"
import { Container, Modal, Form, Button, Col, Row } from "react-bootstrap"
import "./orderForm.css"
import { url, jwt, userId } from "./../constants/auth";

export const OrderFrom = ({ onSave, isEditOrder, data, ...props }) => {
    const [order, setOrder] = useState(null)
    const [isEdit, setIsEdit] = useState(null)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [errorDb, setErrorDb] = useState(false)

    const changeProductStatus = (value) => {
        const newOrder = Object.assign({}, order);
        newOrder.products.map(product => {
            product.status = value;
        });
        setOrder(newOrder);
    }

    const changeStatus = (value) => {
        const newOrder = Object.assign({}, order);
        newOrder.isActive = value;
        setOrder(newOrder);
    }

    const updateOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                _id: order._id,
                cartId: order.cartId,
                products: order.products,
                isActive: order.isActive
            };
            const res = await fetch(url + "/order/update/" + order._id, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                return true;
            } else if (res.status === 400 || res.status === 401) {
                return false;
            }
        } catch (err) {
            if (err) {
                return false;
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateOrder();
        if (res) {
            setSnackBarOpen(true);
            onSave();
        } else {
            setErrorDb(true);
        }
    };

    useEffect(() => {
        if (isEditOrder) {
            setOrder(data);
            setIsEdit(true);
        }
    }, [isEditOrder, data])

    return (
        <div>
            {order &&
                <Modal centered {...props}>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>订单ID：{order._id}</Modal.Header>
                        <Modal.Body>
                            <Row >
                                <Col className="box" >
                                    <Row className="titleHead"><h4>产品明细</h4></Row>
                                    <Row>
                                        <Col>
                                            <h5 className="title">名称</h5>
                                            {order.products.map((item) => <p className="name">{item.product.name}</p>)}
                                        </Col>
                                        <Col>
                                            <h5 className="title">数量</h5>
                                            {order.products.map((item) => <p className="name">{item.quantity}</p> )}
                                        </Col>
                                        <Col>
                                            <h5 className="title">状态</h5>
                                            {order.products.map((item) =>
                                                <Form.Control name="status" required as="select" value={item.status} onChange={e => changeProductStatus(e.target.value)}>
                                                    <option value="">请选择状态</option>
                                                    <option value="not-processed">未处理</option>
                                                    <option value="processing">处理中</option>
                                                    <option value="shipped">已发货</option>
                                                    <option value="delivered">已交货</option>
                                                    <option value="cancelled">已取消</option>
                                                </Form.Control>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row >
                                <Col className="box">
                                    <Row className="titleHead"><h4>订单详情</h4></Row>
                                    <Row>
                                        <Col className="name">订单状态：</Col>
                                        <Col>
                                            <Form.Control name="status" required as="select" value={order.isActive} onChange={e => changeStatus(e.target.value)}>
                                                <option value="">请选择状态</option>
                                                <option value="1">已生效</option>
                                                <option value="2">已取消</option>
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            {errorDb && <p style={{ color: "red" }}>无法{isEdit ? "更新" : "保存"}数据</p>}
                            <Button type="submit">{isEdit ? "更新" : "保存"}</Button>
                            <Button onClick={() => { props.onHide() }}>关闭</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            }
        </div>
    )
}
export default OrderFrom;