import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import Snackbar from "@material-ui/core/Snackbar";
import MaterialTable from "material-table";
import OrderForm from "./orderForm";
import localization from "../localization";
import { getAllOrders } from "../services/orderService";
import dateFormat from 'dateformat';
import NavBar from '../components/navBar';
import { getToken } from "../services/authService";

export const OrderList = (props) => {
    const { page } = props.match.params;
    const [modalShow, setModalShow] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isEditOrder, setIsEditOrder] = useState(false);
    const [order, setOrder] = useState([]);
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [loading, setLoading] = useState(true);

    const getOrders = async (order) => {
        try {
            const data = await getAllOrders(order);
            if (data) {
                setLoading(false);
                setOrders(data);
                const token = await getToken();
                localStorage.setItem("token", token);
            } else {
                throw new Error();
            }
        } catch {
            localStorage.setItem("token", "");
            props.history.push("/login");
        }
    };

    const modalOpen = () => {
        setModalShow(true);
    };

    const modalClose = () => {
        setModalShow(false);
    };

    const editOrder = (data) => {
        setOrder(Object.assign({}, data));
        setIsEditOrder(true);
        setModalShow(true);
    };

    const onSave = async () => {
        setModalShow(false);
        getOrders();
    };

    const handleCloseSnack = () => {
        setSnackBarOpen(false);
    };

    const columns = [
        {
            title: "订单ID", field: "orderID",
            render: rowData => {
                return (
                    <Button variant="link" onClick={() => {
                        props.history.replace({
                            pathname: '/order/order/detail',
                            state: rowData
                        })
                    }}>{rowData.orderID}</Button>
                )
            }
        },
        { title: "总价", field: "total" },
        {
            title: "创建时间", field: "created",
            render: rowData => {
                return dateFormat(rowData.created, "yyyy-mm-dd hh:mm:ss");
            }
        },
        {
            title: "状态", field: "status",
            render: rowData => {
                if (rowData.status == "not-processed") {
                    return (
                        <span style={{ color: "green", fontWeight: "bolder" }}>未处理</span>
                    );
                } else if (rowData.status == "processing") {
                    return (
                        <span style={{ color: "green", fontWeight: "bolder" }}>处理中</span>
                    );
                } else if (rowData.status == "shipped") {
                    return (
                        <span style={{ color: "green", fontWeight: "bolder" }}>已发货</span>
                    );
                } else if (rowData.status == "delivered") {
                    return (
                        <span style={{ color: "green", fontWeight: "bolder" }}>已交货</span>
                    );
                } else {
                    return (
                        <span style={{ color: "red", fontWeight: "bolder" }}>已取消</span>
                    );
                }
            }
        }
    ];

    useEffect(() => {
        getOrders(page ? page : "all");
    }, [page]);

    return (
        <div>
            <NavBar></NavBar>
            {loading ?
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
                <div>
                    <Link to="/order/all">
                        <Button style={{ margin: "20px 10px" }} variant="primary">所有订单</Button>
                    </Link>
                    <Link to="/order/active">
                        <Button style={{ margin: "20px 10px" }} variant="primary" >有效订单</Button>
                    </Link>
                    <Link to="/order/cancelled">
                        <Button style={{ margin: "20px 10px" }} variant="primary">已取消订单</Button>
                    </Link>
                    <MaterialTable title="订单列表" data={orders}
                        columns={columns}
                        actions={[
                            rowData => ({
                                disabled: rowData.isActive == 2,
                                icon: 'settings',
                                onClick: async (event, rowData) => {
                                    editOrder(rowData);
                                }
                            }),
                        ]}
                        options={{
                            actionsColumnIndex: -1,
                            showFirstLastPageButtons: false,
                            pageSizeOptions: [5, 10, 20, 50]
                        }}
                        localization={localization}
                    >
                    </MaterialTable>
                    <OrderForm
                        onHide={() => { modalClose() }}
                        show={modalShow}
                        onSave={onSave}
                        isEditOrder={isEditOrder}
                        data={order}
                    ></OrderForm>
                    <Snackbar open={snackBarOpen} message="删除成功"
                        autoHideDuration={3500} onClose={handleCloseSnack}>
                    </Snackbar>
                </div>
            }
        </div>
    );
};

export default OrderList;