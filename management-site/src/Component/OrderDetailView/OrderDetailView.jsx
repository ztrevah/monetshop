import React, { useEffect, useState } from 'react'
import "./OrderDetailView.css"
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

const getStateDescription = (state_num) => {
    if(state_num === 1) return "Confirming order";
    else if(state_num === 2) return "Preparing order's items";
    else if(state_num === 3) return "Delivering";
    else if(state_num === 4) return "Delivered";
    else if(state_num === 5) return "Completed";
    else if(state_num === 6) return "Cancelled";
}

const OrderInfoDiv = (props) => {
    const [orderinfo,setOrderInfo] = useState({});
    useEffect(() => {
        const getorderinfo = async () => {
            try {
                const res = await axios.post("http://localhost:9090/backend/management/orderinfo",props,{withCredentials: true});
                setOrderInfo(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        getorderinfo();
    },[props]); 
    return (
    <div className="orderdetail-orderinfo">
        <div className="orderinfo-order">
            <div className="orderinfo-orderid">Order ID: {orderinfo.orderid}</div>
            <div className="orderinfo-orderdate">
                <span className="orderinfo-order-span1">Order date: </span>
                <span className="orderinfo-order-span2">{orderinfo.orderdate}</span>
            </div>
            <div className="orderinfo-totalprice">
                <span className="orderinfo-order-span1">Total price: </span>
                <span className="orderinfo-order-span2">{priceToString(parseInt(orderinfo?.totalprice))}đ</span>
            </div>
            <div className="orderinfo-status">
                <span className="orderinfo-order-span1">Status: </span>
                <span className="orderinfo-order-span2">{getStateDescription(orderinfo.currentstate)}</span>
            </div>
        </div>
        <div className="orderinfo-customer">
            <div className="orderinfo-customer-title">Customer info:</div>
            <div className="orderinfo-name">
                <span className="orderinfo-customer-span1">Name: </span>
                <span className="orderinfo-customer-span2">{orderinfo.buyername}</span>
            </div>
            <div className="orderinfo-email">
                <span className="orderinfo-customer-span1">Email: </span>
                <span className="orderinfo-customer-span2">{orderinfo.email}</span>
            </div>
            <div className="orderinfo-phone">
                <span className="orderinfo-customer-span1">Phone: </span>
                <span className="orderinfo-customer-span2">{orderinfo.buyerphone}</span>
            </div>
            <div className="orderinfo-address">
                <span className="orderinfo-customer-span1">Address: </span>
                <span className="orderinfo-customer-span2">{orderinfo.address}</span>
            </div>
        </div>
    </div>
    )
}

const OrderItemsDiv = (props) => {
    const [orderitems,setOrderItems] = useState([]);
    useEffect(() => {
        const getorderitems = async () => {
            try {
                const res = await axios.post("http://localhost:9090/backend/management/orderitems",props,{withCredentials: true});
                setOrderItems(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        getorderitems();
    },[props]);

    return (
    <div className="orderitems-wrapper">
        <div className="orderitems-title">Order items:</div>
        <div className="orderitems-content">
            {orderitems?.map((item,index) => {
                return (
                <div className="orderitem" key={index}>
                    <div className="orderitem-img">
                        <img src={item.imgurl} alt="" />
                    </div>
                    <div className="orderitem-nameid">
                        <div className="orderitem-name">{item.productname}</div>
                        <div className="orderitem-id">{item.productid}</div>
                    </div>
                    <div className="orderitem-quantity">x{item.quantity}</div>
                    <div className="orderitem-price">{priceToString(item.quantity * item.unitprice)}đ</div>
                </div>);
            })}
        </div>
    </div>
    )
}

const OrderHistoryDiv = (props) => {
    const [orderHistory,setOrderHistory] = useState([]);
    useEffect(() => {
        const getOrderHistory = async () => {
            try {
                const res = await axios.post("http://localhost:9090/backend/management/orderhistory",props,{withCredentials: true});
                setOrderHistory(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        getOrderHistory();
    },[props]);
    return (
        <div className="orderhistory-wrapper">
            <div className="orderhistory-title">Status history:</div>
            <div className="orderhistory-list">
                {orderHistory?.map((record,index) => {
                    return (
                        <div className="orderhistory-record" key={index}>
                            <div className="orderhistory-record-datetime">{record.startedtime}</div>
                            <div className="orderhistory-record-state">{getStateDescription(record.state)}</div>
                        </div>  
                    )
                })}
            </div>
        </div>
    )
}

const OrderDetailView = () => {
    const param = useParams();
  return (
    <div className="orderdetail">
        <div className="orderdetail-title">Orders management</div>
        <OrderInfoDiv orderid={param.orderid} />
        <div className="orderotherinfo">
            <OrderItemsDiv orderid={param.orderid}  />
            <OrderHistoryDiv orderid={param.orderid}  />
        </div>
        
        <div className="orderdetail-btn">
            <button style={{background: "#CD1010"}}>Update</button>
            <button style={{background: "#074173"}}>Cancel</button>
        </div>
    </div>
  )
}

export default OrderDetailView