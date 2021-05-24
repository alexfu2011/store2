import React, { useEffect, useState } from "react"
import { Button, Spinner } from "react-bootstrap"
import Snackbar from "@material-ui/core/Snackbar"
import MaterialTable from "material-table"
import NavBar from "../components/navBar"
import { url, jwt, userId } from "./../constants/auth";
import OrderDetails from "./orderDetails"
import localization from "../localization";
import { getLocalTime } from "../utils/time";
import { TokenProivder, useToken } from "../store";

export const OrderList = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isEditOrder, setIsEditOrder] = useState(false);
    const [order, setOrder] = useState([]);
    const [dbError, setDbError] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useToken();

    const getAllOrders = () => {
        return new Promise((resolve, reject) => {
            try {
                const token = localStorage.getItem("token");
                fetch(url + "/order", {
                    headers: {
                        method: "GET",
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        throw new Error();
                    }
                }).then(data => {
                    if (data) {
                        resolve(data.orders);
                    } else {
                        reject(false);
                    }
                }).catch(e => {
                    reject(false);
                });
            } catch (err) {
                reject(false);
            }
        });
    };

    const getOrders = async () => {
        const data = await getAllOrders()
        if (data) {
            setLoading(false);
            setOrders(data);
        }
        else {
            dispatch({ type: "LOGOUT" });
        }
    };

    const modalOpen = () => {
        setModalShow(true);
    }

    const modalClose = () => {
        setModalShow(false);
    }

    const editOrder = (data) => {
        console.log(data);
        setOrder(data);
        setIsEditOrder(true);
        setModalShow(true);
    }

    const onSave = async () => {
        setModalShow(false);
        getOrders();
    }

    const handleCloseSnack = () => {
        setSnackBarOpen(false);
    };
    const columns = [
        { title: "订单ID", field: "_id" },
        { title: "总价", field: "total" },
        {
            title: "创建时间", field: "created",
            render: rowData => {
                return getLocalTime(rowData.created);
            }
        },
        {
            title: "状态", field: "isActive",
            render: rowData => {
                if (rowData.isActive == 1) {
                    return (
                        <span style={{ color: "green", fontWeight: "bolder" }}>已生效</span>
                    )
                } else {
                    return (
                        <span style={{ color: "red", fontWeight: "bolder" }}>已取消</span>
                    )
                }
            }
        }
    ];

    useEffect(() => {
        getOrders();
    }, []);

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
                    <MaterialTable style={{ marginTop: "15px" }} title="订单列表" data={orders}
                        columns={columns}
                        actions={[
                            {
                                icon: "edit",
                                tooltip: "edit",
                                onClick: async (event, rowData) => {
                                    editOrder(rowData)
                                }
                            },
                        ]}
                        options={{
                            actionsColumnIndex: -1,
                            showFirstLastPageButtons: false,
                            pageSizeOptions: [5, 10, 20, 50]
                        }}
                        localization={localization}
                    >
                    </MaterialTable>
                    <OrderDetails
                        onHide={() => { modalClose() }}
                        show={modalShow}
                        onSave={onSave}
                        isEditOrder={isEditOrder}
                        data={order}
                    ></OrderDetails>
                    <Snackbar open={snackBarOpen} message="Successfully Deleted"
                        autoHideDuration={3500} onClose={handleCloseSnack}>
                    </Snackbar>
                </div>
            }
        </div>
    )
}
export default OrderList