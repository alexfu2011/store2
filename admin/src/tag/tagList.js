import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table'
import { getAllTag, deleteTag } from './../services/tagService'
import { Spinner, Button } from 'react-bootstrap'
import Snackbar from '@material-ui/core/Snackbar'
import TagModal from './tagModal'
import NavBar from '../components/navBar'
export const TagList = (props) => {
    const [tag, SetTag] = useState(null)
    const [modalShow, setModalShow] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editTag, setEditTag] = useState([])
    const [dbError, setDbError] = useState(false)
    const getTag = async () => {
        const data = await getAllTag()
        // console.log(data)
        if (data) {
            SetTag(data)
        }
        else {
            setDbError(true)
        }
    }
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const handleCloseSnack = () => {
        setSnackBarOpen(false)
    }
    const open = () => {
        setModalShow(true)
    }
    const modalClose = () => {
        getTag()
        setModalShow(false)
        setTimeout(() => {
            setIsEdit(false)
        }, 1500);
    }
    const onSave = () => {
        getTag()
        setModalShow(false)
        setTimeout(() => {
            setIsEdit(false)
        }, 1500);
    }
    const editActive = (data) => {
        setEditTag(data)
        setIsEdit(true)
        setModalShow(true)
    }
    const columns = [
        { title: "Tag Name", field: 'tag' },
        {
            title: "Is Active", field: 'isActive',
            render: rowData => {
                if (rowData.isActive) {
                    return (
                        <p style={{ color: 'green', fontWeight: "bolder" }}>Active</p>
                    )
                }
                else {
                    return (
                        <p style={{ color: 'red', fontWeight: "bolder" }}>InActive</p>
                    )
                }
            }
        },
    ]
    useEffect(() => {
        getTag()
        setSnackBarOpen(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps      
    }, [])
    return (
        <div>
            <NavBar></NavBar>
            {tag ?
                <div style={{ margin: '30px' }}>
                    <Button onClick={() => { open() }}>Add Tag</Button>
                    <MaterialTable title="Tag" columns={columns} data={tag} style={{ margin: '0 490px' }}
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: 'Edit Tag',
                                onClick: async (event, rowData) => {
                                    editActive(rowData)
                                }
                            }
                        ]}
                        editable={{
                            onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
                                const id = selectedRow._id
                                const data = await deleteTag(id)
                                if (data) {
                                    setSnackBarOpen(true)
                                    getTag()
                                    resolve()
                                }
                            }),
                        }}
                        options={{
                            actionsColumnIndex: -1,
                            showFirstLastPageButtons: false,
                            pageSizeOptions: [5, 10, 20, 50]
                        }}
                    ></MaterialTable>
                    <TagModal
                        show={modalShow}
                        onHide={() => {
                            modalClose()
                        }}
                        editTag={editTag}
                        isEdit={isEdit}
                        onSave={onSave}
                    ></TagModal>
                    <Snackbar open={snackBarOpen} message="Successfully Deleted"
                        autoHideDuration={2000} onClose={handleCloseSnack}>
                    </Snackbar>
                </div>
                : dbError ?
                    <div style={{ width: '100%', height: '100px', marginTop: '300px' }} >

                        <p style={{
                            display: 'block', marginLeft: 'auto',
                            marginRight: 'auto', textAlign: 'center'
                        }}>Looks like Server Down!!
   <br /><a href="/tags">
                                Try Reloading the page
</a></p>
                    </div>
                    :
                    <div style={{ width: '100%', height: '100px', marginTop: '300px' }} >
                        <Spinner style={{
                            display: 'block', marginLeft: 'auto',
                            marginRight: 'auto', height: '50px', width: '50px'
                        }} animation="border" variant="primary" />
                        <p style={{
                            display: 'block', marginLeft: 'auto',
                            marginRight: 'auto', textAlign: 'center'
                        }}>Loading</p>
                    </div>
            }
        </div>
    )
}
export default TagList