import React, { useState, useEffect } from "react"
import MaterialTable from "material-table"
import { Button, Spinner } from "react-bootstrap"
import BannerForm from "./bannerForm"
import Snackbar from "@material-ui/core/Snackbar"
import NavBar from "./../components/navBar"
import localization from "../localization";
import { getBannerList, deleteBanner, updateBanner } from "../services/bannerService";
import { getToken } from "../services/authService";

export const BannerList = (props) => {
    const [bannerList, setBannerList] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [isEditBanner, setIsEditBanner] = useState(false)
    const [banner, setBanner] = useState({})
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [loading, setLoading] = useState(true);

    const getBanner = async () => {
        try {
            const data = await getBannerList();
            if (data) {
                setLoading(false);
                setBannerList(data);
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
        { title: "广告名称", field: "name" },
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
        setIsEditBanner(false);
        setModalShow(true);
    };

    const modalClose = () => {
        setModalShow(false);
    };

    const onSave = async () => {
        setModalShow(false);
        getBanner();
    };

    const editActive = (data) => {        
        setBanner(Object.assign({}, data));
        setIsEditBanner(true);
        setModalShow(true);
    };

    useEffect(() => {
        getBanner();
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
                    <Button style={{ margin: "20px" }} onClick={() => modalOpen()}>添加广告</Button>
                    <MaterialTable title="广告列表" data={bannerList}
                        columns={columns}
                        actions={[
                            {
                                icon: "edit",
                                tooltip: "编辑广告",
                                onClick: async (event, rowData) => {
                                    editActive(rowData)
                                }
                            },
                        ]}
                        editable={{
                            onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                const id = selectedRow._id
                                const res = await deleteBanner(id)
                                if (res) {
                                    setSnackBarOpen(true)
                                    getBanner()
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

                    <BannerForm
                        onHide={() => { modalClose() }}
                        show={modalShow}
                        onSave={onSave}
                        isEditBanner={isEditBanner}
                        data={banner}
                    ></BannerForm>

                    <Snackbar open={snackBarOpen} message="删除成功"
                        autoHideDuration={3500} onClose={handleCloseSnack}>
                    </Snackbar>
                </div>
            }
        </div>
    )
}
export default BannerList;