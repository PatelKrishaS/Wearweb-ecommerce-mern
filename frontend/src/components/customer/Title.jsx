import React from 'react'

export const Title = ({text1, text2}) => {
  return (
    <div className="d-inline-flex gap-2 align-items-center "> 
        <p className="text-muted " >{ text1 } <span class="text-dark fw-medium">{ text2 }</span></p> 
        <p className="w-8 w-sm-12" style={{ height: "2px", backgroundColor: "#4a4a4a" ,width:'60px' }}></p>
    </div>
  )
}
