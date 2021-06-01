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
                    <Modal.Header closeButton>{isEdit ? "编辑折扣" : "添加折扣"}</Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>折扣比率</Form.Label>
                                <Form.Control required type="number" value={discount.percentage} name="percentage" onChange={handleChange} placeholder="请输入折扣比率" />
                                <Form.Control.Feedback type="invalid">
                                    请输入折扣比率
                                </Form.Control.Feedback>
                            </Form.Group >
                            <Form.Group as={Col}>
                                <Form.Label>折扣数量</Form.Label>
                                <Form.Control required type="number" value={discount.quantity} name="quantity" onChange={handleChange} placeholder="请输入折扣数量" />
                                <Form.Control.Feedback type="invalid">
                                    请输入折扣数量
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>开始日期</Form.Label>
                                <Form.Control required type="date" value={discount.from} name="from" onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">
                                    请选择开始日期
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>结束日期</Form.Label>
                                <Form.Control required type="date" value={discount.to} name="to" onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">
                                    请选择结束日期
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group >
                            <Form.Check
                                checked={discount.isActive === true}
                                type="radio"
                                label="有效"
                                onChange={() => setField("isActive", true)}
                                name="isActive"
                            />
                            <Form.Check
                                checked={discount.isActive === false}
                                type="radio"
                                label="无效"
                                onChange={() => setField("isActive", false)}
                                name="isActive"
                            />
                        </Form.Group>
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
export default DiscountForm;