import React from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import CartView from '../Components/CartView/CartView';

const Cart = () => {
  return (
    <>
      <Header />
      <main>
        <CartView />
      </main>
      <Footer />
    </>
  )
}

export default Cart;