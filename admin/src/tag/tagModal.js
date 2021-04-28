import React, { useState ,useEffect} from 'react'
import { Button, Modal, Form, Col } from 'react-bootstrap'
import {addTag,updateTag} from './../services/tagService'
import Snackbar from '@material-ui/core/Snackbar'

export const TagModal = (props) => {
    const [snackBarOpen,setSnackBarOpen] = useState(false)
    const handleCloseSnack=()=>{
        setSnackBarOpen(false)
    }
    const [validated, setValidated] = useState(false)
    const [tagName,setTagName]=useState('')
    const [dbError,setDbError]= useState(false)
    const [isActive,setIsActive]= useState(null)
    const [tagId,setTagId]=useState(null)
    const setField =(value)=>{
        // console.log(value)
        setTagName(
            value
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === true){
            setValidated(true)
            if(!props.isEdit){
                const addTagResponse = await addTag(tagName,true)
                if(addTagResponse){
                    
                    setSnackBarOpen(true)
                    setDbError(false)
                   setTimeout(() => {
                    props.onHide()
                   }, 100);
                }
                else{
                    setDbError(true)
                }
            }
            else{
                const data = {
                    tag:tagName,
                    isActive:isActive,
                    _id:tagId
                }
                // console.log(data)
                const updateTagResponse = await updateTag(data)
                if(updateTagResponse){
                    
                    setSnackBarOpen(true)
                    props.onSave()               
                }
                else{
                    setDbError(true)
                }
            }
           
        }
        
        setValidated(true)
       
    }
    useEffect(()=>{
        if(props.isEdit){
            // console.log('-----------------',props.editTag)
            setTagName(props.editTag.tag)
            setIsActive(props.editTag.isActive)
            setTagId(props.editTag._id)
        }
        else{
            setTagName('')
            setValidated(false)
            setSnackBarOpen(false)
            
        }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props])
    return (
        <div>

            <Modal centered  {...props} >
                <Modal.Header closeButton>
                    Add Category
        </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Tag Name</Form.Label>
                                <Form.Control required value={tagName} type="text"  onChange={(e) => setField( e.target.value)} placeholder="Enter Tag Name" />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the tag name.
            </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                     
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
                              <Button type='submit'> {props.isEdit ? 'Update' : 'Save'}</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                  {dbError &&   <p style={{color:'red'}}>Cannot { props.isEdit ? 'Update' : 'Save'} data</p>}

                    {/* <Button onClick={() => { view() }}>View</Button> */}
                    <Button onClick={() => {
                        props.onHide()

                    }}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Snackbar open={snackBarOpen} message={props.isEdit?"Successfully Updated":"Successfully Added"} 
            autoHideDuration={2000} onClose={handleCloseSnack}>
       
       </Snackbar>
        </div>
    )
}
export default TagModal