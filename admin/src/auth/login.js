import React, { useState, useContext, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./login.css";
import { url } from '../constants/auth'
import { useToken } from "../store";

export const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { state , dispatch } = useToken();

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const Login = async (username, password) => {
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

  function Loginhandler(username, password) {
    Login(username, password).then(data => {
      if (data.error) {
        return;
      }
      dispatch({type: "SET_TOKEN", payload: data.token});
      localStorage.setItem("token", data.token);
      props.history.push('/order');
    }).catch(() => { });
  }

  return (
    <div className="Login">
      <Form >
        <Form.Group size="lg" controlId="username">
          <Form.Label>用户名</Form.Label>
          <Form.Control
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>密码</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" onClick={() => { Loginhandler(username, password) }} disabled={!validateForm()}>
          登陆
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;