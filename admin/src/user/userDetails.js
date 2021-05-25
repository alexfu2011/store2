import React, { useEffect, useState } from 'react'
import { Container, Modal, Form, Button, Col, Row } from 'react-bootstrap'
import './userDetails.css'
import { url, jwt, userId } from './../constants/auth';

export const UserDetails = ({ onSave, isEditUser, data, ...props }) => {
    const [user, setUser] = useState(null)
    const [isEdit, setIsEdit] = useState(null)
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const [errorDb, setErrorDb] = useState(false)

    const handleChange = e => {
        setUser(user => ({ ...user, [e.target.name]: e.target.value }));
    }

    const updateUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                _id: user._id,
                cartId: user.cartId,
                products: user.products,
                isActive: user.isActive
            };
            const res = await fetch(url + '/user/update/' + user._id, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateUser();
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
                                <Form.Control required type="text" value={user.telephone} name="telephone" onChange={handleChange} placeholder="请输入电话" />
                                <Form.Control.Feedback type="invalid">请输入电话</Form.Control.Feedback>
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
                                <Form.Control required as="select" value={user.status ? 1 : 2} onChange={handleChange} >
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
                                <Form.Control required as="textarea" value={user.description} onChange={handleChange} placeholder="请输入描述" />
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