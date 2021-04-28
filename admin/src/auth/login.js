import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./login.css";
import { Login } from './../services/authserivce';

export const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();


  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function Loginhandler(username, password) {
    Login(username, password).then(data => {
      if (data.error) {
        return;
      }
      console.log(data.token);
      localStorage.setItem("token", data.token);
      history.push("/home");
    }).catch(() => {});
  }

  return (
    <div className="Login">
      <Form >
        <Form.Group size="lg" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" onClick={() => { Loginhandler(username, password) }} disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;