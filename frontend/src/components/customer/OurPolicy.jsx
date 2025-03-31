import React from 'react'
import exchangeIcon from '../../assets/photos/exchange_icon.png'
import qualityIcon from '../../assets/photos/quality_icon.png'
import supportImg from '../../assets/photos/support_img.png'

export const OurPolicy = () => {
  return (
    <div class="d-flex flex-column flex-sm-row justify-content-around gap-1 text-center py-5 text-xs text-sm text-md text-secondary">
        <div>
            <img src={exchangeIcon} alt="" class="w-12 mx-auto mb-5" style={{width:'40px'}}/>
            <p class="fw-bold text-dark">Easy Exchange Policy</p>
            <p class="text-muted">We offer hassle free exchange policy</p>
        </div>
        <div>
            <img src={qualityIcon} alt="" class="w-12 mx-auto mb-5" style={{width:'40px'}}/>
            <p class="fw-bold text-dark">7 Days Return Policy</p>
            <p class="text-muted">We provide 7 days free return policy</p>
        </div>
        <div>
            <img src={supportImg} alt="" class="w-12 mx-auto mb-5" style={{width:'40px'}}/>
            <p class="fw-bold text-dark">Best Customer Support</p>
            <p class="text-muted">We provide 24/7 customer support</p>
        </div>
   </div>
  )
}
