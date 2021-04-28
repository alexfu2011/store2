import React,{useEffect, useState} from 'react'
import {getAllOrders} from '../services/orderService'
import { Button ,Spinner} from 'react-bootstrap'
import Snackbar from '@material-ui/core/Snackbar'
import MaterialTable from 'material-table'
import NavBar from '../components/navBar'
export const OrderList=(props)=>{
    const [orders,SetOrders] = useState(null)
    const [dbError,setDbError] = useState(false)
    const getOrders=async()=>{
        const data = await getAllOrders()
        if(data){
            SetOrders(data)
        }
        else{
            setDbError(true)
        }
    }
    const [snackBarOpen,setSnackBarOpen] = useState(false)
    const handleCloseSnack=()=>{
        setSnackBarOpen(false)
    }
    const columns= [
        { title: "Order Number", field: 'name' },
        { title: "Total Price", field: 'totalPrice' },
        { title: "Price Payed", field: 'totalPricePayed' },
        { title: "Payment Type", field: 'paymentType' },
        { title: "Order Status", field: 'status' },
        { title: "Payment Status", field: 'paymentSatus' },
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
        {
            editable: 'never',
            render: (rowData) => (<Button onClick={() => 
               {
                props.history.replace({
                    pathname: '/orders/details',
                    state:rowData 
                  })
                console.log(rowData._id)
               }
            }>View</Button>)
         },
        
    ]
    useEffect(()=>{
        getOrders()
        setDbError(false)
     // eslint-disable-next-line react-hooks/exhaustive-deps      
    },[props])

    return(
        <div>
            <NavBar></NavBar>
            {orders ?
        <div><h3>Orders Page</h3>
           
            <MaterialTable style={{ marginTop: '15px' }} title='' data={orders}
        columns={columns}
        // actions={ [
        //     {
        //         icon: 'edit',
        //         tooltip: 'Edit Order',
        //         onClick: async (event, rowData) => {
        //             // editActive(rowData)
        //         }
        //     }
           
        // ]}
        // editable={{
        //     onRowDelete: selectedRow => new Promise(async (resolve, reject) => {
        //         const id = selectedRow._id
        //         console.log(id)
        //     }),
        // }}
        options={{
            actionsColumnIndex: -1,
            showFirstLastPageButtons: false,
            pageSizeOptions: [5, 10, 20, 50]
        }}
    >
    </MaterialTable> 
    <Snackbar open={snackBarOpen} message="Successfully Deleted" 
    autoHideDuration={3500} onClose={handleCloseSnack}>

</Snackbar>
            </div>   :
    dbError ? 
    <div style={{width:'100%',height:'100px',marginTop:'300px'}} >
    
    <p style={{display:'block',marginLeft:'auto',
    marginRight:'auto',textAlign:'center'}}>Looks like Server Down!!
    <br/><a href="/orders">
    Try Reloading the page
    </a></p>
    
    </div>
    :
    <div style={{width:'100%',height:'100px',marginTop:'300px'}} >
    <Spinner  style={{display:'block',marginLeft:'auto',
    marginRight:'auto',height:'50px',width:'50px'}} animation="border" variant="primary" />
    <p style={{display:'block',marginLeft:'auto',
    marginRight:'auto',textAlign:'center'}}>Loading</p>
    </div>
            
        }
        </div>
    )
}
export default OrderList