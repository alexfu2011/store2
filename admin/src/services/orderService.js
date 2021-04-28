import axios from 'axios';
import {url,userId} from '../constants/auth'

export const getAllOrders=async()=>{
    try{
        const data = await axios.get(url+'/get/all/orders/'+userId+'/false')
        if(!data.data.error){
            return data.data.orders
        }
    }
    catch(error){
        console.log(error)
    }
}
export const getTotalOrders=async()=>{
    try{
        const data = await axios.get(url+'/all/totalOrder/')
        if(!data.data.error){
            return {
                error:false,
                data:data.data.totalOrders
            }
        }
    }
    catch(error){
        console.log(error)
    }
}
export const getActiveOrders=async()=>{
    try{
        const data = await axios.get(url+'/all/activeOrder/')
        if(!data.data.error){
            return {
                error:false,
                data:data.data.activeOrders
            }
        }
    }
    catch(error){
        console.log(error)
    }
}