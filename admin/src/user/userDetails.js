import React, { useEffect, useState } from 'react'
import { Container, Modal, Form, Button, Col, Row } from 'react-bootstrap'
import './userDetails.css'
import { provinceData, cityData } from './../constants/provinceCity';
import { updateUser } from "../services/userService";

export const UserDetails = ({ onSave, isEditUser, data, ...props }) => {
    const [user, setUser] = useState()
    const [isEdit, setIsEdit] = useState(null)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [errorDb, setErrorDb] = useState(false)
    const [cities, setCities] = useState([]);
    const [province, setProvince] = useState();
    const [secondCity, setSecondCity] = useState();

    const handleProvinceChange = value => {
        setCities(cityData[value]);
        setProvince(value);
        setUser(user => ({ ...user, ["province"]: value }));
    };

    const onSecondCityChange = value => {
        setSecondCity(value);
        setUser(user => ({ ...user, ["city"]: value }));
    };

    const handleChange = e => {
        setUser(user => ({ ...user, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateUser(user);
        if (res) {
            setSnackBarOpen(true);
            onSave();
        } else {
            setErrorDb(true);
        }
    };

    useEffect(() => {
        if (isEditUser) {
            setUser(data);
            setProvince(data.province);
            setCities(cityData[data.province]);
            setSecondCity(data.city);
            setIsEdit(true);
        } else {
        }

    }, [isEditUser, data])

    return (
        <div>
            {user &&
                <Modal centered {...props}>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>{isEdit ? "编辑用户" : "添加用户"}</Modal.Header>
                        <Modal.Body>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>姓名</Form.Label>
                                    <Form.Control required type="text" value={user.name} name="name" onChange={handleChange} placeholder="请输入姓名" />
                                    <Form.Control.Feedback type="invalid">请输入姓名</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>电话</Form.Label>
                                    <Form.Control required type="text" value={user.phone} name="phone" onChange={handleChange} placeholder="请输入电话" />
                                    <Form.Control.Feedback type="invalid">请输入电话</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>省份</Form.Label>
                                    <Form.Control required as="select" value={province} onChange={e => handleProvinceChange(e.target.value)} placeholder="请选择省份" >
                                        {provinceData.map((province, index) => (
                                            <option value={province} key={index}>{province}</option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        请选择省份
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>城市</Form.Label>
                                    <Form.Control required as="select" value={secondCity} onChange={e => onSecondCityChange(e.target.value)} placeholder="请选择城市" >
                                        {
                                            cities ? cities.map((city, index) => (
                                                <option value={city} key={index}>{city}</option>
                                            )) : <option value="">请选择</option>
                                        }
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        请选择城市
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>地址</Form.Label>
                                    <Form.Control required type="text" value={user.address} name="address" onChange={handleChange} placeholder="请输入地址" />
                                    <Form.Control.Feedback type="invalid">请输入地址</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>邮箱</Form.Label>
                                    <Form.Control required type="text" value={user.email} name="email" onChange={handleChange} placeholder="请输入邮箱" />
                                    <Form.Control.Feedback type="invalid">请输入邮箱</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>状态</Form.Label>
                                    <Form.Control required as="select" value={user.status ? 1 : 2} name="isActive" onChange={handleChange} >
                                        <option value="">请选择状态</option>
                                        <option value="1">正常</option>
                                        <option value="2">停用</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        请输入产品分类
                                </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>描述</Form.Label>
                                    <Form.Control required as="textarea" value={user.description} name="description" onChange={handleChange} placeholder="请输入描述" />
                                    <Form.Control.Feedback type="invalid">请输入描述</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                        </Modal.Body>
                        <Modal.Footer>
                            {errorDb && <p style={{ color: "red" }}>无法{isEdit ? "更新" : "保存"}数据</p>}
                            <Button type="submit">{isEdit ? "更新" : "保存"}</Button>
                            <Button onClick={() => { props.onHide() }}>关闭</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            }
        </div>
    )
}
export default UserDetails