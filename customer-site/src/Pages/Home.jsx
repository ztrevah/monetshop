import React from 'react'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import IntroBanner from '../Components/IntroBanner/IntroBanner'

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <IntroBanner/>
      </main>
      <Footer />
    </>
  )
}

export default Home;
