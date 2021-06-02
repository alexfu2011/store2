import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Snackbar from "@material-ui/core/Snackbar";
import MaterialTable from "material-table";
import NavBar from "../components/navBar";
import UserDetails from "./userDetails";
import localization from "../localization";
import { getAllUsers } from "../services/userService";
import dateFormat from 'dateformat';
import { getToken } from "../services/authService";

export const UserList = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [users, setUsers] = useState([]);
    const [isEditUser, setIsEditUser] = useState(false);
    const [user, setUser] = useState([]);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const getUsers = async () => {
        try {
            const data = await getAllUsers();
            if (data) {
                setLoading(false);
                setUsers(data);
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

    const modalOpen = () => {
        setModalShow(true);
    };

    const modalClose = () => {
        setModalShow(false);
    };

    const editUser = (data) => {
        setUser(Object.assign({}, data));
        setIsEditUser(true);
        setModalShow(true);
    };

    const onSave = async () => {
        setModalShow(false);
        getUsers();
    };

    const handleCloseSnack = () => {
        setSnackBarOpen(false);
    };

    const columns = [
        { title: "用户名", field: "username" },
        { title: "姓名", field: "name" },
        {
            title: "创建时间", field: "timeStamp",
            render: rowData => {
                return dateFormat(rowData.created, "yyyy-mm-dd hh:mm:ss");
            }
        },
        {
            title: "状态", field: "status",
            render: rowData => {
                if (rowData.status == 1) {
                    return (
                        <span style={{ color: "green", fontWeight: "bolder" }}>正常</span>
                    )
                } else {
                    return (
                        <span style={{ color: "red", fontWeight: "bolder" }}>停用</span>
                    )
                }
            }
        }
    ];

    useEffect(() => {
        getUsers();
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
                    <MaterialTable title="用户列表" data={users}
                        columns={columns}
                        actions={[
                            {
                                icon: "edit",
                                tooltip: "edit",
                                onClick: async (event, rowData) => {
                                    editUser(rowData)
                                }
                            },
                        ]}
                        options={{
                            actionsColumnIndex: -1,
                            showFirstLastPageButtons: false,
                            pageSizeOptions: [5, 10, 20, 50]
                        }}
                        localization={localization}
                    >
                    </MaterialTable>
                    <UserDetails
                        onHide={() => { modalClose() }}
                        show={modalShow}
                        onSave={onSave}
                        isEditUser={isEditUser}
                        data={user}
                    ></UserDetails>
                    <Snackbar open={snackBarOpen} message="Successfully Deleted"
                        autoHideDuration={3500} onClose={handleCloseSnack}>
                    </Snackbar>
                </div>
            }
        </div>
    )
}
export default UserList