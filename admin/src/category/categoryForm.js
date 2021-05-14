import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Col } from 'react-bootstrap'
import Snackbar from '@material-ui/core/Snackbar'
import { url, jwt, userId } from './../constants/auth';

export const CategoryForm = ({ onSave, isEditCategory, data, ...props }) => {
    const [category, setCategory] = useState({ name: "" })
    const [validated, setValidated] = useState(false);
    const [errorDb, setErrorDb] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const handleChange = e => {
        setCategory(category => ({ ...category, [e.target.name]: e.target.value }));
    }

    const addCategory = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                name: category.name,
                active: category.active
            };
            const res = await fetch(url + '/category/add', {
                method: 'POST',
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
    }

    const updateCategory = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                _id: category._id,
                name: category.name,
                active: category.active
            };
            const res = await fetch(url + '/category/update', {
                method: 'POST',
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            if (isEdit) {
                const res = await updateCategory();
                if (res) {
                    setSnackBarOpen(true);
                    onSave();
                    //setValidated(true);
                } else {
                    setErrorDb(true);
                }
            } else {
                const res = await addCategory();
                if (res) {
                    setCategory({name: ""});
                    setSnackBarOpen(true);
                    onSave();
                    //setValidated(false);
                } else {
                    setErrorDb(true);
                }
            }
        }
    }

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const handleCloseSnack = () => {
        setSnackBarOpen(false);
    }
    useEffect(() => {
        if (isEditCategory) {
            setCategory(data);
            setIsEdit(true);
        } else {
            setCategory({name: ""});
            setIsEdit(false);
        }
    }, [isEditCategory, data]);
    return (
        <div>
            <Modal centered {...props}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>{isEdit ? "编辑分类" : "添加分类"}</Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>分类名称</Form.Label>
                                <Form.Control required type="text" value={category.name} name="name" onChange={handleChange} placeholder="分类名称" />
                                <Form.Control.Feedback type="invalid">请输入分类名称</Form.Control.Feedback>
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
            <Snackbar open={snackBarOpen} message={isEdit ? "编辑成功" : "添加成功"}
                autoHideDuration={2000} onClose={handleCloseSnack}>
            </Snackbar>
        </div>
    )
}
export default CategoryForm;