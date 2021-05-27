import React, { useEffect, useState } from "react"
import { Button, Spinner } from "react-bootstrap"
import Snackbar from "@material-ui/core/Snackbar"
import MaterialTable from "material-table"
import NavBar from "../components/navBar"
import { url, jwt, userId } from "./../constants/auth";
import OrderForm from "./orderForm"
import localization from "../localization";
import { TokenProivder, useToken } from "../store";
import { getAllOrders } from "../services/orderService";
import dateFormat from 'dateformat';
import TabBar from '../components/tabBar';
import { getToken } from "../services/authService";

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

    const getOrders = async () => {
        try {
            const data = await getAllOrders();
            if (data) {
                setLoading(false);
                setOrders(data);
            } else {
                throw new Error();
            }
        } catch {
            dispatch({ type: "LOGOUT" });
        }
    };

    const modalOpen = () => {
        setModalShow(true);
    };

    const modalClose = () => {
        setModalShow(false);
    };

    const editOrder = (data) => {
        console.log(data);
        setOrder(data);
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
            title: "订单ID", field: "_id",
            render: rowData => {
                return (
                    <Button variant="link" onClick={() => {
                        props.history.replace({
                            pathname: '/order/orderDetails',
                            state: rowData
                        })
                    }}>{rowData._id}</Button>
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
        getOrders().then(() => {
            getToken().then(token => {
                dispatch({ type: "SET_TOKEN", payload: token });
            }).catch(() => {
                dispatch({ type: "LOGOUT" });
            });
        });
    }, []);

    return (
        <div>
            <TabBar></TabBar>
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
                            rowData => ({
                                disabled: rowData.isActive == 2,
                                icon: 'settings',
                                onClick: async (event, rowData) => {
                                    editOrder(rowData)
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
                    <Snackbar open={snackBarOpen} message="Successfully Deleted"
                        autoHideDuration={3500} onClose={handleCloseSnack}>
                    </Snackbar>
                </div>
            }
        </div>
    )
}
export default OrderList