import React from 'react';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import PurchaseView from '../Components/PurchaseView/PurchaseView';

const Purchase = (props) => {
  return (
    <>
      <Header />
      <main>
        <PurchaseView orderList={props.orderList}/>
      </main>
      <Footer />
    </>
  )
}
export default Purchase;