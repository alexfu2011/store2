import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import { url, jwt, userId } from './../constants/auth';

export const DiscountForm = ({ onSave, isEditDiscount, data, ...props }) => {
    const [discount, setDiscount] = useState({ name: "" })
    const [validated, setValidated] = useState(false);
    const [errorDb, setErrorDb] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const handleChange = e => {
        setDiscount(discount => ({ ...discount, [e.target.name]: e.target.value }));
    }

    const addDiscount = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                name: discount.name,
                active: discount.active
            };
            const res = await fetch(url + '/discount/add', {
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

    const updateDiscount = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                _id: discount._id,
                name: discount.name,
                active: discount.active
            };
            const res = await fetch(url + '/discount/update', {
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
                const res = await updateDiscount();
                if (res) {
                    setSnackBarOpen(true);
                    onSave();
                    //setValidated(true);
                } else {
                    setErrorDb(true);
                }
            } else {
                const res = await addDiscount();
                if (res) {
                    setDiscount({ name: "" });
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
        if (isEditDiscount) {
            setDiscount(data);
            setIsEdit(true);
        } else {
            setDiscount({ name: "" });
            setIsEdit(false);
        }
    }, [isEditDiscount, data]);
    return (
        <div>
            <Modal centered  {...props} >
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>{isEdit ? "编辑折扣" : "添加折扣"}</Modal.Header>
                    <Modal.Body>
                    <Form.Group>
                        <Form.Label>折扣码</Form.Label>
                        <Form.Control required type="text" value={discount.discountCode} onChange={handleChange} placeholder="请输入折扣码" />
                        <Form.Control.Feedback type="invalid">
                            请输入折扣码
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>折扣比率</Form.Label>
                            <Form.Control required type="number" value={discount.discountPercentage} onChange={handleChange} placeholder="请输入折扣比率" />
                            <Form.Control.Feedback type="invalid">
                                请输入折扣比率
                        </Form.Control.Feedback>
                        </Form.Group >
                        <Form.Group as={Col}>
                            <Form.Label>折扣数量</Form.Label>
                            <Form.Control required type="number" value={discount.couponCount} onChange={handleChange} placeholder="请输入折扣数量" />
                            <Form.Control.Feedback type="invalid">
                            请输入折扣数量
                        </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>折扣开始日期</Form.Label>
                            <Form.Control required type="date" value={discount.discountStartDate} onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">
                                Please Enter the discount start date.
                        </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>折扣结束日期</Form.Label>
                            <Form.Control required type="date" value={discount.discountEndDate} onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">
                                Please Enter the discount end date.
                        </Form.Control.Feedback>
                        </Form.Group>

                    </Form.Row>
                    {isEdit &&

                        <Form.Group >
                            <Form.Check
                                checked={discount.isActive === true}
                                type="radio"
                                label="Active"
                                name="formHorizontalRadios"
                                onChange={handleChange}
                                id="formHorizontalRadios1"
                            />
                            <Form.Check
                                checked={discount.isActive === false}
                                type="radio"
                                label="InActive"
                                onChange={handleChange}
                                name="formHorizontalRadios"
                                id="formHorizontalRadios2"
                            />

                        </Form.Group>
                    }
                    </Modal.Body>
                    <Modal.Footer>
                        {errorDb && <p style={{ color: "red" }}>无法{isEdit ? "更新" : "保存"}数据</p>}
                        <Button type="submit">{isEdit ? "更新" : "保存"}</Button>
                        <Button onClick={() => { props.onHide() }}>关闭</Button>
                    </Modal.Footer>
                </Form>
                <Snackbar open={snackBarOpen} message={isEdit ? "Successfully Updated" : "Successfully Added"}
                    autoHideDuration={2000} onClose={handleCloseSnack}></Snackbar>
            </Modal>
        </div>
    )
}
export default DiscountForm;