import React, {useContext, useEffect, useState} from "react";
import "./ProductDetail.css";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { LoginForm } from "../LoginForm/LoginForm";
import { AuthContext } from "../../Context/AuthContext";

const AddToCartPopup = (props) => {
  const navigate = useNavigate();
  return (props?.trigger === true) ?  
    <>
        <div className="overlay" onClick={() => {props.setTrigger(false);}}></div>
        <div className="addtocart-popup"> 
            <div className="header">
              <div className="checkicon-wrapper">
                <span className="line-md--circle-twotone-to-confirm-circle-twotone-transition"></span>
                <span style={{paddingLeft: "5px",fontSize: "18px"}}>Added to cart</span>
              </div>
              <div className="closeicon-wrapper" onClick={() => {props.setTrigger(false);}}>
                <span className="mdi--close"></span>
              </div>  
            </div>

            <div className="additem-details">
              <div className="additem-img">
                <img src={props.addItem.img} alt=""/>
              </div>
              <div className="additem-other">
                <div className="additem-name">
                  <span>{props.addItem.name}</span>
                </div>
                <div className="additem-quantity">
                  <span>Quantity: {props.addItem.quantity}</span>
                </div>
                <div className="additem-price">
                  <span>{props.addItem.price / 1000}.000₫</span>
                </div>
              </div>
            </div>

            <div className="viewcartbtn-wrapper">
                <button className="viewcartbtn" onClick={() => {navigate("/cart");navigate(0)}}>View cart</button>
              </div>
        </div>
    </>
    : "";
}

const ProductDetail = () => {
  const param = useParams(); 
  const [productDetails, setProductDetails] = useState({});
  const [numberPurchaseItems,setNumberPurchaseItems] = useState(0);
  const [displayedImageIndex,setdisplayedImageIndex] = useState(0);
  const [signinPopUp,setSigninPopup] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const [error,setError] = useState("");
  const [added,setAdded] = useState(false);
  const [addItem,setAddItem] = useState({});
  const openSigninPopup = () => {
      setSigninPopup(true);
  }
  const navigate = useNavigate();
  useEffect(() => {
    const getProductDetail = async () => {
      try {
        const res = await axios.post("http://localhost:9090/backend/search/getProductDetails",param,{withCredentials: true});
        setProductDetails(res.data);
        if(res.data.quantity === 0) setError("This product is currently out of stock.");
        else setNumberPurchaseItems(1);
      } catch (err) {
        console.log(err);
        navigate("/error");
      }
    }
    getProductDetail();
  },[param, navigate]);

  const purchaseQuantityIncrement = () => {
    if(productDetails.quantity > 0) {
      if(numberPurchaseItems + 1 > productDetails.quantity) {
        setError("Not enough items left in store.");
      } 
      else setError("");
      setNumberPurchaseItems(numberPurchaseItems + 1);
    }
    
  }
  const purchaseQuantityDecrement = () => {
    if(productDetails.quantity > 0) {
      if(numberPurchaseItems - 1 <= productDetails.quantity) setError(""); 

      if(numberPurchaseItems > 1) setNumberPurchaseItems(numberPurchaseItems - 1);
      else setNumberPurchaseItems(1);
    }
  }
  const enterPurchaseQuantity = (e) => {
    if(productDetails.quantity > 0) {
      const num = parseInt(e.target.value);
      if(num) {
        if(num < 1) {
          setError("");
          setNumberPurchaseItems(1);
        } 
        else if(num <= productDetails.quantity) {
          setError("");
          setNumberPurchaseItems(num);
        } 
        else {
          setError("Not enough items left in store.");
          setNumberPurchaseItems(num);
        }
      }
      else setNumberPurchaseItems(1);
    }
    
  }
  const addToCart = async () => {
    if(currentUser) {
      if(!error) {
        try {
          await axios.post("http://localhost:9090/backend/cart/add",{productid: productDetails.productid, quantity: numberPurchaseItems});
          setAdded(true);
          setAddItem({
            img: productDetails.imgurl?.at(0), 
            name: productDetails.productname, 
            quantity: numberPurchaseItems, 
            price: productDetails.unitprice * numberPurchaseItems
          });
        } catch(err) {
          navigate("/error");
        }
      } 
    } 
    else openSigninPopup();
  }
  const buyNow = () => {
    if(currentUser) {
      if(!error) {
        const orderlist = [{productid: productDetails.productid, quantity: numberPurchaseItems, unitprice: productDetails.unitprice, productname: productDetails.productname,imgurl: productDetails.imgurl[0]}];
        navigate("/purchase",{state: {
          orderlist: orderlist,
          successful: false
        }});
      }
      
    } 
    else openSigninPopup();
  }
  return (
    <div className="productdetails">
      <div className="title">
        <span>Home / Products / {productDetails.productname}</span>
      </div>
      <div className="productdetail-wrapper">
        <div className="productimage-wrapper">
          <div className="imagelist">
            <div><span className="mingcute--up-fill"></span></div>
            {productDetails.imgurl?.map((url,index) => {
              return <div key={index} onClick={() => {setdisplayedImageIndex(index)}}><img src={url} alt={productDetails.productid} /></div>
            })}
            <div><span className="mingcute--down-fill"></span></div>
          </div>
          <div className="displayedimage">
            <img src={productDetails.imgurl?.at(displayedImageIndex)} alt={productDetails.productid} />
          </div>
        </div>
        <div className="productinfo-wrapper">
          <div className="name">
            <span>{productDetails.productname?.toUpperCase()}</span>
          </div>
          <div className="id">
            <span>Product ID: {productDetails.productid}</span>
          </div>
          <div className="price">
            <span>{productDetails.unitprice/1000},000₫</span>
          </div>
          <div className="quantity">
            <div className="quantity-input">
              <div><label htmlFor="quantity">Quantity: </label></div>
              <div className="inputarea">
                <span className="ic--round-minus" onClick={purchaseQuantityDecrement}></span>
                <input type="number" id="quantity" min={0} max={productDetails.quantity} value={numberPurchaseItems} onChange={enterPurchaseQuantity}/>
                <span className="ic--round-plus" onClick={purchaseQuantityIncrement}></span>
              </div>
            </div>
          </div>
          <div className="errormsg">
              <span>{error}</span>
            </div>
          <div className="purchaseoptions">
            <div className="buybutton-wrapper" onClick={buyNow}>
              <button>Buy now!</button>
            </div>
            <div className="cartbutton-wrapper" onClick={addToCart}>
              <button><span className="mi--shopping-cart-add"></span><br/>Add to cart</button>
            </div>
          </div>
          <div className="description">
            <div className="description-title">
              <span>Product details</span>
              <span className="mingcute--down-fill"></span>
            </div>
            <div className="description-content">
              {productDetails.description || ""}
            </div>
          </div>
        </div>
      </div>
      <LoginForm trigger={signinPopUp} setTrigger={setSigninPopup} />
      <AddToCartPopup trigger={added} setTrigger={setAdded} addItem={addItem}/>
    </div>
    
  )
}

export default ProductDetail;