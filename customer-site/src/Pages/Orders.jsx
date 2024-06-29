import React from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import OrdersView from '../Components/OrdersView/OrdersView';


const About = () => {
  return (
    <>
      <Header />
      <main>
        <OrdersView />
      </main>
      <Footer />
    </>
  )
}

export default About;