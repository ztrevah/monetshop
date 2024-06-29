import React, { useContext, useEffect, useState } from 'react';
import "./OrdersView.css";
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getStateDescription = (state_num) => {
    if(state_num === 1) return "Confirming order";
    else if(state_num === 2) return "Preparing order's items";
    else if(state_num === 3) return "Delivering";
    else if(state_num === 4) return "Delivered";
    else if(state_num === 5) return "Completed";
    else if(state_num === 6) return "Cancelled";
}
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

const OrderStateDiv = (props) => {
    return (
    <div className="state-wrapper">
        {props.currentstate === props.ownstate ? 
            (<div className="num-checked"><span>{props.ownstate}</span></div>)
            :
            (<div className="num-unchecked"><span>{props.ownstate}</span></div>)
        }
        <div className="statedescription">
            <span>{getStateDescription(props.ownstate)}</span>
        </div>
    </div>);
}

const OrderOtherDetail = (props) => {
    const [orderItems,setOrderItems] = useState([]);
    const [expand,setExpand] = useState(false);
    useEffect(() => {
        if(props.orderid) {
            const getitems = async () => {
                try {
                    const res = await axios.post("http://localhost:9090/backend/order/getorderitems",{orderid: props.orderid},{withCredentials: true});
                    setOrderItems(res.data);
                } catch(err) {
                    console.log(err);
                }
            }
            getitems();
        }
    },[props.orderid]);
    return (
    <>
    {expand === true ? (
        <div className="orderdetail-more">
            <div className="orderdetail-statesummary">
                <div>
                    <span className="ic--round-less-than"></span>
                </div>
                <div className="statelist">
                    <OrderStateDiv currentstate={props.currentstate} ownstate={1} />
                    <OrderStateDiv currentstate={props.currentstate} ownstate={2} />
                    <OrderStateDiv currentstate={props.currentstate} ownstate={3} />
                    <OrderStateDiv currentstate={props.currentstate} ownstate={4} />
                    <OrderStateDiv currentstate={props.currentstate} ownstate={5} />
                </div>
                <div>
                    <span className="ic--round-greater-than"></span>
                </div>
            </div>
            <div className="orderdetail-addressphonepayment-items">
                <div className="orderdetail-addressphonepayment">
                    <div className="orderdetail-address">
                        <span style={{fontSize: "18px", fontWeight: "600"}}>Address: </span><br/>
                        <span style={{fontSize: "18px", fontWeight: "400"}}>{props.address}</span>
                    </div>
                    <div className="orderdetail-buyerphone">
                        <span style={{fontSize: "18px", fontWeight: "600"}}>Contact number: </span><br/>
                        <span style={{fontSize: "18px", fontWeight: "400"}}>{props.buyerphone}</span>
                    </div>
                    <div className="orderdetail-paymentmethod">
                        <span style={{fontSize: "18px", fontWeight: "600"}}>Payment method: </span><br/>
                        <span style={{fontSize: "18px", fontWeight: "400"}}>{props.paymentmethod}</span>
                    </div>
                </div>
                <div className="orderdetail-items">
                    <div className="orderdetail-items-title">
                        <span>Order summary</span>
                    </div>
                    <div className="orderdetail-itemslist">
                        {orderItems.map((item,i) => {
                            console.log(item);
                            return (
                            <div className="orderdetail-item" key={i}>
                                <div className="orderdetail-item-nameid">
                                    <div className="orderdetail-item-name">
                                        <span>{item.productname}</span>
                                    </div>
                                    <div className="orderdetail-item-id">
                                        <span>{item.productid}</span>
                                    </div>
                                </div>
                                <div className="orderdetail-item-quantity">
                                    <span>x{item.quantity}</span>
                                </div>
                                <div className="orderdetail-item-price">
                                    <span>{priceToString(item.quantity * item.unitprice)}₫</span>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                    <div className="orderdetail-items-total">
                        <span>Total price:</span>
                        <span style={{color: "#CD1010"}}>{priceToString(props.totalprice)}₫</span>
                    </div>
                </div>
            </div>
        </div>
    ) : ""}
    
        <div className="orderdetail-expand-collapse" onClick={() => {setExpand(!expand)}}>
            {expand === true ? 
                (<>
                    <span>Collapse&nbsp;&nbsp;</span>
                    <span className="mingcute--up-fill"></span>
                </>) 
                : 
                (<>
                    <span>Details&nbsp;&nbsp;</span>
                    <span className="mingcute--down-fill"></span>
                </>)
            }
        </div>
    </>
    );
}

const OrdersView = () => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [ordersList,setOrdersList] = useState([]);
    const [searchInputs,setSearchInputs] = useState({});
    const [emptyOrdersListDescription,setEmptyOrdersListDescription] = useState("You haven't made any orders yet.");
    const [orderSortOption,setOrderSortOption] = useState("Date: New - Old");
    useEffect(()=> {
        if(currentUser) {
            const getOrderLists = async () => {
                try {
                    const res = await axios.post("http://localhost:9090/backend/order/getcustomerorder",{customerid: currentUser.uid},{withCredentials: true});
                    setOrdersList(res.data);
                    console.log(res.data);
                    setOrderSortOption("Date: New - Old");
                    if(res.data.length === 0) setEmptyOrdersListDescription("You haven't made any orders yet.");
                } catch(err) {
                    console.log(err);
                }
            }
            getOrderLists();
        }
        else {
            navigate("/error");
        }
    },[currentUser,navigate]);

    const sortOrders = (e) => {
        setOrderSortOption(e.target.value);
        if(e.target.value === "Date: New - Old") {
            const tmp = ordersList.toSorted((a,b) => new Date(b.createdtime) - new Date(a.createdtime));
            setOrdersList(tmp);
        }
        else if(e.target.value === "Date: Old - New") {
            const tmp = ordersList.toSorted((a,b) => new Date(a.createdtime) - new Date(b.createdtime));
            setOrdersList(tmp);
        }
        else if(e.target.value === "Total price: Low - High") {
            const tmp = ordersList.toSorted((a,b) => a.totalprice - b.totalprice);
            setOrdersList(tmp);
        }
        else if(e.target.value === "Total price: High - Low") {
            const tmp = ordersList.toSorted((a,b) => b.totalprice - a.totalprice);
            setOrdersList(tmp);
        }
    }

    const handleChange = e => {
        setSearchInputs(values => ({...values, [e.target.name]: e.target.value}));
    };
    const handleSubmit = () => {
        const getOrderByID = async () => {
            try {
                const res = await axios.post("http://localhost:9090/backend/order/searchorder",searchInputs,{withCredentials: true});
                setOrdersList(res.data);
                setOrderSortOption("Date: New - Old");
                if(res.data.length === 0) {
                    if(searchInputs.orderid) setEmptyOrdersListDescription("No order matched found.");
                    else setEmptyOrdersListDescription("You haven't made any orders yet.");
                }
            } catch(err) {
                console.log(err);
            }
        }
        getOrderByID();
    }
    return (
        <div className="ordersview">
            <div className="ordersview-title">
                <span>Home / Your orders</span>
            </div>
            <div className="ordersview-headerbar">
                <div className="orders-searchbar">
                    <label htmlFor="orderid">Tracking order: </label>
                    <input type="text" id="orderid" name="orderid" placeholder="ID" onChange={handleChange}/>
                    <button onClick={handleSubmit}>Search</button>
                </div>
                <div className="orders-sortoptions">
                    <label htmlFor="orders-sortoptions">Sort by: </label> 
                    <select id="orders-sortoptions" value={orderSortOption} onChange={sortOrders}>
                        <option value="Date: New - Old">Date: Newest - Oldest</option>
                        <option value="Date: Old - New">Date: Oldest - Newest</option>
                        <option value="Total price: Low - High">Total price: Low - High</option>
                        <option value="Total price: High - Low">Total price: High - Low</option>
                    </select>
                </div>
            </div>
            <div className="ordersview-orderslist">
                {ordersList?.length === 0 ? (
                    <div className="emptyorderslist">
                        <div><span className="fa-regular--sad-tear"></span></div>
                        <br />
                        <div><span>{emptyOrdersListDescription}</span></div>
                        
                    </div>
                ) : ""} 
                {ordersList?.map((order,index) => {
                    return (
                    <div className="orderdetail-wrapper" key={index}>
                        <div className="orderdetail-iddate">
                            <span>Order ID: {order.orderid} | Order date: {order.createdtime}</span>
                        </div>
                        <div className="orderdetail-imagenamepricestate">
                            <div className="orderdetail-image">
                                <img src={order.orderimage} alt="" />
                            </div>
                            <div className="orderdetail-namepricestate">
                                <div className="orderdetail-name">
                                    <span>{order.ordername}</span>
                                </div>
                                <div className="orderdetail-price">
                                    <span>Total price: <span style={{color: "#CD1010"}}>{priceToString(order.totalprice)}₫</span></span>
                                </div>
                                <div className="orderdetail-state">
                                    <span>State: <span style={{color: "#08A618"}}>{getStateDescription(order.currentstate)}</span></span>
                                </div>
                            </div>
                        </div>
                        
                        <OrderOtherDetail orderid={order.orderid} address={order.address} buyerphone={order.buyerphone} paymentmethod={order.paymentmethod} currentstate={order.currentstate} totalprice={order.totalprice} />
                        
                    </div>);
                })}
            </div>
            
        </div>
    )
}

export default OrdersView;