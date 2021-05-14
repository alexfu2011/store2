import React, { useEffect, useState, useContext } from 'react';
import MaterialTable from 'material-table';
import { Button, Spinner, } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import NavBar from '../components/navBar';
import * as axios from 'axios';
import { url, jwt, userId } from './../constants/auth';
import localization from "../localization";
import ProductForm from "./productForm";

export const Product = (props) => {
    const [productList, setProductList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [isEditProduct, setIsEditProduct] = useState(false);
    const [product, setProduct] = useState({});
    const [dbError, setDbError] = useState(false);
    const [barOpen, setBarOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const getToken = () => {
        return new Promise((resolve, reject) => {
            fetch(url + '/auth/token', {
                method: 'POST', credentials: 'include', headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status === 200) {
                    setLoading(false);
                    return res.json();
                } else if (res.status === 400) {
                    setLogin(false);
                    throw new Error("request error");
                } else if (res.status === 401) {
                    setLogin(false);
                    throw new Error("not login");
                } else {
                    setDbError(true);
                    throw new Error("server error");
                }
            }).then(data => {
                if (!data.token) {
                    reject(false);
                    return;
                }
                localStorage.setItem("token", data.token);
                resolve(true);
            }).catch(err => {
                reject(false);
            });
        });
    };

    const deleteProduct = async (productId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = localStorage.getItem("token");
                fetch(url + "/product/delete/" + productId, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else if (res.status === 400) {
                        setLogin(false);
                        throw new Error("request error");
                    } else if (res.status === 401) {
                        setLogin(false);
                        throw new Error("not login");
                    } else {
                        setDbError(true);
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
    };

    const getProduct = () => {
        let res;
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem("token");
            fetch(url + '/product', {
                headers: {
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
                setProductList(data);
                resolve(true);
            }).catch(err => {
                reject(false);
            });
        });
    };

    const handleClose = () => {
        setBarOpen(false)
    }

    const modalOpen = () => {
        setIsEditProduct(false);
        setModalShow(true);
    }
    const modalClose = () => {
        setModalShow(false);
    }
    const onSave = async () => {
        setModalShow(false);
        getProduct();
    }
    const editActive = (data) => {
        setProduct(data);
        setIsEditProduct(true);
        setModalShow(true);
    }

    const columns = [
        { title: "产品名称", field: 'name' },
        { title: "品牌", field: 'brandName' },
        { title: "分类", field: 'category.name' },
        { title: "库存", field: 'stock' },
        { title: "价格", field: 'price' },
        {
            title: "状态", field: 'isActive',
            render: rowData => {
                if (rowData.isActive) {
                    return (
                        <p style={{ color: 'green', fontWeight: "bolder" }}>上架</p>
                    )
                } else {
                    return (
                        <p style={{ color: 'red', fontWeight: "bolder" }}>下架</p>
                    )
                }
            }
        },
    ]
    useEffect(() => {
        getProduct().then(() => getToken());
    }, []);
    return (
        <div >
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
                            <div style={{ margin: '10px 20px' }}>
                                <Button style={{ margin: "10px 30px" }} onClick={() => modalOpen()}>添加产品</Button>
                            </div>
                            <MaterialTable style={{ margin: '15px' }} title="产品列表" data={productList} columns={columns}
                                actions={[
                                    {
                                        icon: "edit",
                                        tooltip: "编辑产品",
                                        onClick: async (event, rowData) => {
                                            editActive(rowData)
                                        }
                                    },
                                ]}
                                editable={{
                                    onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                        const id = selectedRow._id
                                        const res = await deleteProduct(id)
                                        console.log(res);
                                        if (res) {
                                            setBarOpen(true)
                                            getProduct()
                                            resolve();
                                        } else {
                                            reject();
                                        }
                                    }),
                                }}
                                options={{
                                    actionsColumnIndex: -1,
                                    showFirstLastPageButtons: false,
                                    pageSizeOptions: [5, 10, 20, 50]
                                }}
                                localization={localization}
                            >
                            </MaterialTable>
                        </div>
            }

            <ProductForm
                onHide={() => { modalClose() }}
                show={modalShow}
                onSave={onSave}
                isEditProduct={isEditProduct}
                data={product}
            ></ProductForm>

            <Snackbar open={barOpen} message="Successfully Deleted" autoHideDuration={3500} onClose={handleClose}>

            </Snackbar>
        </div>
    )
}
export default Product