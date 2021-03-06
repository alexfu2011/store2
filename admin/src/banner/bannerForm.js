import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import { updateBanner, addBanner } from "../services/bannerService";

export const BannerForm = ({ onSave, isEditBanner, data, ...props }) => {
    const [banner, setBanner] = useState({ name: "" });
    const [validated, setValidated] = useState(false);
    const [errorDb, setErrorDb] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [image, setImage] = useState("");

    const handleChange = e => {
        setBanner({ ...banner, [e.target.name]: e.target.value });
    };

    const setField = (field, value) => {
        setBanner({
            ...banner,
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
                    const res = await updateBanner(banner);
                    if (res) {
                        setBanner({ name: "" });
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
                    const res = await addBanner(banner);
                    if (res) {
                        setBanner({ name: "" });
                        setSnackBarOpen(true);
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

    useEffect(() => {
        if (isEditBanner) {
            setBanner({ _id: data._id, name: data.name, image: data.image, isActive: data.isActive == 1 ? true : false });
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }
    }, [isEditBanner, data]);

    const onHide = () => {
        setValidated(false);
        setErrorDb(false);
        setBanner({ name: "" });
        setImage("");
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
                                <Form.Control required type="text" value={banner.name} name="name" onChange={e => setField("name", e.target.value)} placeholder="????????????" />
                                <Form.Control.Feedback type="invalid">?????????????????????</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} className="preview">
                                {image ? <img src={image} alt="1" /> : (isEdit ? <img src={banner.image} alt="2" /> : "")}
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>????????????</Form.Label>
                                <Form.File value={banner.url} onChange={(e) => {
                                    setField("image", e.target.files[0]);
                                    setImage(URL.createObjectURL(e.target.files[0]));
                                }} placeholder="Enter the url" />
                                <Form.Control.Feedback type="invalid">
                                    ?????????????????????
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            {isEdit &&
                                <Form.Group >
                                    <Form.Check
                                        checked={banner.isActive === true}
                                        type="radio"
                                        label="??????"
                                        onChange={() => setField("isActive", true)}
                                        name="isActive"
                                    />
                                    <Form.Check
                                        checked={banner.isActive === false}
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
export default BannerForm;