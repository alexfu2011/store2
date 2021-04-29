import React, { useEffect, useState, useContext } from 'react';
import MaterialTable from 'material-table'
import { Button, Spinner, } from 'react-bootstrap';
import { getAllProducts, deleteProduct, editProductFormatter } from './../services/productService';
import Snackbar from '@material-ui/core/Snackbar';
import NavBar from '../components/navBar';
import * as axios from 'axios';
import { url, jwt, userId } from './../constants/auth';

export const Product = (props) => {
    const [product, setProduct] = useState([])
    const [barOpen, setBarOpen] = useState(false)
    const [dbError, setDbError] = useState(false)

    const getProduct = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(url + '/product/user/60826e0faab69e002b1293d1', {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                setProduct(res.data);
            }
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

    const columns = [{ title: "Product ID", field: '_id' },
    { title: "Product Name", field: 'name' },
    { title: "Brand Name", field: 'brand.brandName' },
    { title: 'Model Name', field: "manufactureDetails.modelName" },
    { title: "Category", field: 'category.name' },
    //  {title:"Variants",field:'variants.length'},
    { title: "Images", field: 'gallery.length' },
    { title: "Tags", field: 'tags.length' },
    // {title:"Stock",field:'variants[0].stock'},
    // {title:"Price",field:'variants[0].price'},
    {
        title: "Is Active", field: 'isActive',
        render: rowData => {
            if (rowData.isActive) {
                return (
                    <p style={{ color: 'green', fontWeight: "bolder" }}>Active</p>
                )
            }
            else {
                return (
                    <p style={{ color: 'red', fontWeight: "bolder" }}>InActive</p>
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
                console.log(data);
                if (!data.token) {
                    return;
                }
                console.log(data.token);
                localStorage.setItem("token", data.token);
            });
        });
    }, []);
    return (

        <div >

            <NavBar {...props}></NavBar>


            <div>
                <div style={{ margin: '10px 20px' }}>
                    <Button onClick={() => { props.history.push('/product/add') }}>Add Product</Button>

                </div>
                <MaterialTable style={{ margin: '15px' }} title="Products" data={product} columns={columns}
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Edit User',
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

                >

                </MaterialTable>

            </div>


            <Snackbar open={barOpen} message="Successfully Deleted" autoHideDuration={3500} onClose={handleClose}>

            </Snackbar>
        </div>

    )
}
export default Product