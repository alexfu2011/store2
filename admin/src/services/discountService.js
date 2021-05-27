import { url } from '../constants/auth';

export const getDiscountList = () => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        fetch(url + "/discount", {
            method: "GET",
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
            resolve(data);
        }).catch(err => {
            reject(false);
        });
    });
};

export const addDiscount = (data) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        const body = {
            code: data.code,
            percentage: data.percentage,
            quantity: data.quantity,
            from: data.from,
            to: data.to
        };
        fetch(url + '/discount/add', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
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
            resolve(data);
        }).catch(err => {
            reject(false);
        });
    });
};

export const updateDiscount = (data) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        const body = {
            code: data.code,
            percentage: data.percentage,
            quantity: data.quantity,
            from: data.from,
            to: data.to,
            isActive: data.isActive
        };
        fetch(url + '/discount/update/' + data._id, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
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
            resolve(data);
        }).catch(err => {
            reject(false);
        });
    });
};
