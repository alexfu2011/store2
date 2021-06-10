import { url } from "../constants/auth";

export const getBannerList = () => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        fetch(url + "/banner/list", {
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

export const addBanner = async (formf) => {
    try {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("name", formf.name);
        formData.append("image", formf.image);

        const res = await fetch(url + '/banner/add', {
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

export const deleteBanner = (bannerId) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        fetch(url + "/banner/delete/" + bannerId, {
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

export const updateBanner = (banner) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        const body = {
            name: banner.name,
            isActive: banner.isActive
        };
        fetch(url + "/banner/update/" + banner._id, {
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
