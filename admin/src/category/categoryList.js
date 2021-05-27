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
import { TokenProivder, useToken } from "../store";
import { getCategoryList } from "../services/categoryService";
import { getToken } from "../services/authService";

export const CategoryList = (props) => {
    const [categoryList, setCategoryList] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [isEditCategory, setIsEditCategory] = useState(false)
    const [category, setCategory] = useState({})
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useToken();

    const getCategory = async () => {
        try {
            const data = await getCategoryList();
            if (data) {
                setLoading(false);
                setCategoryList(data);
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
    const columns = [{ title: "分类名称", field: "name" }]

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
        getCategory().then(() => {
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
                    <Button style={{ margin: "20px" }} onClick={() => modalOpen()}>添加分类</Button>
                    <MaterialTable title="分类列表" data={categoryList}
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