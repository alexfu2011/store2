import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Snackbar from "@material-ui/core/Snackbar";
import MaterialTable from "material-table";
import NavBar from "../components/navBar";
import UserDetails from "./userDetails";
import localization from "../localization";
import { TokenProivder, useToken } from "../store";
import { getAllUsers } from "../services/userService";
import dateFormat from 'dateformat';
import { getToken } from "../services/authService";

export const UserList = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [users, setUsers] = useState([]);
    const [isEditUser, setIsEditUser] = useState(false);
    const [user, setUser] = useState([]);
    const [dbError, setDbError] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = useToken();

    const getUsers = async () => {
        try {
            const data = await getAllUsers();
            if (data) {
                setLoading(false);
                setUsers(data);
            } else {
                throw new Error();
            }
        } catch {
            dispatch({ type: "LOGOUT" });
        }
    };

    const modalOpen = () => {
        setModalShow(true);
    };

    const modalClose = () => {
        setModalShow(false);
    };

    const editUser = (data) => {
        console.log(data);
        setUser(data);
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
        try {
            getUsers().then(() => {
                getToken().then(token => {
                    dispatch({ type: "SET_TOKEN", payload: token });
                });
            });
        } catch {
            dispatch({ type: "LOGOUT" });
        }
    }, []);

    return (
        <div>
            <NavBar></NavBar>
            {loading ?
                <div style={{ width: "100%", height: "100px", marginTop: "300px" }} >
                    <Spinner style={{
                        display: "block", marginLeft: "auto",
                        marginRight: "auto", height: "50px", width: "50px"
                    }} animation="buser" variant="primary" />
                    <p style={{
                        display: "block", marginLeft: "auto",
                        marginRight: "auto", textAlign: "center"
                    }}>加载中</p>
                </div>
                :
                <div>
                    <MaterialTable style={{ marginTop: "15px" }} title="用户列表" data={users}
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