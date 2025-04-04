import React from 'react'
import { Title } from './Title'
import contact_img from '../../assets/photos/contact_img.png'


export const Contact = () => {
  return (
    <div>
      <div className="text-center py-1 display-4" style={{fontSize:'28px'}}>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className="d-flex flex-column justify-content-center flex-md-row gap-3 mb-5">        
        <img  src={contact_img} alt=""  style={{width:'450px', marginRight:'50px'}}/>
        <div className='d-flex flex-column justify-content-center align-items-start gap-3'>
          <p className='fw-semibold fs-4 text-muted'>Our Store</p>
          <p className='text-muted'>Gujarat, India</p>
          <p className='text-muted'>Tel: +919313609680 <br /> Email: contact@wearweb.com</p>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  )
}
