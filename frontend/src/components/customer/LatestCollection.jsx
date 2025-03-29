import React, { useEffect, useState } from 'react'
import { Title } from './Title'

export const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    
  
    
  }, [])
  

  return (
    <div class="my-5"> 
        <div class="text-center py-4 display-4">
            <Title text1={'LATEST'} text2={'COLLECTIONS'} />
            <p class="w-75 mx-auto small text-secondary"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti fugiat voluptatem saepe ex. Nihil maxime laudantium praesentium perspiciatis </p>
        </div> 
    </div>
  )
}
