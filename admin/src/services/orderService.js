import { url } from '../constants/auth';

export const getAllOrders = (order) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        fetch(url + `/order/${order}`, {
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
            if (data) {
                resolve(data.orders);
            } else {
                reject(false);
            }
        }).catch(e => {
            reject(false);
        });
    });
};

export const updateOrder = async (order) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        const body = {
            _id: order._id,
            cartId: order.cartId,
            products: order.products,
            isActive: order.isActive
        };
        fetch(url + "/order/update/" + order._id, {
            method: "PUT",
            body: JSON.stringify(body),
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
                resolve(data);
            } else {
                reject(false);
            }
        }).catch(e => {
            reject(false);
        });
    });
};
