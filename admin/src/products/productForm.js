import React, { useState, useEffect } from 'react'
import { Form, Col, Modal, Button, Spinner } from 'react-bootstrap';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === true) {
            if (isEdit) {
                try {
                    const res = await updateProduct(formf);
                    if (res) {
                        setSnackBarOpen(true);
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
        setForm({ name: "", category: { _id: "" }, brandName: "", summary: "", description: "", price: "", tax: "", shipping: "", stock: "", isActive: "" });
        setImage("");
        props.onHide();
    };

    return (
        <div>
            <Modal centered {...props} onHide={onHide}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>{isEdit ? "编辑产品" : "添加产品"}</Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>产品名称</Form.Label>
                                <Form.Control required type="text" value={formf.name} onChange={(e) => setField('name', e.target.value)} placeholder="请输入产品名称" />
                                <Form.Control.Feedback type="invalid">
                                    请输入产品名称
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>品牌名称</Form.Label>
                                <Form.Control required type="text" value={formf.brandName} onChange={(e) => setField('brandName', e.target.value)} placeholder="请输入品牌名称" />
                                <Form.Control.Feedback type="invalid">
                                    请输入品牌名称
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>产品简介</Form.Label>
                                <Form.Control required type="text" value={formf.summary} onChange={(e) => setField('summary', e.target.value)} placeholder="请输入产品简述" />
                                <Form.Control.Feedback type="invalid">
                                    请输入产品简介
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>产品描述</Form.Label>
                                <Form.Control required as="textarea" value={formf.description} onChange={(e) => setField('description', e.target.value)} placeholder="请输入产品描述" />
                                <Form.Control.Feedback type="invalid">
                                    请输入产品描述
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>分类</Form.Label>
                                <Form.Control required as="select" value={formf.category._id} onChange={(e) => setField('category', { "_id": e.target.value })} >
                                    <option value="">请选择分类</option>
                                    {category && category.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    请输入产品分类
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>产品价格</Form.Label>
                                <Form.Control required type="number" value={formf.price} onChange={(e) => setField('price', e.target.value)} placeholder="请输入产品价格" />
                                <Form.Control.Feedback type="invalid">
                                    请输入产品价格
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>产品税费</Form.Label>
                                <Form.Control required type="number" value={formf.tax} onChange={(e) => setField('tax', e.target.value)} placeholder="请输入产品价格" />
                                <Form.Control.Feedback type="invalid">
                                    请输入产品税费
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>产品运费</Form.Label>
                                <Form.Control required type="number" value={formf.shipping} onChange={(e) => setField('shipping', e.target.value)} placeholder="请输入产品价格" />
                                <Form.Control.Feedback type="invalid">
                                    请输入产品运费
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>产品库存</Form.Label>
                                <Form.Control required type="number" value={formf.stock} onChange={(e) => setField('stock', e.target.value)} placeholder="请输入产品库存" />
                                <Form.Control.Feedback type="invalid">
                                    请输入产品库存
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>产品状态</Form.Label>
                                <Form.Control required as="select" value={formf.isActive} onChange={(e) => setField("isActive", e.target.value)} >
                                    <option value="">请选择产品状态</option>
                                    <option value="1">上架</option>
                                    <option value="2">下架</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    请选择产品状态
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
                                <Form.Label>产品图片</Form.Label>
                                <Form.File value={formf.url} onChange={(e) => {
                                    setImage(e.target.files[0]);
                                    setImage(URL.createObjectURL(e.target.files[0]));
                                }} placeholder="Enter the url" />
                                <Form.Control.Feedback type="invalid">
                                    请上传产品图片
                                </Form.Control.Feedback>
                            </Form.Group>
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
                autoHideDuration={3500} onClose={handleCloseSnack}>
            </Snackbar>
        </div>
    );
}
export default ProductForm;
