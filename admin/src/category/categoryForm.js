import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import { updateCategory, addCategory } from "../services/categoryService";

export const CategoryForm = ({ onSave, isEditCategory, data, ...props }) => {
    const [category, setCategory] = useState({ name: "" });
    const [validated, setValidated] = useState(false);
    const [errorDb, setErrorDb] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleChange = e => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    const setField = (field, value) => {
        setCategory({
            ...category,
            [field]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setValidated(true);

        if (form.checkValidity() === true) {
            if (isEdit) {
                try {
                    const res = await updateCategory(category);
                    if (res) {
                        setSnackBarOpen(true);
                        onSave();
                    } else {
                        throw new Error();
                    }
                } catch {
                    setValidated(false);
                    setErrorDb(true);
                }
            } else {
                try {
                    const res = await addCategory(category);
                    if (res) {
                        setSnackBarOpen(true);
                        onSave();
                    } else {
                        throw new Error();
                    }
                }
                catch {
                    setValidated(false);
                    setErrorDb(true);
                }
            }
            setValidated(false);
        } else {
            setValidated(true);
        }
    };

    const handleCloseSnack = () => {
        setSnackBarOpen(false);
    };

    useEffect(() => {
        if (isEditCategory) {
            setCategory({_id: data._id, name: data.name, isActive: data.isActive == 1 ? true : false});
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }
    }, [isEditCategory, data]);

    const onHide = () => {
        setCategory({ name: "" });
        setValidated(false);
        setErrorDb(false);
        props.onHide();
    };

    return (
        <div>
            <Modal centered {...props} onHide={onHide}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>{isEdit ? "编辑分类" : "添加分类"}</Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>分类名称</Form.Label>
                                <Form.Control required type="text" value={category.name} name="name" onChange={e => setField("name", e.target.value)} placeholder="分类名称" />
                                <Form.Control.Feedback type="invalid">请输入分类名称</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                        {isEdit && 
                        <Form.Group >
                            <Form.Check
                                checked={category.isActive === true}
                                type="radio"
                                label="有效"
                                onChange={() => setField("isActive", true)}
                                name="isActive"
                            />
                            <Form.Check
                                checked={category.isActive === false}
                                type="radio"
                                label="无效"
                                onChange={() => setField("isActive", false)}
                                name="isActive"
                            />
                        </Form.Group>}
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        {errorDb && <p style={{ color: "red" }}>无法{isEdit ? "更新" : "保存"}数据</p>}
                        <Button type="submit">{isEdit ? "更新" : "保存"}</Button>
                        <Button onClick={onHide}>关闭</Button>
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