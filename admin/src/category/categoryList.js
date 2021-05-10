import React, { useState, useEffect } from "react"
import MaterialTable from "material-table"
//import { getAllCategory, deleteCategory, deleteSubCategory } from "./../services/categoryService"
import { Button, Spinner } from "react-bootstrap"
import "./categoryList.css"
import CategoryForm from "./categoryForm"
import Snackbar from "@material-ui/core/Snackbar"
import NavBar from "./../components/navBar"
import { url, jwt, userId } from "./../constants/auth";
import localization from "../localization";

export const CategoryList = (props) => {
    const [categoryList, setCategoryList] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [isEditCategory, setIsEditCategory] = useState(false)
    const [category, setCategory] = useState({})
    const [dbError, setDbError] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    }
    const columns = [{ title: "分类名称", field: "name" },
    {
        title: "状态", field: "active",
        render: rowData => {
            if (rowData.active === 1) {
                return (
                    <p style={{ color: "green", fontWeight: "bolder" }}>上架</p>
                )
            } else {
                return (
                    <p style={{ color: "red", fontWeight: "bolder" }}>下架</p>
                )
            }
        }
    }]

    const modalOpen = () => {
        setIsEditCategory(false);
        setModalShow(true);
    }
    const modalClose = () => {
        setModalShow(false);
    }
    const onSave = async () => {
        setModalShow(false);
        getCategory();
    }
    const editActive = (data) => {
        setCategory(data);
        setIsEditCategory(true);
        setModalShow(true);
    }

    const deleteCategory = async (categoryId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = localStorage.getItem("token");
                fetch(url + "/category/delete/" + categoryId, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else if (res.status === 401) {
                        reject(false);
                    }
                }).then(data => {
                    if (!data.error) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            } catch (error) {
                if (error) {
                    reject(false);
                }
            }
        });
    }

    const getCategory = async () => {
        try {
            const token = localStorage.getItem("token");
            fetch(url + "/category", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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

    useEffect(() => {
        getCategory();
        setDbError(false);
        setSnackBarOpen(false);
    }, [props]);

    return (
        <div>
            <NavBar></NavBar>
            {login ?
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
                        <Button style={{ margin: "10px 30px" }} onClick={() => modalOpen()}>添加分类</Button>
                        <MaterialTable title="分类" data={categoryList}
                            columns={columns}
                            actions={[
                                {
                                    icon: "edit",
                                    tooltip: "编辑分类",
                                    onClick: async (event, rowData) => {
                                        editActive(rowData)
                                    }
                                },
                            ]}
                            editable={{
                                onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                    const id = selectedRow._id
                                    const res = await deleteCategory(id)
                                    console.log(res);
                                    if (res) {
                                        setSnackBarOpen(true)
                                        getCategory()
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
            <CategoryForm
                onHide={() => { modalClose() }}
                show={modalShow}
                onSave={onSave}
                isEditCategory={isEditCategory}
                data={category}
            ></CategoryForm>
            <Snackbar open={snackBarOpen} message="删除成功"
                autoHideDuration={3500} onClose={handleCloseSnack}>
            </Snackbar>
        </div>
    )
}
export default CategoryList;