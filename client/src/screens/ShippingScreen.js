import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress, getShippingAddress } from '../actions/profileActions'
import Message from "../components/Message";
import Loader from "../components/Loader";
import axios from "axios";
import { logout } from "../actions/userActions";
import { saveCart } from "../actions/cartActions";

const ShippingScreen = ({ history }) => {
  const profileDetail = useSelector((state) => state.profile);
  const cartDetail = useSelector((state) => state.cart);
  const { loading, error, profile } = profileDetail;
  const { cart } = cartDetail;
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [person, setPerson] = useState("")
  const [phone, setPhone] = useState("")
  const [login, setLogin] = useState(false)

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, person, phone }));
    dispatch(saveCart());
  }
  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const res = axios.get(`/api/profile`, config);
    res.then(res => {
      setAddress(res.data.address);
      setCity(res.data.city);
      setPerson(res.data.person);
      setPhone(res.data.phone);
    }).catch(() => {
      setLogin(true);
    });

  }, []);

  return (
    <div className="my-3">
      {loading ?
        <Loader />
        : login ?
          <Message variant='info'>请重新 <a href="#" onClick={logoutHandler}>登录</a></Message>
          :
          cart ? <Message variant='success'>订单已生成，订单号 {cart} </Message>
          :
          <Form onSubmit={submitHandler} className="text-center">
            {error && <Message variant='danger'>{error}</Message>}

            <Form.Group controlId='address'>
              <Form.Label className="float-left">地址</Form.Label>
              <Form.Control
                type='text'
                placeholder='请输入地址'
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='city'>
              <Form.Label className="float-left">城市</Form.Label>
              <Form.Control
                type='text'
                placeholder='请输入城市'
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='person'>
              <Form.Label className="float-left">联系人</Form.Label>
              <Form.Control
                type='text'
                placeholder='请输入联系人'
                value={person}
                required
                onChange={(e) => setPerson(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='phone'>
              <Form.Label className="float-left">联系电话</Form.Label>
              <Form.Control
                type='text'
                placeholder='请输入联系电话'
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              确定
            </Button>
          </Form>
      }
    </div>
  )
}

export default ShippingScreen