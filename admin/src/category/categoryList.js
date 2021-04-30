import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { getAllCategory, deleteCategory, deleteSubCategory } from './../services/categoryService'
import { Button, Spinner } from 'react-bootstrap'
import './categoryList.css'
import CategoryForm from './categoryForm'
import Snackbar from '@material-ui/core/Snackbar'
import NavBar from './../components/navBar'
import { url, jwt, userId } from './../constants/auth';
import localization from "../localization";

export const CategoryList = (props) => {
    const [categoryList, setCategoryList] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [isEditCategory, setIsEditCategory] = useState(false)
    const [editCategory, setEditCategory] = useState([])
    const [dbError, setDbError] = useState(false)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    }
    const columns = [{ title: "分类名称", field: 'name' },
    {
        title: "状态", field: 'isActive',
        render: rowData => {
            if (rowData.isActive) {
                return (
                    <p style={{ color: 'green', fontWeight: "bolder" }}>上架</p>
                )
            }
            else {
                return (
                    <p style={{ color: 'red', fontWeight: "bolder" }}>下架</p>
                )
            }
        }
    },
    ]

    const modalOpen = () => {

        setModalShow(true)

    }
    const modalClose = () => {
        setModalShow(false)
        setTimeout(() => {
            setIsEditCategory(false)
        }, 2000);

    }
    const onSave = async () => {
        setModalShow(false)
        //addCategory();
        getCategory()

    }

    const editActive = (data) => {
        setEditCategory(data)
        // console.log(data)
        setIsEditCategory(true)
        setModalShow(true)

    }
    // const view=()=> {
    //     console.log('DB List', categoryList)
    //     console.log('Edit List',editCategory)
    //     console.log('isEdit', isEditCategory)
    // }
    const getCategory = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = fetch(url + '/category/user/60826e0faab69e002b1293d1', {
                method: 'POST',
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
                setCategoryList(data);
            });
        } catch (error) {
            if (error) {
                setDbError(true);
            }
        }
    }

    const subCategoryColumn = [{ title: "Name", field: 'name' },
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
        getCategory()
        setDbError(false)
        setSnackBarOpen(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, [props])

    return (
        <div>
            <NavBar></NavBar>
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
                        <Button style={{ margin: '10px 30px' }} onClick={() => modalOpen()}>添加分类</Button>
                        <MaterialTable style={{ margin: '15px' }} title="分类" data={categoryList}
                            columns={columns}
                            actions={[
                                {
                                    icon: 'edit',
                                    tooltip: '编辑分类',
                                    onClick: async (event, rowData) => {
                                        editActive(rowData)
                                    }
                                },
                            ]}
                            editable={{
                                onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                    const id = selectedRow._id
                                    const data = await deleteCategory(id)
                                    if (data) {
                                        setSnackBarOpen(true)
                                        setTimeout(() => {
                                            getCategory()
                                            resolve()
                                        }, 2000);
                                    }
                                }),
                            }}
                            options={{
                                actionsColumnIndex: -1,
                                showFirstLastPageButtons: false,
                                pageSizeOptions: [5, 10, 20, 50],
                                detailPanelColumnAlignment: 'right'
                            }}
                            localization={localization}
                        >
                        </MaterialTable>
                    </div>
            }
            <CategoryForm
                onHide={() => {
                    modalClose()
                }}
                show={modalShow}
                onSave={() => { onSave() }}
                isEdit={isEditCategory}
                editCategory={editCategory}
            ></CategoryForm>
            <Snackbar open={snackBarOpen} message="Successfully Deleted"
                autoHideDuration={3500} onClose={handleCloseSnack}>
            </Snackbar>
        </div>
    )
}
export default CategoryList;