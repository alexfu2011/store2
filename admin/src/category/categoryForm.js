import React,{useEffect, useState} from 'react'
import { Button, Modal, Form, Col } from 'react-bootstrap'
import {addCategory,updateCategory} from './../services/categoryService'
import Snackbar from '@material-ui/core/Snackbar'

export const CategoryForm =(props)=> {
    const [name,setName] = useState('')
    const [isActive,setIsActive] = useState(false)
    const [validated, setValidated] = useState(false);
    const [editCategoryId,setEditCategoryId]= useState('')
    const [errorDb,setErrorDb] = useState(false)
    const [isEdit,setIsEdit]= useState(false)
   const setField=(value)=>{
        
       setName(value)   
    }
    
    const handleSubmit=async(e)=>{
       
        e.preventDefault();

        const form = e.currentTarget;
        if(form.checkValidity() === true){
            if(props.isEdit){
                
                const data = await updateCategory({name:name,
                        isActive:isActive,
                        id:editCategoryId
                })
                if (data) {
                    setSnackBarOpen(true)
                    props.onSave()
                }
                else{
                    setErrorDb(true)
                }
            }
            else{
                const data = await addCategory(name)
                if (data) {
                    setSnackBarOpen(true)
                    setIsEdit(true)
                    props.onSave()
                }
                else{
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
    const [snackBarOpen,setSnackBarOpen] = useState(false)
    const handleCloseSnack=()=>{
        setSnackBarOpen(false)
    }
    useEffect(()=>{
        if(props.isEdit){
            // console.log('hi')
            setName(props.editCategory.name)
            setIsActive(props.editCategory.isActive)
            setEditCategoryId(props.editCategory._id)
        }
        else{
            setName('')
            setValidated(false)
            setEditCategoryId([])
        }
        setErrorDb(false)          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props])

    
        return (
            <div>
            <Modal  centered  {...props} >
                <Modal.Header closeButton>
                    Add Category
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>

                            <Form.Group as={Col} >
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control required type="text" value={name}  onChange={(e) => setField( e.target.value)} placeholder="Enter Category Name" />
                                <Form.Control.Feedback type="invalid">
                                    Please Enter a Category Name.
                                    </Form.Control.Feedback>
                            </Form.Group>
                            </Form.Row>
                            <Form.Row>
                            {props.isEdit  &&
                             <Form.Group as={Col} >
                                 <Form.Check 
                                  checked={isActive === true}
                                     type="radio"
                                     label="Active"
                                     name="formHorizontalRadios"
                                      onClick={() => setIsActive(true)}
                                     id="formHorizontalRadios1"
                                 />
                                 <Form.Check 
                                   checked={isActive === false}
                                     type="radio"
                                     label="InActive"
                                     onClick={() => setIsActive(false)}
                                     name="formHorizontalRadios"
                                     id="formHorizontalRadios2"
                                 />
                             
                         </Form.Group>
                            }
                        </Form.Row>
                         <Button type='submit'> {props.isEdit ? 'Update' : 'Save'}</Button>
                    </Form>
                    
                </Modal.Body>
                <Modal.Footer>
                    {errorDb && <p><p style={{color:'red'}}>Cannot {isEdit ? 'Update' : 'Save'} data</p></p>}
                
                {/* <Button onClick={() => { view() }}>View</Button> */}
                    <Button onClick={() => { props.onHide()
                    setName('')
                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Snackbar open={snackBarOpen} message={props.isEdit?"Successfully Updated":"Successfully Added"} 
            autoHideDuration={2000} onClose={handleCloseSnack}>
       
       </Snackbar>
            </div>
       
        )

}
export default CategoryForm