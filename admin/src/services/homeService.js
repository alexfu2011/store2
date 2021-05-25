import { url } from '../constants/auth';

export const getHome = () => {
    return new Promise((resolve, reject) => {
        fetch(url + '/home', {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
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
            if (data.error) {
                reject(false);
                return;
            }
            resolve(data);
        }).catch(err => {
            reject(false);
        });
    });
};
