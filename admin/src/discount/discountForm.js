import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import { addDiscount, updateDiscount } from "../services/discountService";
import dateFormat from 'dateformat';

export const DiscountForm = ({ onSave, isEditDiscount, data, ...props }) => {
    const [discount, setDiscount] = useState({});
    const [validated, setValidated] = useState(false);
    const [errorDb, setErrorDb] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleChange = e => {
        setDiscount(discount => ({ ...discount, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            if (isEdit) {
                try {
                    const res = await updateDiscount(discount);
                    if (res) {
                        setDiscount({});
                        setSnackBarOpen(true);
                        setValidated(true);
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
                    const res = await addDiscount(discount);
                    if (res) {
                        setDiscount({});
                        setSnackBarOpen(true);
                        setValidated(false);
                        onSave();
                    } else {
                        throw new Error();
                    }
                } catch {
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

    const setField = (field, value) => {
        setValidated(false);
        setDiscount({
            ...discount,
            [field]: value
        });
    };

    useEffect(() => {
        if (isEditDiscount) {
            setDiscount({
                ...discount,
                _id: data._id,
                percentage: data.percentage,
                quantity: data.quantity,
                from: dateFormat(data.from, "yyyy-mm-dd"),
                to: dateFormat(data.to, "yyyy-mm-dd"),
                isActive: data.isActive == 1 ? true : false
            });
            setIsEdit(true);
        } else {
            setValidated(false);
            setDiscount({});
            setIsEdit(false);
        }
    }, [isEditDiscount, data]);

    const onHide = () => {
        setValidated(false);
        setErrorDb(false);
        setDiscount({});
        props.onHide();
    };

    return (
        <div>
            <Modal centered {...props} onHide={onHide} >
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>{isEdit ? "????????????" : "????????????"}</Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>????????????</Form.Label>
                                <Form.Control required type="number" value={discount.percentage} name="percentage" onChange={handleChange} placeholder="?????????????????????" />
                                <Form.Control.Feedback type="invalid">
                                    ?????????????????????
                                </Form.Control.Feedback>
                            </Form.Group >
                            <Form.Group as={Col}>
                                <Form.Label>????????????</Form.Label>
                                <Form.Control required type="number" value={discount.quantity} name="quantity" onChange={handleChange} placeholder="?????????????????????" />
                                <Form.Control.Feedback type="invalid">
                                    ?????????????????????
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>????????????</Form.Label>
                                <Form.Control required type="date" value={discount.from} name="from" onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">
                                    ?????????????????????
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>????????????</Form.Label>
                                <Form.Control required type="date" value={discount.to} name="to" onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">
                                    ?????????????????????
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        {isEdit && 
                        <Form.Group >
                            <Form.Check
                                checked={discount.isActive === true}
                                type="radio"
                                label="??????"
                                onChange={() => setField("isActive", true)}
                                name="isActive"
                            />
                            <Form.Check
                                checked={discount.isActive === false}
                                type="radio"
                                label="??????"
                                onChange={() => setField("isActive", false)}
                                name="isActive"
                            />
                        </Form.Group>}
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
export default DiscountForm;