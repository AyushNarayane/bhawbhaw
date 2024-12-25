"use client"

import ConnectNewsletter from '@/components/ConnectNewsletter'
import PetCategories from '@/components/Petcategories'
import ProductGrid from '@/components/ProductGrid'
import ProtectedHomeRoute from '@/components/ProtectedHomeRoute'
import React from 'react'

const page = () => {
  return (
    <div className='bg-black'>
      <PetCategories/>
      <ProductGrid/>
      <ConnectNewsletter bg='#2E2624'/>
    </div>
  )
}

export default ProtectedHomeRoute(page)
