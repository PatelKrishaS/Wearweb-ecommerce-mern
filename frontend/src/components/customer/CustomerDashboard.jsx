import React from 'react'
import { Hero } from './Hero'
import { LatestCollection } from './LatestCollection'
import { BestSeller } from './BestSeller'
import { OurPolicy } from './OurPolicy'
import { Footer } from './Footer'

export const CustomerDashboard = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <Footer/>
    </div>
  )
}
