import React, { useState, useEffect } from 'react'
import { Form, Col, Modal, Tabs, Tab, Button, Spinner } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import "./productForm.css";
import { addProduct, updateProduct } from "../services/productService";
import { getCategoryList } from "../services/categoryService";

export const ProductForm = ({ onSave, isEditProduct, data, ...props }) => {
    const styles = {
        margin: "20px 50px"
    };
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const handleCloseSnack = () => {
        setSnackBarOpen(false);
    };
    const [category, setCategory] = useState(null);
    const [formf, setForm] = useState({ name: "", category: { _id: "" }, brandName: "", summary: "", description: "", price: "", tax: "", shipping: "", stock: "", isActive: "" });
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState("");
    const [validated, setValidated] = useState(false);
    const [errorDb, setErrorDb] = useState(false);

    const getValues = async () => {
        try {
            const category = await getCategoryList();
            setCategory(category);
        } catch {
        }
    };

    useEffect(() => {
        if (isEditProduct) {
            setForm(data);
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }
        getValues();
    }, [isEditProduct, data]);

    const setField = async (field, value) => {
        setForm({
            ...formf,
            [field]: value
        });
    };

    const resetFrom = () => {
        setForm({ name: "", category: { _id: "" }, brandName: "", summary: "", description: "", price: "", tax: "", shipping: "", stock: "", isActive: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === true) {
            if (isEdit) {
                try {
                    const res = await updateProduct(formf);
                    if (res) {
                        setSnackBarOpen(true);
                        resetFrom();
                        onSave();
                    } else {
                        throw new Error();
                    }
                } catch {
                    setErrorDb(true);
                }
            } else {
                try {
                    const res = await addProduct(formf);
                    if (res) {
                        setSnackBarOpen(true);
                        resetFrom();
                        onSave();
                    } else {
                        throw new Error();
                    }
                } catch {
                    setErrorDb(true);
                }
            }
            setValidated(false);
        } else {
            setValidated(true);
        }
    };

    const onHide = () => {
        setValidated(false);
        setErrorDb(false);
        resetFrom();
        setImage("");
        props.onHide();
    };

    return (
        <div>
            <Modal centered {...props} onHide={onHide}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>{isEdit ? "????????????" : "????????????"}</Modal.Header>
                    <Modal.Body>
                        <Tabs defaultActiveKey="tab1" transition={false} id="noanim-tab-example">
                            <Tab eventKey="tab1" title="????????????" className="my-4">
                                <Form.Row>
                                    <Form.Group as={Col} >
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required type="text" value={formf.name} onChange={(e) => setField('name', e.target.value)} placeholder="?????????????????????" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>??????</Form.Label>
                                        <Form.Control required as="select" value={formf.category._id} onChange={(e) => setField('category', { "_id": e.target.value })} >
                                            <option value="">???????????????</option>
                                            {category && category.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required type="text" value={formf.summary} onChange={(e) => setField('summary', e.target.value)} placeholder="?????????????????????" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required as="textarea" value={formf.description} onChange={(e) => setField('description', e.target.value)} placeholder="?????????????????????" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required as="select" value={formf.isActive} onChange={(e) => setField("isActive", e.target.value)} >
                                            <option value="">?????????????????????</option>
                                            <option value="1">??????</option>
                                            <option value="2">??????</option>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} className="preview">
                                        {image ? <img src={image} alt="1" /> : (isEdit ? <img src={formf.image} alt="2" /> : "")}
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>????????????</Form.Label>
                                        <Form.File value={formf.url} onChange={(e) => {
                                            setField("image", e.target.files[0]);
                                            setImage(URL.createObjectURL(e.target.files[0]));
                                        }} placeholder="Enter the url" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                            </Tab>
                            <Tab eventKey="tab2" title="????????????" className="my-4">
                                <Form.Row>
                                    <Form.Group as={Col} >
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required type="text" value={formf.brandName} onChange={(e) => setField('brandName', e.target.value)} placeholder="?????????????????????" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required type="number" value={formf.price} onChange={(e) => setField('price', e.target.value)} placeholder="?????????????????????" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required type="number" value={formf.tax} onChange={(e) => setField('tax', e.target.value)} placeholder="?????????????????????" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required type="number" value={formf.shipping} onChange={(e) => setField('shipping', e.target.value)} placeholder="?????????????????????" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>????????????</Form.Label>
                                        <Form.Control required type="number" value={formf.stock} onChange={(e) => setField('stock', e.target.value)} placeholder="?????????????????????" />
                                        <Form.Control.Feedback type="invalid">
                                            ?????????????????????
                                </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        {errorDb && <p style={{ color: "red" }}>??????{isEdit ? "??????" : "??????"}??????</p>}
                        <Button type="submit">{isEdit ? "??????" : "??????"}</Button>
                        <Button onClick={onHide}>??????</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Snackbar open={snackBarOpen} message={isEdit ? "????????????" : "????????????"}
                autoHideDuration={3500} onClose={handleCloseSnack}>
            </Snackbar>
        </div>
    );
}
export default ProductForm;
