import React, { useState, useEffect } from 'react';
import NavBar from './../components/navBar';
import { Col, Row, Spinner } from 'react-bootstrap';
import { url, jwt, userId } from './../constants/auth';
import { TokenProivder, useToken } from "../store";

import './home.css'
export const Home = (props) => {
    const [data, setData] = useState({
        'TotalProducts': 0,
        'TotalOrders': 0
    });
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const { state, dispatch } = useToken();

    const getDashboard = () => {
        return new Promise((resolve, reject) => {
            fetch(url + '/dashboard', {
                method: 'GET', headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status === 200) {
                    setLoading(false);
                    return res.json();
                } else {
                    setDbError(true);
                    return;
                }
            }).then(data => {
                if (data.error) {
                    reject(false);
                    return;
                }
                resolve(data);
            }).catch(err => {
                reject(false);
            });

        });
    };

    const getValues = async () => {
        const data = await getDashboard();
        if (data) {
            setData(data);
        }
        else {
            setDbError(true);
            dispatch({ type: "LOGOUT" });
        }
    };

    useEffect(() => {
        getValues();
    }, []);

    return (
        <div>
            <NavBar props={props}></NavBar>
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
                <div class="container-fluid my-4">
                    <div class="row">
                        <div class="col-12 col-md-6 col-xl d-flex">
                            <div class="card flex-fill">
                                <div class="card-body py-4">
                                    <div class="float-right text-danger">
                                    </div>
                                    <h4 class="mb-2">产品</h4>
                                    <span style={{ color: "green" }}>{data.TotalActiveProducts || 0} 已上架</span>，
                                            <span style={{ color: "red" }}>{data.TotalInactiveProducts || 0} 已下架</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-xl d-flex">
                            <div class="card flex-fill">
                                <div class="card-body py-4">
                                    <div class="float-right text-success">
                                    </div>
                                    <h4 class="mb-2">订单</h4>
                                    <span style={{ color: "green" }}>{data.TotalActiveOrders || 0} 已生效</span>，
                                            <span style={{ color: "red" }}>{data.TotalInactiveOrders || 0} 无效</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Home