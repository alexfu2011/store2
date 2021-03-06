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
                        setCategory({ name: "" });
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
                        setCategory({ name: "" });
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
                    <Modal.Header closeButton>{isEdit ? "????????????" : "????????????"}</Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>????????????</Form.Label>
                                <Form.Control required type="text" value={category.name} name="name" onChange={e => setField("name", e.target.value)} placeholder="????????????" />
                                <Form.Control.Feedback type="invalid">?????????????????????</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                        {isEdit && 
                        <Form.Group >
                            <Form.Check
                                checked={category.isActive === true}
                                type="radio"
                                label="??????"
                                onChange={() => setField("isActive", true)}
                                name="isActive"
                            />
                            <Form.Check
                                checked={category.isActive === false}
                                type="radio"
                                label="??????"
                                onChange={() => setField("isActive", false)}
                                name="isActive"
                            />
                        </Form.Group>}
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        {errorDb && <p style={{ color: "red" }}>??????{isEdit ? "??????" : "??????"}??????</p>}
                        <Button type="submit">{isEdit ? "??????" : "??????"}</Button>
                        <Button onClick={onHide}>??????</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Snackbar open={snackBarOpen} message={isEdit ? "????????????" : "????????????"}
                autoHideDuration={2000} onClose={handleCloseSnack}>
            </Snackbar>
        </div>
    )
}
export default CategoryForm;