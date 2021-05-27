import React, { useState, useEffect } from "react"
import MaterialTable from "material-table"
import { Button, Spinner } from "react-bootstrap"
import "./discountList.css"
import DiscountForm from "./discountForm"
import Snackbar from "@material-ui/core/Snackbar"
import NavBar from "./../components/navBar"
import { url, jwt, userId } from "./../constants/auth";
import localization from "../localization";
import { TokenProivder, useToken } from "../store";
import { getDiscountList } from "../services/discountService";
import dateFormat from 'dateformat';
import { getToken } from "../services/authService";

export const DiscountList = (props) => {
    const [discountList, setDiscountList] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [isEditDiscount, setIsEditDiscount] = useState(false)
    const [discount, setDiscount] = useState({})
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useToken();

    const getDiscount = async () => {
        try {
            const data = await getDiscountList();
            if (data) {
                setLoading(false);
                setDiscountList(data);
            } else {
                throw new Error();
            }
        } catch {
            dispatch({ type: "LOGOUT" });
        }
    };

    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    }
    const columns = [
        { title: "折扣码", field: "code" },
        { title: "折扣比率", field: "percentage" },
        { title: "折扣数量", field: "quantity" },
        {
            title: "开始日期", field: "from",
            render: rowData => {
                return dateFormat(rowData.from, "yyyy-mm-dd")
            }
        },
        {
            title: "结束日期", field: "to",
            render: rowData => {
                return dateFormat(rowData.to, "yyyy-mm-dd")
            }
        },
        {
            title: "状态", field: "isActive",
            render: rowData => {
                if (rowData.isActive == 1) {
                    return (
                        <span style={{ color: "green", fontWeight: "bolder" }}>有效</span>
                    )
                } else {
                    return (
                        <span style={{ color: "red", fontWeight: "bolder" }}>无效</span>
                    )
                }
            }
        }
    ];

    const modalOpen = () => {
        setIsEditDiscount(false);
        setModalShow(true);
    }
    const modalClose = () => {
        setModalShow(false);
    }
    const onSave = async () => {
        setModalShow(false);
        getDiscount();
    }
    const editActive = (data) => {
        setDiscount(data);
        setIsEditDiscount(true);
        setModalShow(true);
    }

    const deleteDiscount = async (discountId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = localStorage.getItem("token");
                fetch(url + "/discount/delete/" + discountId, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else if (res.status === 400) {
                        throw new Error("request error");
                    } else if (res.status === 401) {
                        throw new Error("not login");
                    } else {
                        throw new Error("server error");
                    }
                }).then(data => {
                    if (!data.error) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }).catch(err => {
                    reject(false);
                });
            } catch (error) {
                if (error) {
                    reject(false);
                }
            }
        });
    }

    useEffect(() => {
        getDiscount().then(() => {
            getToken().then(token => {
                dispatch({ type: "SET_TOKEN", payload: token });
            }).catch(() => {
                dispatch({ type: "LOGOUT" });
            });
        });
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
                    <Button style={{ margin: "30px" }} onClick={() => modalOpen()}>添加折扣</Button>
                    <MaterialTable title="折扣列表" data={discountList}
                        columns={columns}
                        actions={[
                            {
                                icon: "edit",
                                tooltip: "编辑折扣",
                                onClick: async (event, rowData) => {
                                    editActive(rowData)
                                }
                            },
                        ]}
                        editable={{
                            onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                const id = selectedRow._id
                                const res = await deleteDiscount(id)
                                if (res) {
                                    setSnackBarOpen(true)
                                    getDiscount()
                                    resolve();
                                } else {
                                    reject();
                                }
                            }),
                        }}
                        options={{
                            actionsColumnIndex: -1,
                            showFirstLastPageButtons: false,
                            pageSizeOptions: [5, 10, 20, 50],
                            detailPanelColumnAlignment: "right"
                        }}
                        localization={localization}
                    >
                    </MaterialTable>
                </div>
            }

            <DiscountForm
                onHide={() => { modalClose() }}
                show={modalShow}
                onSave={onSave}
                isEditDiscount={isEditDiscount}
                data={discount}
            ></DiscountForm>

            <Snackbar open={snackBarOpen} message="删除成功"
                autoHideDuration={3500} onClose={handleCloseSnack}>
            </Snackbar>
        </div>
    )
}
export default DiscountList;