import React, { useContext, useEffect, useState } from 'react';
import "./CartView.css";
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const priceToString = (price) => {
  const price_tmp = price.toString();
  const l = price_tmp.length;
  let tmp = "";
  for(let i=0;i<l;i++) {
    if(i%3 === 0 && i > 0) tmp += ",";
    tmp += price_tmp[l-1-i];
    
  }
  return tmp.split('').reverse().join('');
}

const CartView = () => {
  const {currentUser} = useContext(AuthContext);
  const [cartItems,setCartItems] = useState([]);
  const [summaryItemList,setSummaryItemList] = useState([]);
  const [summaryTotalPrice,setSummaryTotalPrice] = useState(0);
  const navigate = useNavigate();
  const getCartDetails = async () => {
    try {
      const res = await axios.post("http://localhost:9090/backend/cart/details",null,{withCredentials: true});
      const tmp = [];
      for(let i=0;i<summaryItemList.length;i++) {
        for(let j=0;j<res.data.length;j++) {
          if(summaryItemList[i]?.productid === res.data[j]?.productid) {
            tmp.push(res.data[j]);
            break;
          }
        }
      }
      setCartItems(res.data);
      setSummaryItemList(tmp);
      setSummaryTotalPrice(getSummaryTotalPrice(tmp));
    } catch (err) {
      console.log(err);
      navigate("/error");
    }
  }
  useEffect(() => {
    if(currentUser) {
      const getCartDetails = async () => {
        try {
          const res = await axios.post("http://localhost:9090/backend/cart/details",null,{withCredentials: true});
          setCartItems(res.data);
        } catch (err) {
          console.log(err);
          navigate("/error");
        }
      }
      getCartDetails();
    }
    else navigate("/error");
  },[currentUser,navigate]);
  
  const increaseNumberOfProducts = async (item) => {
    try {
      await axios.put("http://localhost:9090/backend/cart/updateitem",{productid: item.productid,newquantity: item.quantity+1},{withCredentials: true});
      getCartDetails();
    } catch(err) {
      console.log(err);
    }
  }
  const decreaseNumberOfProducts = async (item) => {
    if(item.quantity === 1) return;
    try {
      await axios.put("http://localhost:9090/backend/cart/updateitem",{productid: item.productid,newquantity: item.quantity-1},{withCredentials: true});
      getCartDetails();
    } catch(err) {
      console.log(err);
    }
  }
  const deleteCartItem = async (item) => {
    try {
      await axios.delete("http://localhost:9090/backend/cart/deleteitem",{data: {productid: item.productid}},{withCredentials: true});
      getCartDetails();
    } catch(err) {
      console.log(err);
    }
  }
  const checkOutForSummaryOrder = () => {
    if(summaryItemList.length === 0) return;
    navigate("/purchase",{state: {
      orderlist: summaryItemList,
      successful: false
    }});
  }
  const addSummaryItem = (item) => {
    const tmp = summaryItemList;
    if(tmp.length === 0) tmp.push(item);
    else {
      for(let i=0;i<tmp.length;i++) {
        if(tmp[i].productid === item.productid) {
          tmp[i].quantity = item.quantity;
          tmp[i].unitprice = item.unitprice;
        }
        else if(i === tmp.length - 1) tmp.push(item);
      }
    }
    setSummaryItemList(tmp);
    setSummaryTotalPrice(getSummaryTotalPrice(tmp));
  }
  const removeSummaryItem = (item) => {
    const tmp = [];
    for(let i=0;i<summaryItemList.length;i++) {
      if(summaryItemList[i].productid === item.productid) continue;
      tmp.push(summaryItemList[i]);
    }
    setSummaryItemList(tmp);
    setSummaryTotalPrice(getSummaryTotalPrice(tmp));
  }

  const defaultCheckedItem = (item) => {
    for(let i=0;i<summaryItemList.length;i++) {
      if(summaryItemList[i].productid === item.productid) return true;
    }
    return false;
  }

  const getSummaryTotalPrice = (itemlist) => {
    let totalprice = 0;
    for(let i=0;i<itemlist.length;i++) {
      totalprice += (itemlist[i].quantity * itemlist[i].unitprice);
    }
    return totalprice;
  }

  console.log(summaryItemList);

  return (
    <div className="cartview">
      <div className="cartview-title">
        <span>Home / Your cart</span>
      </div>
      <div className="cartview-content">
        <div className="cartitems">
          {cartItems.length === 0 ? (
            <div className="emptycart">
              <div><span className="bytesize--cart"></span></div>
              <div><span>There is no item in your cart.</span></div>
            </div>
          ) : ""} 
          {cartItems?.map((item,index) => {
            return (
            <div className="cartitemdiv-wrapper" key={index}>
              <div className="cartitemdiv">
                <div className="cartitem-checkbox">
                  <input type="checkbox" onChange={(e) => {e.target.checked ? addSummaryItem(item) : removeSummaryItem(item)}} defaultChecked={() => {return defaultCheckedItem(item)}} />
                </div>
                <div className="cartitem-img">
                  <img src={item.imgurl} alt="" />
                </div>
                <div className="cartitem-detail">
                  <div className="cartitem-name">
                    <span>{item.productname}</span>
                  </div>
                  <div className="cartitem-id">
                    <span>{item.productid}</span>
                  </div>
                  <div className="cartitem-quantity">
                    <div><span>Quantity: </span></div> 
                    <div className="quantityarea">
                      <span className="ic--round-minus" onClick={() => {decreaseNumberOfProducts(item);}}></span>
                      <span className="quantityvalue">{item.quantity}</span>
                      <span className="ic--round-plus" onClick={() => {increaseNumberOfProducts(item);}}></span>
                    </div> 
                  </div>
                  <div className="cartitem-price">
                    <span>Total: <span style={{color: "#CD1010"}}>{priceToString(item.quantity * item.unitprice)}₫</span></span>
                  </div>
                </div>
                <div className="cartitem-erasebtn">
                  <span className="ph--x-bold" onClick={() => {deleteCartItem(item);}}></span>
                </div>
              </div>
            </div>
            )
          })}
        </div>
        <div className="cartview-summary">
          <div className="summary-title"><span>Summary</span></div>
          <div className="summary-totalprice">
            <span>Total price:</span>
            <span style={{color: "#CD1010"}}>{priceToString(summaryTotalPrice)}₫</span>
          </div>
          <div className="makepaymentbtn">
            <button onClick={checkOutForSummaryOrder}>MAKE YOUR PAYMENT</button>
          </div>
        </div>  
      </div>
    </div>
  )
}

export default CartView;