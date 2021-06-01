import React, { useState, useEffect } from "react"
import MaterialTable from "material-table"
import { Button, Spinner } from "react-bootstrap"
import "./categoryList.css"
import CategoryForm from "./categoryForm"
import Snackbar from "@material-ui/core/Snackbar"
import NavBar from "./../components/navBar"
import localization from "../localization";
import { getCategoryList, deleteCategory, updateCategory } from "../services/categoryService";
import { getToken } from "../services/authService";

export const CategoryList = (props) => {
    const [categoryList, setCategoryList] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [isEditCategory, setIsEditCategory] = useState(false)
    const [category, setCategory] = useState({})
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [loading, setLoading] = useState(true);

    const getCategory = async () => {
        try {
            const data = await getCategoryList();
            if (data) {
                setLoading(false);
                setCategoryList(data);
                const token = await getToken();
                localStorage.setItem("token", token);
            } else {
                throw new Error();
            }
        } catch {
            localStorage.setItem("token", "");
            props.history.push("/login");
        }
    };

    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    };

    const columns = [
        { title: "分类名称", field: "name" },
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
        setIsEditCategory(false);
        setModalShow(true);
    };

    const modalClose = () => {
        setModalShow(false);
    };

    const onSave = async () => {
        setModalShow(false);
        getCategory();
    };

    const editActive = (data) => {        
        setCategory(Object.assign({}, data));
        setIsEditCategory(true);
        setModalShow(true);
    };

    useEffect(() => {
        getCategory();
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
                            pageSizeOptions: [5, 10, 20, 50]
                        }}
                        localization={localization}
                    >
                    </MaterialTable>

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
            }
        </div>
    )
}
export default CategoryList;