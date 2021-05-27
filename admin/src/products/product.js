import React, { useEffect, useState, useContext } from 'react';
import MaterialTable from 'material-table';
import { Button, Spinner, } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import NavBar from '../components/navBar';
import * as axios from 'axios';
import { url, jwt, userId } from './../constants/auth';
import localization from "../localization";
import ProductForm from "./productForm";
import { TokenProivder, useToken } from "../store";
import { getProductList } from "../services/productService";
import { getToken } from "../services/authService";

export const Product = (props) => {
    const [productList, setProductList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [isEditProduct, setIsEditProduct] = useState(false);
    const [product, setProduct] = useState({});
    const [barOpen, setBarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useToken();

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
    };

    const getProduct = async () => {
        try {
            const data = await getProductList();
            if (data) {
                setLoading(false);
                setProductList(data);
            } else {
                throw new Error();
            }
        } catch {
            dispatch({ type: "LOGOUT" });
        }
    };

    const handleClose = () => {
        setBarOpen(false)
    };

    const modalOpen = () => {
        setIsEditProduct(false);
        setModalShow(true);
    };

    const modalClose = () => {
        setModalShow(false);
    };

    const onSave = async () => {
        setModalShow(false);
        getProduct();
    };

    const editActive = (data) => {
        setProduct(data);
        setIsEditProduct(true);
        setModalShow(true);
    };

    const columns = [
        { title: "产品名称", field: 'name' },
        { title: "品牌", field: 'brandName' },
        { title: "分类", field: 'category.name' },
        { title: "库存", field: 'stock' },
        { title: "价格", field: 'price' },
        {
            title: "状态", field: 'isActive',
            render: rowData => {
                if (rowData.isActive == 1) {
                    return (
                        <span style={{ color: 'green', fontWeight: "bolder" }}>上架</span>
                    )
                } else {
                    return (
                        <span style={{ color: 'red', fontWeight: "bolder" }}>下架</span>
                    )
                }
            }
        },
    ];

    useEffect(() => {
        getProduct().then(() => {
            getToken().then(token => {
                dispatch({ type: "SET_TOKEN", payload: token });
            }).catch(() => {
                dispatch({ type: "LOGOUT" });
            });
        });
    }, []);

    return (
        <div >
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
                    <Button style={{ margin: "20px" }} onClick={() => modalOpen()}>添加产品</Button>
                    <MaterialTable style={{ margin: '15px' }} title="产品列表" data={productList} columns={columns}
                        actions={[
                            {
                                icon: "edit",
                                tooltip: "编辑产品",
                                onClick: async (event, rowData) => {
                                    editActive(rowData);
                                }
                            },
                        ]}
                        editable={{
                            onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                const id = selectedRow._id
                                const res = await deleteProduct(id)
                                console.log(res);
                                if (res) {
                                    setBarOpen(true);
                                    getProduct();
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