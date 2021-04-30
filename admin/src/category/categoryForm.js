import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Col } from 'react-bootstrap'
import { addCategory, updateCategory } from './../services/categoryService'
import Snackbar from '@material-ui/core/Snackbar'
import { url, jwt, userId } from './../constants/auth';

export const CategoryForm = (props) => {
    const [name, setName] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [validated, setValidated] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState('')
    const [errorDb, setErrorDb] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const setField = (value) => {
        setName(value)
    }

    const addCategory = async () => {
        try {
            const token = localStorage.getItem("token");
            const body = {
                name: "foo",
            };
            console.log(body);
            const res = fetch(url + '/category/add/user/60826e0faab69e002b1293d1', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                //setAuth(true);
                //setCategoryList(res.data);
            } else if (res.status === 400 || res.status === 401) {
                //setAuth(false);
            }
        } catch (err) {
            if (err) {
                //setDbError(true);
            }
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            if (props.isEdit) {
                const data = await updateCategory({
                    name: name,
                    isActive: isActive,
                    id: editCategoryId
                })
                if (data) {
                    setSnackBarOpen(true)
                    props.onSave()
                }
                else {
                    setErrorDb(true)
                }
            }
            else {
                const data = await addCategory(name)
                if (data) {
                    setSnackBarOpen(true)
                    setIsEdit(true)
                    props.onSave()
                }
                else {
                    setErrorDb(true)
                }
            }
        }
        setValidated(true);
    }

    // const view=()=>{
    //     console.log('======',name)
    //     console.log('=--=-=',props)
    //     console.log(editCategoryId)
    // }
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    }
    useEffect(() => {
        if (props.isEdit) {
            // console.log('hi')
            setName(props.editCategory.name)
            setIsActive(props.editCategory.isActive)
            setEditCategoryId(props.editCategory._id)
        }
        else {
            setName('')
            setValidated(false)
            setEditCategoryId([])
        }
        setErrorDb(false)          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    return (
        <div>
            <Modal centered  {...props} >
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>{props.isEdit ? "编辑分类" : "添加分类"}</Modal.Header>
                    <Modal.Body>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>分类名称</Form.Label>
                                <Form.Control required type="text" value={name} onChange={(e) => setField(e.target.value)} placeholder="分类名称" />
                                <Form.Control.Feedback type="invalid">请输入分类名称</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                    </Modal.Body>
                    <Modal.Footer>
                        {errorDb && <p><p style={{ color: "red" }}>无法{props.isEdit ? "更新" : "保存"}数据</p></p>}
                        <Button type="submit">{props.isEdit ? "更新" : "保存"}</Button>
                        <Button onClick={() => {
                            props.onHide()
                            setName("")
                        }}>关闭</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Snackbar open={snackBarOpen} message={props.isEdit ? "Successfully Updated" : "Successfully Added"}
                autoHideDuration={2000} onClose={handleCloseSnack}>

            </Snackbar>
        </div>

    )

}
export default CategoryForm