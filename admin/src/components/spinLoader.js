import React from 'react'
import {Spinner} from 'react-bootstrap'

export const SpinLoader=(props)=>{
    return (
        <Spinner style={{
            display: 'block', marginLeft: 'auto',
            marginRight: 'auto', height: '50px', width: '50px'
        }} animation="border" variant="primary" />
    )
}
export default SpinLoader