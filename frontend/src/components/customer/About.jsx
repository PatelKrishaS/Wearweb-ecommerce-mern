import React from 'react'
import { Title } from './Title';
import about_img from '../../assets/photos/about_img.png'



export const About = () => {
  return (
    <div>
      <div className="text-center py-4 display-4">
        <Title text1={'ABOUT'} text2={'PAGE'} style={{fontSize:'28px'}} />
      </div>
      <div className="d-flex flex-column flex-md-row gap-4" style={{marginLeft:'50px'}}>          
        <img className="w-md-50" src={about_img} alt="" style={{width:'450px'}}/>
          <div className=" d-flex flex-column justify-content gap-3" style={{width: '50%', color:' #4a5568', marginTop:'20px'}}>
            <p>Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
            <p>Since our inception, we've worked tirelessly to curate a diverse selection ofhigh-quality products that cater to every taste and preference.From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
            <b className='text-gray-800'>Our Mission</b>
              <p>Our mission at Wear Web is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
          </div>

      </div>
      <div className="py-5 display-4 ms-5">
        <Title text1={'WHY'} text2={'CHOOSE US'} style={{fontSize:'28px'}} />
      </div>
      <div className="row mb-5 gx-4 gy-4 text-sm">
        <div className="col-12 col-md-6">
          <div className="border px-4 px-md-5 py-4 py-sm-5 d-flex flex-column gap-3">
            <b>Quality Assurance</b>
            <p className="text-secondary">
              We meticulously select and vet each product to ensure it meets our stringent quality standards.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="border px-4 px-md-5 py-4 py-sm-5 d-flex flex-column gap-3">
            <b>Convenience</b>
            <p className="text-secondary">
              With our user-friendly interface and hassle-free ordering process, shopping has never been easier.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
