import React, { useState, useEffect } from 'react';
import NavBar from './../components/navBar';
import { Col, Row, Spinner } from 'react-bootstrap';
import { url, jwt, userId } from './../constants/auth';

import './home.css'
export const Home = (props) => {
    const [data, setData] = useState({
        'TotalProducts': 0,
        'TotalOrders': 0
    });
    const [dbError, setDbError] = useState(false);
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(true);

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
                } else if (res.status === 400) {
                    setLogin(false);
                    throw new Error("request error");
                } else if (res.status === 401) {
                    setLogin(false);
                    throw new Error("not login");
                } else {
                    setDbError(true);
                    throw new Error("server error");
                }
            }).then(data => {
                if (data.error) {
                    reject(false);
                    return;
                }
                setData(data);
                resolve(true);
            }).catch(err => {
                reject(false);
            });

        });
    };

    useEffect(() => {
        getDashboard()
    }, []);

    return (
        <div>
            <NavBar props={props}></NavBar>
            {dbError ?
                <div style={{ width: "100%", height: "100px", marginTop: "300px" }} >
                    <p style={{
                        display: "block", marginLeft: "auto",
                        marginRight: "auto", textAlign: "center"
                    }}>服务器宕机</p>
                </div>
                :
                login ?
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