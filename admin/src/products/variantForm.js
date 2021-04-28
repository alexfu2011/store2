import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Col, Collapse } from 'react-bootstrap'
import { addVariant, updateVariant } from './../services/productService'
import { BsTrashFill } from "react-icons/bs";
import Snackbar from '@material-ui/core/Snackbar'

export const VariantForm = (props) => {
    const [snackBarOpen,setSnackBarOpen] = useState(false)
    const handleCloseSnack=()=>{
        setSnackBarOpen(false)
    }
    const [variants, setVariants] = useState({})
    const [preVariant, setPreVariant] = useState([])
    const [imageArray, setImageArray] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [open, setOpen] = useState(false);
    const [nullUrl, setNullUrl] = useState(false);
    const [nullType, setNullType] = useState('');
    const [imageType, setImageType] = useState('')
    const setField = (field, value) => {
        setVariants({
            ...variants,
            [field]: value
        })

    }
    // console.log(imageArray)
    const setImgArray = () => {
        // console.log('---',imageUrl)
        // console.log('---',imageType)
        if(imageType===''){
            setNullType(true)
        }
        if(imageUrl===''){
            setNullUrl(true)
        }
        if(imageUrl!=='' && imageType!=='')
        {
            setNullType(false)
            setNullUrl(false)
            setImageArray([
                ...imageArray,
                {url:imageUrl,
                type:imageType}
    
            ])
            setImageUrl('')
        }
        setImageValidation(false)
    }
    const setImgUrl = ( value) => {
        // console.log('')
        setImageUrl(
            value
        )
        setNullUrl(false)
    }
    const setImgType = (value) => {
        setImageType(
            value
        )
        setNullType(false)
    }
    const [isEdit, setIsEdit] = useState(null)
    const [validated, setValidated] = useState(false);
    const [update, setUpdate] = useState(false)
    const [storeError,setStoreError] =useState(false)
    const [imageValidation,setImageValidation] = useState(false)
    const handleSubmitV = async (e) => {
        e.stopPropagation()
        const form = e.currentTarget;

        console.log(form.checkValidity())
        if (imageArray.length !== 0 && form.checkValidity() === true) {
            // console.log('valid')
            e.preventDefault();
             setImageValidation(false)
            if (!isEdit) {
                // console.log('add')
                const data = await addVariant(variants, imageArray)
                // console.log('dataOfAddVar')
                if (data) {
                    setSnackBarOpen(true)
                    setTimeout(() => {
                        props.onSave(data)
                    }, 1000);
                }
                else {
                    setStoreError(true)
                }
            }
            else {
                const data = await updateVariant(variants, imageArray, props.editVariant._id)
        if (data) {

            // console.log('datat', data.data.Variant)

            await setPreVariant([
                ...preVariant,
                data.data.Variant[0]
            ])

            setUpdate(true)
            setSnackBarOpen(true)
            setStoreError(false)
        }
        else{
            setStoreError(true)
        }
            }
        }
        else if (imageArray.length !== 0) {
             setImageValidation(false)
            e.preventDefault();
        }
        else {
            e.preventDefault();
             setImageValidation(true)
        }
        setValidated(true);
    };
   
    
    const view=()=>{
        console.log('Image',imageArray)
        console.log('Prevar',preVariant)
    }
    const updateV = () => {
       
       setTimeout(() => {
           
        props.updatevariant(preVariant)
       }, 1000);
    }

    useEffect(() => {
        if (props.editVariant) {
            setVariants(props.editVariant)
        }
        if (props.editImage) {
            setImageArray(props.editImage)
            // console.log("image", props.editImage)
        }
        if (props.edit) {
            setIsEdit(props.edit)
        }
        else {
            setIsEdit(false)
        }

        if (props.variant) {
            setPreVariant(props.variant.filter(item => item._id !== props.editVariant._id));
        }
        setStoreError(false)
        setValidated(false)
        setImageValidation(false)
        setUpdate(false)
        setNullType(false)
        setNullUrl(false)
        

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])
    return (

        <div>
            {props.editVariant &&
                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Variant
      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                        <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Variant images</Form.Label>

                                    <Form.Control type="text" value={imageUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="Enter Variant Image URL" />
                                </Form.Group>
                                {nullUrl && <p style={{color:'red'}}>Null value cannot be accepted</p>}
                                <Form.Group as={Col} >
                                    <Form.Check
                                    
                                        type="radio"
                                        label="Image"
                                        name="formHorizontalRadios"
                                        onClick={() => setImgType('image')}
                                        id="formHorizontalRadios1"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Video"
                                        onClick={() => setImgType( 'video')}
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                    />
                                </Form.Group>
                                {nullType && <p style={{color:'red'}}>Null type cannot be accepted</p>}
                                <Button style={{ marginTop: '30px', height: '40px' }} onClick={() => { setImgArray() }}>Add</Button>
                            </Form.Row>
                            {imageValidation && <p style={{color:'red'}}>Atleast one image should be added</p>}
                            {imageArray && imageArray.map((team) => <img
                                src={team.url}
                                height="50px"
                                width="50px"
                                alt="added_image"
                            />)}
                            <br></br>
                            {/* {newimg && newimg.map((team) => <img 
      src={team.url}
      height="50px"
      width="50px"
      alt="a_image"
      />)} */}

                            <Button
                                onClick={() => setOpen(!open)}
                                aria-controls="example-collapse-text"
                                aria-expanded={open}
                            >
                                {!open ? 'Edit Images' : 'close'}
                            </Button>

                            <Collapse in={open}>
                                <div >
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>


                                        {imageArray && imageArray.map((team) => <div style={{
                                            width: '120px', borderRadius: '10%', border: '1px solid #777',
                                            display: 'flex', flexDirection: 'column',
                                            margin: '10px', padding: "5px"
                                        }}>
                                            <BsTrashFill style={{ marginLeft: '80px' }} size={30} onClick={() => {
                                                console.log(team._id)
                                                setImageArray(imageArray.filter(item => item.url !== team.url));
                                            }} />
                                            <img
                                                src={team.url}
                                                height="100px"
                                                width="100px"
                                                alt="added_image"
                                            />

                                        </div>
                                        )}
                                    </div>
                                </div>
                            </Collapse>
                        
                        </Form>
                        <Form noValidate validated={validated} onSubmit={handleSubmitV}>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Variant Color</Form.Label>

                                    <Form.Control required value={variants.color} type="text" onChange={(e) => setField('color', e.target.value)} placeholder="Enter Variant Color" />
                                    <Form.Control.Feedback type="invalid">
                              Please  enter a color.
            </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Variant Size</Form.Label>
                                    <Form.Control required as="select" defaultValue='' value={variants.size} onChange={e => setField('size', e.target.value)}>
                                        <option value=''>choose the size</option>
                                        <option value='XS'>XS</option>
                                        <option value='S'>S</option>
                                        <option value='M'>M</option>
                                        <option value='L'>L</option>
                                        <option value='XL'>XL</option>
                                        <option value='XXL'>XXL</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                              Please  choose a Size.
            </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Variant Price</Form.Label>
                                    <Form.Control required type="number" value={variants.price} onChange={(e) => setField('price', e.target.value)} placeholder="Enter Variant Price" />
                                    <Form.Control.Feedback type="invalid">
                              Please enter the price.
            </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Variant stock</Form.Label>
                                    <Form.Control required type="number" value={variants.stock} onChange={(e) => setField('stock', e.target.value)} placeholder="Enter Stocks" />
                                    <Form.Control.Feedback type="invalid">
                              Please  enter the stocks availabe.
            </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            {!update && <Button  type='submit'>{ isEdit ? 'Update' : 'Save'}</Button>}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {update && <p style={{ color: 'green' }}>Succesfully updated!!</p>}
                        {storeError && <p style={{ color: 'red' }}>Error in { isEdit ? 'Updating' : 'Saving'}!!</p>}
                        {!update && <Button onClick={props.onHide}>Close</Button>}
                        {update && <Button onClick={() => { updateV() }}>Close</Button>}
                        
                        <Snackbar open={snackBarOpen} message={isEdit?"Successfully Updated Variants":"Successfully Added Variants"} 
             autoHideDuration={3500} onClose={handleCloseSnack}>
                
        </Snackbar>
                        <Button onClick={()=>{view()}}>View</Button>
                    </Modal.Footer>
                </Modal>
            }
    
        </div>

    );
}
export default VariantForm