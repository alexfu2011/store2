import React, { useEffect, useState } from 'react'
import NavBar from '../components/navBar'
import { Button, Col, Row, Form } from 'react-bootstrap'
import Table from '../components/table'
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Typography from '@material-ui/core/Typography';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';

export const OrderDetails = (props) => {
    const order = props.location.state
    const [note, setNote] = useState('')
    const [status, setStatus] = useState(null)
    const [validated, setValidated] = useState(false)
    const orderDetails = {
        margin: "20px",
        marginLeft: "30px",
        backgroundColor: "#fff"
    }
    const saveNote = (value) => {
        setNote(value)
        setValidated(false)
    }
    const update = async () => {
    }
    const setField = (field, value) => {
        if (value === "Cancelled") {
            setStatus({
                ...status,
                [field]: value,
                isCancelled: true
            })
        }
        else if (value === "Completed") {
            setStatus({
                ...status,
                [field]: value,
                isDelivered: true
            })
        }
        else {
            setStatus({
                ...status,
                [field]: value
            })
        }

    };
    
    useEffect(() => {
        setStatus({
            status: order.status
        })
    }, [props]);

    const subcolumn = [
        {
            title: "产品图片", field: '',
            render: rowData => {
                return (<img
                    src={"/"+rowData.product.image}
                    height="100px"
                    width="100px"
                    alt="added_image"
                />)
            }
        },
        { title: "产品名称", field: 'product.name' },
        {
            title: "产品价格", field: '',
            render: rowData => {
                return (<span>{rowData.product.price} 元</span>)
            }
        },
        { title: "产品数量", field: 'quantity' },
        {
            title: "总价", field: '',
            render: rowData => {
                return (<span>{rowData.product.price * rowData.quantity} 元</span>)
            }
        },
        {
            title: "状态", field: 'status',
            render: rowData => {
                return <Form.Control name="status" required as="select" value={rowData.status}>
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
                <Row style={{ width: "100%" }}>
                    <Col xs={9}>
                        <Row>
                            <Col style={orderDetails}>
                                <div style={{ padding: "10px" }}>
                                    <Row><h3>订单详情</h3></Row>
                                    <Row><h4>订单编号：{order.orderID}</h4></Row>
                                    <Row>
                                        <Col style={{ "padding-left": 0 }}>
                                            订单状态
                                            <Form.Control name="status" required as="select" value={order.isActive}>
                                                <option value="">请选择状态</option>
                                                <option value="1">已生效</option>
                                                <option value="2">已取消</option>
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            会员详情
                      <div>
                                                收件人：{order.user.name}<br />
                      地址：{order.user.address}<br />
                      地区：{order.user.province}{order.user.city}<br />
                                            </div>
                                        </Col>
                                        <Col>
                                            配送详情
                      <div>
                                                收件人：{order.profile.person}<br />
                      地址：{order.profile.address}<br />
                      城市：{order.profile.city}<br />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ margin: "20px 20px 0 30px", backgroundColor: "#fff" }}>
                                <h4 className="my-2">产品详情</h4>
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
                                        <Row style={{ height: "1px", backgroundColor: '#000' }}></Row>
                                        <Row>合计:</Row>
                                    </Col>
                                    <Col xs={1}><Row>{order.total}</Row>
                                        <Row>0</Row>
                                        <Row>0</Row>
                                        <Row>- 11</Row>
                                        <Row style={{ height: "1px", backgroundColor: '#000' }}></Row>
                                        <Row>{order.totalPrice}</Row>
                                    </Col>
                                </Row>
                                <Row><div style={{ margin: "10px" }}><Button>退款</Button></div></Row>
                            </Col>
                        </Row>

                    </Col>
                    <Col xs={3}>
                        <Row style={{ margin: "20px 0 0 5px", padding: "10px", backgroundColor: "#fff" }}>
                            <Col><h4>订单操作</h4>
                                <Button style={{ margin: "10px" }} onClick={() => update()}>更新</Button>
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
            }
        </div>
    )
}
export default OrderDetails