import React, { useEffect, useState } from "react"
import NavBar from "../components/navBar"
import { Button, Col, Row, Form } from "react-bootstrap"
import Table from "../components/table"
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Typography from "@material-ui/core/Typography";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import { updateOrder } from "../services/orderService";

export const OrderDetails = (props) => {
    const [order, setOrder] = useState(props.location.state);
    const [note, setNote] = useState("");
    const [status, setStatus] = useState(null);
    const [validated, setValidated] = useState(false);
    const [tax, setTax] = useState(0);
    const [shipping, setShipping] = useState(0);
    const orderDetails = {
        margin: "20px",
        marginLeft: "30px",
        backgroundColor: "#fff"
    };
    
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateOrder(order);
            if (res) {
                props.history.replace("/order");
            } else {
                throw new Error();
            }
        }
        catch {
            localStorage.setItem("token", "");
            props.history.push("/login");
        }
    };

    useEffect(() => {
        const totalTax = order.products.reduce(function (total, i) {
            return total + i.product.tax;
        }, 0);
        setTax(totalTax);
        const totalShipping = order.products.reduce(function (total, i) {
            return total + i.product.shipping;
        }, 0);
        setShipping(totalShipping);
        setStatus({
            status: order.status
        })
    }, [props]);

    const subcolumn = [
        {
            title: "产品图片", field: "",
            render: rowData => {
                return (<img
                    src={"/" + rowData.product.image}
                    height="100px"
                    width="100px"
                    alt="added_image"
                />)
            }
        },
        { title: "产品名称", field: "product.name" },
        {
            title: "产品价格", field: "",
            render: rowData => {
                return (<span>{rowData.product.price} 元</span>)
            }
        },
        { title: "产品数量", field: "quantity" },
        {
            title: "总价", field: "",
            render: rowData => {
                return (<span>{rowData.product.price * rowData.quantity} 元</span>)
            }
        },
        {
            title: "状态", field: "status",
            render: rowData => {
                return <Form.Control name="status" required as="select" value={rowData.status} onChange={e => changeProductStatus(e.target.value)}>
                    <option value="">请选择状态</option>
                    <option value="not-processed">未处理</option>
                    <option value="processing">处理中</option>
                    <option value="shipped">已发货</option>
                    <option value="delivered">已交货</option>
                    <option value="cancelled">已取消</option>
                </Form.Control>;
            }
        }

    ]
    return (
        <div style={{ backgroundColor: "#DFE6F1", minHeight: "100vh" }}>
            <NavBar />
            {status &&
                <Form onSubmit={handleSubmit}>
                    <Row style={{ width: "100%" }}>
                        <Col xs={9}>
                            <Row>
                                <Col style={orderDetails}>
                                    <div style={{ padding: "10px" }}>
                                        <Row><h3>订单详情</h3></Row>
                                        <Row><h4>订单号：{order.orderID}</h4></Row>
                                        <Row>
                                            <Col style={{ paddingLeft: 0 }}>
                                                <strong>订单状态</strong>
                                                <Form.Control name="isActive" required as="select" value={order.isActive} onChange={e => changeStatus(e.target.value)}>
                                                    <option value="">请选择状态</option>
                                                    <option value="1">已生效</option>
                                                    <option value="2">已完成</option>
                                                    <option value="3">已取消</option>
                                                </Form.Control>
                                            </Col>
                                            <Col>
                                                <strong>会员详情</strong>
                                                <div>
                                                    <strong>姓名：</strong>{order.user.name}<br />
                                                    <strong>地址：</strong>{order.user.address}<br />
                                                    <strong>地区：</strong>{order.user.province}{order.user.city}<br />
                                                    <strong>电话：</strong>{order.user.phone}<br />
                                                    <strong>邮箱：</strong>{order.user.email}<br />
                                                </div>
                                            </Col>
                                            <Col>
                                                <strong>配送详情</strong>
                                                <div>
                                                    <strong>收件人：</strong>{order.profile.person}<br />
                                                    <strong>地址：</strong>{order.profile.address}<br />
                                                    <strong>城市：</strong>{order.profile.city}<br /><br />
                                                    <strong>电话：</strong>{order.profile.phone}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ margin: "20px 20px 0 30px", backgroundColor: "#fff" }}>
                                    <Table style={{ margin: "0", padding: "0px", borderBottom: "none" }} data={order.products} columns={subcolumn} options={{
                                        search: false,
                                        toolbar: false,
                                        paging: false,
                                        actionsColumnIndex: -1,
                                        emptyRowsWhenPaging: false,
                                    }} />
                                    <Row style={{ margin: "10px 0 20px 0" }}>
                                        <Col xs={8} />
                                        <Col xs={2}>
                                            <Row>总价:</Row>
                                            <Row>税费:</Row>
                                            <Row>运费:</Row>
                                            <Row>折扣:</Row>
                                            <Row style={{ height: "1px", backgroundColor: "#000" }}></Row>
                                            <Row>合计:</Row>
                                        </Col>
                                        <Col xs={1}><Row>{order.total}</Row>
                                            <Row>{tax}</Row>
                                            <Row>{shipping}</Row>
                                            <Row>- {order.discount.toFixed(2)}</Row>
                                            <Row style={{ height: "1px", backgroundColor: "#000" }}></Row>
                                            <Row>{(order.total + tax + shipping - order.discount).toFixed(2)}</Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={3}>
                            <Row style={{ margin: "20px 0 0 5px", padding: "10px", backgroundColor: "#fff" }}>
                                <Col><h4>订单操作</h4>
                                    <Button type="submit" style={{ margin: "10px" }}>更新</Button>
                                    <Button style={{ margin: "10px" }} onClick={() => { props.history.replace("/order") }}>返回</Button><br />
                                </Col>
                            </Row>
                            <Row style={{ margin: "20px 0 0 5px", padding: "10px", backgroundColor: "#fff" }}>
                                <Col>
                                    <h4>订单记录</h4>
                                    <Row>
                                        <Timeline>
                                        </Timeline>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            }
        </div>
    )
}
export default OrderDetails;
