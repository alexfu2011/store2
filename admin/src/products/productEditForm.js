import React, { useState, useEffect } from 'react'
import { Form, Col, Collapse, Button, Spinner } from 'react-bootstrap';
import { getAllTags, addProduct, editProduct } from './../services/productService'
import { getAllCategory, getAllSubCategory } from './../services/categoryService'
import { BsTrashFill } from "react-icons/bs";

// import { VariantForm } from './variantForm'
// import MaterialTable from 'material-table'
import { addTag } from './../services/tagService'
import Snackbar from '@material-ui/core/Snackbar'

export const ProductForm = (props) => {

    const styles = {
        margin: "20px 50px"
    }
    const [open, setOpen] = useState(false);

    // const columns = [{ title: "Color", field: 'color' },
    // { title: "Size", field: 'size' },
    // { title: "Price", field: 'price' },
    // { title: "Stock", field: 'stock' },
    // ]
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    }
    // const [editImage, setEditImage] = useState([])
    // const [editVariant, setEditVariant] = useState({})
    // const [isVariantEdit, setIsVariantEdit] = useState(false)
    // const [modalShow, setModalShow] = React.useState(false);
    const [gallery, setGallery] = useState([])
    const [tag, setTag] = useState([])
    const [tagNew, setTagNew] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [subCategory, setSubCategory] = useState(null)
    const [category, setCategory] = useState(null)
    // const [variant, setVariant] = useState([])
    // const [variantId, setVariantId] = useState([])
    const [formf, setForm] = useState({ url: '' })
    const [isEdit, setIsEdit] = useState(false)
    const [tagId, setTagId] = useState([])
    const [nullTag, setNullTag] = useState(false)
    const [tagRequired, setTagRequired] = useState(false)
    // const {edit} = props.location.state
    const getValues = async () => {

        try {
            const category = await getAllCategory()
            setCategory(category)
            const tag = await getAllTags()
            if (props.location.state) {
                setTagId(props.location.state.tagId)

                //const data = await tag.filter(item => {
                //    return props.location.state.tagId.indexOf(item._id) === -1
                //})
                //setTag(data)
            }
            else {
                setTag(tag)
            }
        }
        catch (err) {
            console.log(err)

        }
        if (!props.location.state) {

            setIsEdit(false)
        }
        else {
            setForm(props.location.state)
            // setVariant(props.location.state.variants)
            console.log(props.location.state)
            setTagNew(props.location.state.tags)
            setSub(props.location.state.category)
            setGallery(props.location.state.gallery)
            setIsEdit(true)
        }
    }
    useEffect(() => {
        getValues()
        // setVariantRequired(false)
        setTagRequired(false)
        setValidated(false)
        setStoreError(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // const tageditor=async(data)=>{
    //    setTag(data)
    // }
    // const dataChooser = () => {

    //     return variant
    // }
    const setSub = async (value) => {
        //const data = await getAllSubCategory(value)
        //    console.log('-----------',data)
        //    setSubCategory(data)
    }
    const setField = async (field, value) => {
        if (field === 'category') {
            console.log('foreds', field, value)
            setSub(value)
        }
        setForm({
            ...formf,
            [field]: value
        })
    }
    const tagEvent = (e) => {
        setTagInput(
            e
        )
        setNullTag(false)

    }
    const setImgArray = () => {
        if (formf.url !== '') {
            console.log(formf.url)
            setGallery([...gallery,
            formf.url])
            setForm({
                ...formf,
                url: ''
            })
        }
    }
    const view = () => {
        console.log('newtag', tagNew)
        console.log('tagid', tagId)
        console.log('----', formf)
        console.log('oldtag', tag)
        console.log(gallery)
    }
    // const ss = (data) => {
    //     setVariantRequired(false)
    //     setVariant(
    //         data
    //     )
    //     setModalShow(false)
    // }
    // const s = (data) => {
    //     setVariantRequired(false)
    //     console.log('Saved',data)
    //     setVariant([
    //         ...variant,
    //         data
    //     ])
    //     setVariantId([
    //         ...variantId,
    //         data._id])
    //     setModalShow(false)
    // }
    const addTagHandler = async () => {
        if (tagInput !== '') {
            const data = await addTag(tagInput, false)
            setTagNew([
                ...tagNew,
                data
            ])
            console.log("New Tag", data)
            setTagId([
                ...tagId,
                data._id
            ])
            setTagInput('')
            setNullTag(false)
        }
        else {
            setNullTag(true)
        }
    }
    const reduceTag = (id) => {
        setTagId([
            ...tagId,
            id
        ])
        setTag(tag.filter(item => item._id !== id))
    }
    const popTag = (id) => {
        setTagId(tagId.filter(item => item !== id))
        setTagNew(tagNew.filter(item => item._id !== id))
    }
    const [validated, setValidated] = useState(false);
    const [storeError, setStoreError] = useState(false);
    // const [variantRequired, setVariantRequired] = useState(false)
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        console.log(tagId.length !== 0)
        if (tagId.length !== 0 && gallery.length !== 0 && form.checkValidity() === true) {

            event.preventDefault();
            // setVariantRequired(false)
            setTagRequired(false)
            if (isEdit) {
                // console.log('update')
                const data = await editProduct(formf, props.location.state.id, gallery, tagId)
                if (data) {
                    console.log('hi')
                    setSnackBarOpen(true)
                    setTimeout(() => {
                        props.history.push('/product/')

                    }, 1000);
                }
                else {
                    setStoreError(true)
                }
            }
            else {
                console.log('hi')
                const data = await addProduct(formf, gallery, tagId)
                if (data) {
                    setSnackBarOpen(true)
                    setTimeout(() => {
                        props.history.push('/product')

                    }, 1000);

                }
                else {
                    setStoreError(true)
                }
            }
        }

        else if (tagId.length === 0) {
            // setVariantRequired(false)
            setTagRequired(true)
            event.preventDefault();
        }
        else {
            event.preventDefault();
            setTagRequired(false)
            // setVariantRequired(true)
        }
        setValidated(true);
    };


    return (
        <div>
            <Form style={styles} noValidate validated={validated} onSubmit={handleSubmit}>
                <p>Update Product</p>
                <Form.Row>
                    <Form.Group as={Col} >
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control required type="text" value={formf.name} onChange={(e) => setField('name', e.target.value)} placeholder="Enter Product Name" />
                        <Form.Control.Feedback type="invalid">
                            Please Enter a Product Name.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} >
                        <Form.Label>Brand Name</Form.Label>
                        <Form.Control required type="text" value={formf.brandName} onChange={(e) => setField('brandName', e.target.value)} placeholder="Enter Brand Name" />
                        <Form.Control.Feedback type="invalid">
                            Please Enter a Brand Name.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Short Desription</Form.Label>
                        <Form.Control required type="text" value={formf.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} placeholder="Enter Short Description" />
                        <Form.Control.Feedback type="invalid">
                            Please Enter short description.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Desription</Form.Label>
                        <Form.Control required as="textarea" value={formf.description} onChange={(e) => setField('description', e.target.value)} placeholder="Enter Description" />
                        <Form.Control.Feedback type="invalid">
                            Please Enter description.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Sub Category</Form.Label>
                        <Form.Control required as="select" defaultValue='' value={formf.subCategory} onChange={(e) => setField('subCategory', e.target.value)} >
                            <option value=''>Select a Category</option>
                            {subCategory && subCategory.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please  choose a Category.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Price</Form.Label>
                        <Form.Control required type="number" value={formf.price} onChange={(e) => setField('price', e.target.value)} placeholder="Enter Price" />
                        <Form.Control.Feedback type="invalid">
                            Please Enter price.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control required type="number" value={formf.stock} onChange={(e) => setField('stock', e.target.value)} placeholder="Enter Stock" />
                        <Form.Control.Feedback type="invalid">
                            Please Enter Stock.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Image</Form.Label>
                        <Form.File value={formf.url} onChange={(e) => setField('url', e.target.value)} placeholder="Enter the url" />
                        <Form.Control.Feedback type="invalid">
                            Please Enter the urStock.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>

                {
                    isEdit &&
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.Check checked={formf.isActive === true}
                                type="radio"
                                label="Active"
                                name="formHorizontalRadios"
                                onClick={() => setField('isActive', true)}
                                id="formHorizontalRadios1"
                            />
                            <Form.Check checked={formf.isActive === false}
                                type="radio"
                                label="InActive"
                                onClick={() => setField('isActive', false)}
                                name="formHorizontalRadios"
                                id="formHorizontalRadios2"
                            />
                        </Form.Group>
                    </Form.Row>
                }

                {storeError && <p style={{ color: 'red' }}>Cannot {isEdit ? 'Update' : 'Save'} the data </p>}
                <Button type='submit'>Update</Button>
                <Button style={{ margin: '10px' }} onClick={() => {
                    props.history.push('/product')
                }}>
                    Back
                </Button>
            </Form>


            <Snackbar open={snackBarOpen} message={isEdit ? "Successfully Updated" : "Successfully Added"}
                autoHideDuration={3500} onClose={handleCloseSnack}>
            </Snackbar>


        </div>
    )
}
export default ProductForm
