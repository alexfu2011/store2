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

export const addProduct = async (formf) => {
    try {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("name", formf.name);
        formData.append("brandName", formf.brandName);
        formData.append("summary", formf.summary);
        formData.append("description", formf.description);
        formData.append("category", formf.category);
        formData.append("price", formf.price);
        formData.append("stock", formf.stock);
        formData.append("isActive", formf.isActive);
        formData.append("image", formf.image);

        const res = await fetch(url + '/product/add', {
            method: 'POST',
            body: formData,
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            return true;
        } else if (res.status === 400 || res.status === 401) {
            return false;
        }
    } catch (err) {
        if (err) {
            return false;
        }
    }
};

export const updateProduct = async (formf) => {
    try {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("name", formf.name);
        formData.append("brandName", formf.brandName);
        formData.append("summary", formf.summary);
        formData.append("description", formf.description);
        formData.append("category", formf.category._id);
        formData.append("price", formf.price);
        formData.append("stock", formf.stock);
        formData.append("isActive", formf.isActive);
        formData.append("image", formf.image);

        const res = await fetch(url + '/product/update/' + formf._id, {
            method: 'PUT',
            body: formData,
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        if (res.status === 200) {
            return true;
        } else if (res.status === 400 || res.status === 401) {
            return false;
        }
    } catch (err) {
        if (err) {
            return false;
        }
    }
};
