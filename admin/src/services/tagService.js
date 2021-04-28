import * as axios from 'axios'
import {url,jwt,userId} from './../constants/auth'


export const addTag = async(tag,value)=>{
    
    try {
        const data = await axios.post(url+'/add/tag/'+userId, 
        {
           tag:tag,
            "jwtToken": jwt
    })
    // console.log('Tagd',data)
    
    if(!data.data.error && !value){
        
        return data.data.tag
    }
    else if(!data.data.error && value){
        return true
    }
    }
    catch(err){
        if(err){
            return false
        }
        // console.log("error in add variant",err)
    }
    
}

export const getAllTag = async()=>{
    try{
        const data = await axios.get(url+'/all/tag')
        if (!data.data.error){
            return data.data.tags
        }
    }
    catch(error){
        console.log(error)
    }
}
export const deleteTag=async(tagId)=>{
    console.log(tagId)
    try{
        const data = await axios.put(url+'/delete/tag/'+userId+'/'+tagId,{
            "jwtToken": jwt
        })
        // console.log(data)
        if (!data.data.error){
            return true
        }
        else{
            return false
        }
    }
    catch(error){
        console.log(error)
    }
}
export const updateTag=async(tag)=>{
    console.log(tag)
    try{
        const data = await axios.put(url+'/update/tag/'+userId+'/'+tag._id,{
            "jwtToken": jwt,
            tag:tag.tag,
            isActive:tag.isActive
        })
        // console.log(data)
        if (!data.data.error){
            return true
        }
        else{
            return false
        }
    }
    catch(error){
        console.log(error)
    }
}