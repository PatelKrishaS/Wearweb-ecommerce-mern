import React from 'react'
import WWLogo from "../../assets/WW-logo.png"


export const Footer = () => {
  return (
    <div>
        <div class="d-flex flex-column flex-sm-row gap-3 my-5 mt-5 text-sm ms-5">
            <div>
                <img src={WWLogo} class="mb-3" alt="" width="100" height="80" />
                <p class="w-100 w-md-66 text-secondary" style={{maxWidth:'600px'}}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem quaerat laboriosam, provident deserunt, tempora, cumque debitis rerum ducimus voluptates harum cupiditate aspernatur ipsam sit laborum itaque optio ab veniam. Odit. 
                </p>
           </div>
           <div style={{marginLeft:'100px'}}>
                <p class="h5 mt-3 mb-4 ">COMPANY</p>
                <ul class="d-flex flex-column gap-1 text-secondary list-unstyled">
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
         </div>
         <div style={{marginLeft:'100px'}}>
                <p class="h5 font-weight-medium mb-4 mt-3">GET IN TOUCH</p>
                <ul class="list-unstyled text-secondary d-flex flex-column">
                    <li>+919313609680</li>
                    <li>contact@wearweb.com</li>
                </ul>
         </div>
       </div>
       <div>
        <hr />
        <p className='py-5 text-sm text-center '>Copyright2025@ Wearweb.com - All Rights Reserved.</p>
       </div>
    </div>
  )
}
