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
import dateFormat from "dateformat";

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
            title: "????????????", field: "",
            render: rowData => {
                return (<img
                    src={"/" + rowData.product.image}
                    height="100px"
                    width="100px"
                    alt="added_image"
                />)
            }
        },
        { title: "????????????", field: "product.name" },
        {
            title: "????????????", field: "",
            render: rowData => {
                return (<span>{rowData.product.price} ???</span>)
            }
        },
        { title: "????????????", field: "quantity" },
        {
            title: "??????", field: "",
            render: rowData => {
                return (<span>{rowData.product.price * rowData.quantity} ???</span>)
            }
        },
        {
            title: "??????", field: "status",
            render: rowData => {
                return <Form.Control name="status" required as="select" value={rowData.status} onChange={e => changeProductStatus(e.target.value)}>
                    <option value="">???????????????</option>
                    <option value="not-processed">?????????</option>
                    <option value="processing">?????????</option>
                    <option value="shipped">?????????</option>
                    <option value="delivered">?????????</option>
                    <option value="cancelled">?????????</option>
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
                                        <Row><h3>????????????</h3></Row>
                                        <Row><h4>????????????{order.orderID}</h4></Row>
                                        <Row>
                                            <Col style={{ paddingLeft: 0 }}>
                                                <strong>????????????</strong>
                                                <Form.Control name="isActive" required as="select" value={order.isActive} onChange={e => changeStatus(e.target.value)}>
                                                    <option value="">???????????????</option>
                                                    <option value="1">?????????</option>
                                                    <option value="2">?????????</option>
                                                    <option value="3">?????????</option>
                                                </Form.Control>
                                            </Col>
                                            <Col>
                                                <strong>????????????</strong>
                                                <div>
                                                    <strong>?????????</strong>{order.user.name}<br />
                                                    <strong>?????????</strong>{order.user.address}<br />
                                                    <strong>?????????</strong>{order.user.province}{order.user.city}<br />
                                                    <strong>?????????</strong>{order.user.phone}<br />
                                                    <strong>?????????</strong>{order.user.email}<br />
                                                </div>
                                            </Col>
                                            <Col>
                                                <strong>????????????</strong>
                                                <div>
                                                    <strong>????????????</strong>{order.profile.person}<br />
                                                    <strong>?????????</strong>{order.profile.address}<br />
                                                    <strong>?????????</strong>{order.profile.city}<br /><br />
                                                    <strong>?????????</strong>{order.profile.phone}
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
                                            <Row>??????:</Row>
                                            <Row>??????:</Row>
                                            <Row>??????:</Row>
                                            <Row>??????:</Row>
                                            <Row style={{ height: "1px", backgroundColor: "#000" }}></Row>
                                            <Row>??????:</Row>
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
                                <Col><h4>????????????</h4>
                                    <Button type="submit" style={{ margin: "10px" }}>??????</Button>
                                    <Button style={{ margin: "10px" }} onClick={() => { props.history.replace("/order") }}>??????</Button><br />
                                </Col>
                            </Row>
                            <Row style={{ margin: "20px 0 0 5px", padding: "10px", backgroundColor: "#fff" }}>
                                <Col>
                                    <h4>????????????</h4>
                                    <Row>
                                        <Timeline>
                                            {order.logs.map((result) =>
                                                <TimelineItem>
                                                    <TimelineOppositeContent>
                                                        <Typography>{dateFormat(result.created, "yyyy-mm-dd hh:mm:ss")}</Typography>
                                                    </TimelineOppositeContent>
                                                    <TimelineSeparator>
                                                        <TimelineDot variant="outlined" color="primary" />
                                                        <TimelineConnector />
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Typography>{(() => {
                                                            switch (result.status) {
                                                                case 1:
                                                                    return <span style={{ color: 'green', fontWeight: "bolder" }}>?????????</span>;
                                                                case 2:
                                                                    return <span style={{ color: 'gray', fontWeight: "bolder" }}>?????????</span>;
                                                                case 3:
                                                                    return <span style={{ color: 'red', fontWeight: "bolder" }}>?????????</span>;
                                                            }
                                                        }
                                                        )()}</Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                            )}
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
