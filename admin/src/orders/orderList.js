import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import Snackbar from '@material-ui/core/Snackbar'
import MaterialTable from 'material-table'
import NavBar from '../components/navBar'
import { url, jwt, userId } from './../constants/auth';
import OrderDetails from './orderDetails'
import localization from "../localization";

export const OrderList = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isEditOrder, setIsEditOrder] = useState(false);
    const [order, setOrder] = useState([]);
    const [dbError, setDbError] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const getAllOrders = () => {
        let res;
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem("token");
            fetch(url + '/order', {
                headers: {
                    method: 'GET',
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (res.status === 200) {
                    setLoading(false);
                    return res.json();
                } else if (res.status === 400) {
                    setLogin(true);
                    throw new Error("request error");
                } else if (res.status === 401) {
                    setLogin(true);
                    throw new Error("not login");
                } else {
                    setDbError(true);
                    throw new Error("server error");
                }
            }).then(data => {
                resolve(data.orders);
            }).catch(err => {
                reject(false);
            });
        });
    };

    const getOrders = async () => {
        const data = await getAllOrders()
        if (data) {
            console.log(data);
            setOrders(data)
        }
        else {
            setDbError(true)
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

    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    };
    const columns = [
        { title: "订单ID", field: '_id' },
        { title: "总价", field: 'total' },
        { title: "创建时间", field: 'created',
    render: rowData => {
        return new Date(rowData.created).toDateString();
    } },
        {
            title: "状态", field: 'isActive',
            render: rowData => {
                if (rowData.isActive) {
                    return (
                        <p style={{ color: 'green', fontWeight: "bolder" }}>已生效</p>
                    )
                } else {
                    return (
                        <p style={{ color: 'red', fontWeight: "bolder" }}>已取消</p>
                    )
                }
            }
        }
    ];

    useEffect(() => {
        getOrders()
    }, [props]);

    return (
        <div>
            <NavBar></NavBar>
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
                        <div>
                            <MaterialTable style={{ marginTop: '15px' }} title='订单列表' data={orders}
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
                                //onSave={onSave}
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