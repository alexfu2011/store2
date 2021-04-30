import React, { useEffect, useState, useContext } from 'react';
import MaterialTable from 'material-table'
import { Button, Spinner, } from 'react-bootstrap';
import { getAllProducts, deleteProduct, editProductFormatter } from './../services/productService';
import Snackbar from '@material-ui/core/Snackbar';
import NavBar from '../components/navBar';
import * as axios from 'axios';
import { url, jwt, userId } from './../constants/auth';
import localization from "../localization";

export const Product = (props) => {
    const [products, setProducts] = useState([]);
    const [barOpen, setBarOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(false);

    const getProduct = async () => {
        let res;
        try {
            const token = localStorage.getItem("token");
            fetch(url + '/product/user/60826e0faab69e002b1293d1', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (res.status === 200) {
                    setLoading(false);
                    return res.json();
                } else if (res.status === 401) {
                    setLogin(true);
                }
            }).then(data => {
                setProducts(data);
            });
        }
        catch (error) {
            if (error) {
                setDbError(true);
            }
        }
    }
    const handleClose = () => {
        setBarOpen(false)
    }

    const columns = [
        { title: "产品名称", field: 'name' },
        { title: "品牌", field: 'brand.brandName' },
        { title: "分类", field: 'category.name' },
        //{ title: "Images", field: 'gallery.length' },
        { title: "库存", field: 'variants[0].stock' },
        { title: "价格", field: 'variants[0].price' },
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
        getProduct().then(() => {
            fetch(url + '/auth/token', {
                method: 'POST', credentials: 'include', headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json()).then(data => {
                if (!data.token) {
                    return;
                }
                localStorage.setItem("token", data.token);
            });
        });
    }, []);
    return (
        <div >
            <NavBar {...props}></NavBar>
            {login ?
                <div style={{ width: '100%', height: '100px', marginTop: '300px' }} >
                <p style={{
                    display: 'block', marginLeft: 'auto',
                    marginRight: 'auto', textAlign: 'center'
                }}><a href="/login">重新登陆</a></p>
                </div>
                :
                loading ?
                <div style={{ width: '100%', height: '100px', marginTop: '300px' }} >
                    <Spinner style={{
                        display: 'block', marginLeft: 'auto',
                        marginRight: 'auto', height: '50px', width: '50px'
                    }} animation="border" variant="primary" />
                    <p style={{
                        display: 'block', marginLeft: 'auto',
                        marginRight: 'auto', textAlign: 'center'
                    }}>加载中</p>
                </div>
                :
                <div>
                    <div style={{ margin: '10px 20px' }}>
                        <Button onClick={() => { props.history.push('/product/add') }}>添加产品</Button>
                    </div>
                    <MaterialTable style={{ margin: '15px' }} title="产品列表" data={products} columns={columns}
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: '',
                                onClick: async (event, rowData) => {
                                    const edit = await editProductFormatter(rowData)
                                    console.log("Edit", edit)
                                    props.history.replace({
                                        pathname: '/product/edit',
                                        state: edit
                                    })
                                }
                            },
                        ]}
                        editable={{
                            onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                const id = selectedRow._id
                                console.log(id)
                                const data = await deleteProduct(id)
                                if (data) {
                                    setBarOpen(true)
                                    getProduct()
                                    resolve()
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
            
            <Snackbar open={barOpen} message="Successfully Deleted" autoHideDuration={3500} onClose={handleClose}>

            </Snackbar>
        </div>
    )
}
export default Product