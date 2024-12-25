import ConnectNewsletter from '@/components/ConnectNewsletter'
import PetCategories from '@/components/Petcategories'
import ProductDetails from '@/components/ProductDetails'
import React from 'react'

const page = () => {
  return (
    <div className='bg-white'>
      <PetCategories/>
      <ProductDetails/>
      <ConnectNewsletter/>
    </div>
  )
}

export default page
