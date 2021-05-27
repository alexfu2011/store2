import { url } from '../constants/auth';

export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        fetch(url + "/user", {
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
        }).catch(e => {
            reject(false);
        });
    });
};

export const updateUser = async (user) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        const body = {
            name: user.name,
            phone: user.phone,
            city: user.city,
            province: user.province,
            address: user.address,
            email: user.email,
            isActive: user.isActive,
            description: user.description
        };
        fetch(url + '/user/update/' + user._id, {
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
