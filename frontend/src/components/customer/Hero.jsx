import React from 'react'
import heroImg from "../../assets/photos/hero-img.avif"


export const Hero = () => {
  return (
    
 
    <div className="d-flex flex-column flex-sm-row border border-secondary ms-4 me-4 mt-1 " style={{height:'412px'}}>
  {/* Hero Left */}
  <div className="w-100 w-sm-50 d-flex flex-column align-items-center justify-content-center py-10 py-sm-0 text-center">
     {/* Our Best Sellers */}
        <div className="d-flex align-items-center gap-2 mt-1">
            <div className="w-25 w-md-50" style={{ height: "2px", backgroundColor: "#414141" }}></div>
            <p className="fw-bold text-uppercase text-nowrap m-0">OUR BEST SELLERS</p>
        </div>

        {/* Latest Arrivals (Now on a new line) */}
        <h1 className=" prata-regular display-4  display-5 mb-0">Latest Arrivals</h1>

        {/* Shop Now */}
        <div className="d-flex align-items-center gap-2">
            <p className="fw-bold text-uppercase text-nowrap m-0">SHOP NOW</p>
            <div className="w-25 w-md-50" style={{ height: "2px", backgroundColor: "#414141" }}></div>
        </div>
 </div>

     {/* Hero Right */}
      <img src={heroImg} alt="" />  

</div>

  )
}
