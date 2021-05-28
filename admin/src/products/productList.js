import React, { useEffect, useState, useContext } from 'react';
import MaterialTable from 'material-table';
import { Button, Spinner, } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import NavBar from '../components/navBar';
import localization from "../localization";
import ProductForm from "./productForm";
import { useToken } from "../store";
import { getProductList, deleteProduct } from "../services/productService";
import { getToken } from "../services/authService";

export const ProductList = (props) => {
    const [productList, setProductList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [isEditProduct, setIsEditProduct] = useState(false);
    const [product, setProduct] = useState({});
    const [barOpen, setBarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useToken();

    const getProduct = async () => {
        try {
            const data = await getProductList();
            if (data) {
                setLoading(false);
                setProductList(data);
                const token = await getToken();
                dispatch({ type: "SET_TOKEN", payload: token });
            } else {
                throw new Error();
            }
        } catch {
            dispatch({ type: "LOGOUT" });
        }
    };

    const handleClose = () => {
        setBarOpen(false);
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
                    );
                } else {
                    return (
                        <span style={{ color: 'red', fontWeight: "bolder" }}>下架</span>
                    );
                }
            }
        },
    ];

    useEffect(() => {
        getProduct();
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
                                const id = selectedRow._id;
                                const res = await deleteProduct(id);
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

            <Snackbar open={barOpen} message="删除成功" autoHideDuration={3500} onClose={handleClose}>
            </Snackbar>
        </div>
    )
}
export default ProductList