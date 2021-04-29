import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { getAllCategory, deleteCategory, deleteSubCategory } from './../services/categoryService'
import { Button, Spinner } from 'react-bootstrap'
import './categoryList.css'
import CategoryForm from './categoryForm'
import Snackbar from '@material-ui/core/Snackbar'
import NavBar from './../components/navBar'
import { url, jwt, userId } from './../constants/auth';
export const CategoryList = (props) => {
    const [categoryList, setCategoryList] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [isEditCategory, setIsEditCategory] = useState(false)
    const [editCategory, setEditCategory] = useState([])
    const [dbError, setDbError] = useState(false)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    }
    const columns = [{ title: "Category Name", field: 'name' },
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
                    return res.json();
                }
            }).then(data => {
                //if (res.status === 200) {
                    //setAuth(true);
                    setCategoryList(data);
                //} else if (res.status === 400 || res.status === 401) {
                    //setAuth(false);
                //}
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
            <div>
                <Button style={{ margin: '10px 30px' }} onClick={() => modalOpen()}>Add Category</Button>
                {categoryList ?
                    <div className='table'>
                        <MaterialTable style={{ marginTop: '15px' }} title="Category" data={categoryList}
                            columns={columns}
                            actions={[
                                {
                                    icon: 'edit',
                                    tooltip: 'Edit category',
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
                            detailPanel={[
                                {
                                    icon: 'expand_more',
                                    tooltip: 'Show Sub-Category',
                                    onRowClick: async (event, rowData) => {
                                        console.log(rowData)
                                    },
                                    render: rowData => {
                                        return (
                                            <div>
                                                <MaterialTable style={{ border: "3px solid #067BFD" }} title='Sub Category' columns={subCategoryColumn} data={rowData.subCategories}
                                                    options={{
                                                        search: false,
                                                        toolbar: false,
                                                        paging: false,
                                                        actionsColumnIndex: -1
                                                    }}
                                                    actions={[
                                                        {
                                                            icon: 'edit',
                                                            tooltip: 'Edit sub Category',
                                                            onClick: async (event, rowData) => {
                                                                console.log(rowData)
                                                                props.history.replace({
                                                                    pathname: '/category/addSubCategory',
                                                                    state: rowData
                                                                })
                                                            }
                                                        },
                                                    ]}
                                                    editable={{
                                                        onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                                            const id = selectedRow._id
                                                            const data = await deleteSubCategory(id)
                                                            if (data) {
                                                                setSnackBarOpen(true)
                                                                setTimeout(() => {
                                                                    getCategory()
                                                                    resolve()
                                                                }, 1000);

                                                            }
                                                        }),
                                                    }}
                                                    localization={{
                                                        header: {
                                                            actions: "Acciones"
                                                        },
                                                        body: {
                                                            emptyDataSourceMessage: "No hay ningúna persona  cargada"
                                                        }
                                                    }}
                                                ></MaterialTable>
                                            </div>
                                        )
                                    },
                                },
                            ]}
                        >
                        </MaterialTable>
                    </div>
                    :
                    <div></div>
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
        </div>
    )
}
export default CategoryList