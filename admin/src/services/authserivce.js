import axios from "axios";
import { url } from './../constants/auth'

export const Login = async (username, password) => {
    const res = await fetch(url + "/auth/login", {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    return res.json();
}
