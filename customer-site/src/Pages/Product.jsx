import React from 'react'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import ProductDetail from '../Components/ProductDetail/ProductDetail'

const Product = () => {
  return (
    <>
      <Header />
      <main>
        <ProductDetail />
      </main>
      <Footer />
    </>
  )
}

export default Product;