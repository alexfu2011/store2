import React, { useState, useEffect } from "react";
import NavBar from "./../components/navBar";
import { Spinner } from "react-bootstrap";
import { getHome } from "../services/homeService";
import "./home.css";
import { getToken } from "../services/authService";

export const Home = (props) => {
    const [data, setData] = useState({
        "TotalProducts": 0,
        "TotalOrders": 0
    });
    const [loading, setLoading] = useState(true);

    const getValues = async () => {
        try {
            const data = await getHome();
            if (data) {
                setLoading(false);
                setData(data);
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
                <div className="container-fluid my-4">
                    <div className="row">
                        <div className="col-12 col-md-6 col-xl d-flex">
                            <div className="card flex-fill">
                                <div className="card-body py-4">
                                    <div className="float-right text-danger">
                                    </div>
                                    <h4 className="mb-2">产品</h4>
                                    <span style={{ color: "green" }}>{data.TotalActiveProducts || 0} 已上架</span>，
                                            <span style={{ color: "red" }}>{data.TotalInactiveProducts || 0} 已下架</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl d-flex">
                            <div className="card flex-fill">
                                <div className="card-body py-4">
                                    <div className="float-right text-success">
                                    </div>
                                    <h4 className="mb-2">订单</h4>
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