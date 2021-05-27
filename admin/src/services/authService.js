import { url } from '../constants/auth';

export const getToken = () => {
    return new Promise((resolve, reject) => {
        fetch(url + "/auth/token", {
            method: "POST", credentials: "include", headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error();
            }
        }).then(data => {
            if (!data.token) {
                reject(false);
            } else {
                resolve(data.token);
            }
        }).catch(err => {
            reject(false);
        });
    });
}
