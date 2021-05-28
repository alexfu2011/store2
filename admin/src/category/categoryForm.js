import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import { updateCategory, addCategory } from "../services/categoryService";

export const CategoryForm = ({ onSave, isEditCategory, data, ...props }) => {
    const [category, setCategory] = useState({ name: "" });
    const [validated, setValidated] = useState(false);
    const [errorDb, setErrorDb] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleChange = e => {
        setCategory(category => ({ ...category, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            if (isEdit) {
                const res = await updateCategory(category);
                if (res) {
                    setSnackBarOpen(true);
                    onSave();
                    //setValidated(true);
                } else {
                    setErrorDb(true);
                }
            } else {
                const res = await addCategory(category);
                if (res) {
                    setCategory({ name: "" });
                    setSnackBarOpen(true);
                    onSave();
                    //setValidated(false);
                } else {
                    setErrorDb(true);
                }
            }
        }
    };

    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleCloseSnack = () => {
        setSnackBarOpen(false);
    };

    useEffect(() => {
        if (isEditCategory) {
            setCategory(data);
            setIsEdit(true);
        } else {
            setCategory({ name: "" });
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
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>分类状态</Form.Label>
                                <Form.Control required as="select" value={category.isActive} name="isActive" onChange={handleChange} >
                                    <option value="">请选择分类状态</option>
                                    <option value="1">有效</option>
                                    <option value="2">无效</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    请选择产品状态
                                </Form.Control.Feedback>
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