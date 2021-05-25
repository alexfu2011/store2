import { url } from '../constants/auth';

export const getProductList = () => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        fetch(url + "/product/list", {
            headers: {
                method: "GET",
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
                resolve(data);
            } else {
                reject(false);
            }
        }).catch(err => {
            reject(false);
        });
    });
};
