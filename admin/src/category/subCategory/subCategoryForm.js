import React, { useState,useEffect } from 'react'
import {Button,Form} from 'react-bootstrap'
import {getAllCategory,addSubCategory,updateSubCategory} from './../../services/categoryService'
import './subCategory.css'
import Snackbar from '@material-ui/core/Snackbar'

export const SubCategoryForm=(props)=>{
    const [categoryList,setCategoryList]=useState(null)
    const [validated,setValidated]=useState(false)
    const [subCategory,setSubCategory]=useState({
        subCategoryName:'',
        categoryId:''
    })
    const [snackBarOpen,setSnackBarOpen] = useState(false)
    const handleCloseSnack=()=>{
        setSnackBarOpen(false)
    }
    const [dbError,setDbError]= useState(false)
    const [isActive,setIsActive]=useState(null)
    const [isEdit,setIsEdit]= useState(false)
    const getCategory=async()=>{
        const data = await getAllCategory()
        if(data){
            setCategoryList(data)
        }
    }
    const setField=(field,value)=>{
        setSubCategory({
            ...subCategory,
            [field]:value
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const form = e.currentTarget;
        if(form.checkValidity() === true){
            if(!isEdit){
                const data = await addSubCategory(subCategory)
            if(data){
                setSnackBarOpen(true)
                setTimeout(() => {
                    props.history.replace('/category')
                }, 1000);

            }
            else{
                setDbError(true)
            }
            }
            else{
                const data = await updateSubCategory(subCategory,isActive,props.location.state._id)
                if(data){
                    setSnackBarOpen(true)
                    setTimeout(() => {
                        props.history.replace('/category')
                    }, 1000);
                    }
                else{
                    setDbError(true)
                }
            }
        }
        setValidated(true)
    }
    useEffect(()=>{
        getCategory()
        setIsEdit(false)
        if (props.location.state){
            setIsEdit(true)
            console.log('----===',props.location.state)
            setSubCategory({
                subCategoryName:props.location.state.name,
                categoryId:props.location.state.parentCategory
            })
            setIsActive(props.location.state.isActive)
        }
        
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <div className="page">
            <Button onClick={()=>{props.history.push('/category')}}>Back</Button>
        <div className="form-box">
        <Form noValidate validated={validated} onSubmit={handleSubmit} >
                      
                            <Form.Group>
                                <Form.Label>Sub Category Name</Form.Label>
                                <Form.Control required type="text" value={subCategory.subCategoryName} onChange={(e)=>{setField( 'subCategoryName',e.target.value)}} placeholder="Enter Sub Category Name" />
                                <Form.Control.Feedback type="invalid">
                                    Please Enter a sub Category Name.
                                    </Form.Control.Feedback>

                            </Form.Group>
                            
                          
                            <Form.Group  >
                                <Form.Label>Sub Category Name</Form.Label>
                                <Form.Control required as="select" value={subCategory.categoryId}  defaultValue=''onChange={(e)=>{setField('categoryId',e.target.value)}} >
                                <option value=''>Select a sub Category</option>
                                {categoryList && categoryList.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}

                            </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    Please Select a sub Category Type.
                                    </Form.Control.Feedback>

                            </Form.Group>
                            {isEdit  &&
                             <Form.Group  >
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
                            
                            <Button type="submit" >{isEdit?"Update":"Save"}</Button>
                            {dbError && <p style={{color:'red'}}>Cannot {isEdit?"Update":"Save"} data</p>}
                            </Form>
            </div>       
            <Snackbar open={snackBarOpen} message={isEdit?"Successfully updated":"Successfully Saved"} 
            autoHideDuration={3500} onClose={handleCloseSnack}>
       
       </Snackbar>
        </div>
    )
}
export default SubCategoryForm