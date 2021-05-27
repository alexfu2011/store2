import React, { useState, useEffect } from 'react'
import { Form, Col, Modal, Button, Spinner } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import { url, jwt, userId } from "./../constants/auth";
import "./productForm.css";

export const ProductForm = ({ onSave, isEditProduct, data, ...props }) => {
    const styles = {
        margin: "20px 50px"
    };
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const handleCloseSnack = () => {
        setSnackBarOpen(false);
    };
    const [category, setCategory] = useState(null);
    const [formf, setForm] = useState({ name: "", category: { _id: "" }, brandName: "", summary: "", description: "", price: "", stock: "", isActive: 1 });
    const [isEdit, setIsEdit] = useState(false);
    const [errorDb, setErrorDb] = useState(false);
    const [image, setImage] = useState("");

    const addProduct = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("name", formf.name);
            formData.append("brandName", formf.brandName);
            formData.append("summary", formf.summary);
            formData.append("description", formf.description);
            formData.append("category", formf.category);
            formData.append("price", formf.price);
            formData.append("stock", formf.stock);
            formData.append("isActive", formf.isActive);
            formData.append("image", formf.image);

            const res = await fetch(url + '/product/add', {
                method: 'POST',
                body: formData,
                headers: {
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

    const updateProduct = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("name", formf.name);
            formData.append("brandName", formf.brandName);
            formData.append("summary", formf.summary);
            formData.append("description", formf.description);
            formData.append("category", formf.category._id);
            formData.append("price", formf.price);
            formData.append("stock", formf.stock);
            formData.append("isActive", formf.isActive);
            formData.append("image", formf.image);

            const res = await fetch(url + '/product/update/' + formf._id, {
                method: 'PUT',
                body: formData,
                headers: {
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

    const getCategory = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = localStorage.getItem("token");
                fetch(url + "/category", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else if (res.status === 401) {
                        reject(false);
                    }
                }).then(data => {
                    resolve(data);
                });
            } catch (error) {
                if (error) {
                    reject(false);
                }
            }
        });
    };

    const getValues = async () => {
        try {
            const category = await getCategory();
            setCategory(category);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (isEditProduct) {
            setForm(data);
            setIsEdit(true);
        } else {
            setForm({ name: "", category: { _id: "" }, brandName: "", summary: "", description: "", price: "", stock: "", isActive: 1 });
            setIsEdit(false);
        }
        getValues();
        setValidated(false);
    }, [isEditProduct, data]);

    const setField = async (field, value) => {
        setForm({
            ...formf,
            [field]: value
        })
    };

    const [validated, setValidated] = useState(false);
    const [storeError, setStoreError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            if (isEdit) {
                const res = await updateProduct();
                if (res) {
                    setSnackBarOpen(true);
                    onSave();
                } else {
                    setErrorDb(true);
                }
            } else {
                const res = await addProduct();
                if (res) {
                    setSnackBarOpen(true);
                    onSave();
                } else {
                    setErrorDb(true);
                }
            }
        }
    };

    return (
        <div>
            <Modal centered {...props} onHide={() => { setImage(""); props.onHide(); }}>
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
                                <Form.Control required as="select" value={formf.category._id} onChange={(e) => setField('category', e.target.value)} >
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
                        {errorDb && <p><p style={{ color: "red" }}>无法{isEdit ? "更新" : "保存"}数据</p></p>}
                        <Button type="submit">{isEdit ? "更新" : "保存"}</Button>
                        <Button onClick={() => { setImage(""); props.onHide(); }}>关闭</Button>
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
