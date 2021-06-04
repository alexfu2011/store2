import { url } from "../constants/auth";

export const getCategoryList = () => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        fetch(url + "/category/list", {
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

export const addCategory = (category) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        const body = {
            name: category.name,
            isActive: category.isActive
        };
        fetch(url + "/category/add", {
            method: "POST",
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
            resolve(data);
        }).catch(err => {
            reject(false);
        });
    });
};

export const deleteCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        fetch(url + "/category/delete/" + categoryId, {
            method: "DELETE",
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
                resolve(true);
            } else {
                reject(false);
            }
        }).catch(err => {
            reject(false);
        });
    });
};

export const updateCategory = (category) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        const body = {
            name: category.name,
            isActive: category.isActive
        };
        fetch(url + "/category/update/" + category._id, {
            method: "POST",
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
            resolve(data);
        }).catch(err => {
            reject(false);
        });
    });
};
