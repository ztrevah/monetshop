import React, { useEffect, useState } from 'react'
import "./OrdersView.css"
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

const getStateDescription = (state_num) => {
    if(state_num === 1) return "Confirming order";
    else if(state_num === 2) return "Preparing order's items";
    else if(state_num === 3) return "Delivering";
    else if(state_num === 4) return "Delivered";
    else if(state_num === 5) return "Completed";
    else if(state_num === 6) return "Cancelled";
}

const OrdersView = () => {
    const [input,setInput] = useState({});
    const [orderlist,setOrderList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchorders = async () => {
            try {
                const res = await axios.post("http://localhost:9090/backend/management/orderlist",null,{withCredentials: true});
                setOrderList(res.data);
                console.log(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchorders();
    },[]);
    const handleChange = e => {
        setInput(values => ({...values, [e.target.name]: e.target.value}));
        
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:9090/backend/management/orderlist",input,{withCredentials: true});
            setOrderList(res.data);
            console.log(res.data);
        } catch(err) {
            console.log(err);
        }
    }
    const clearInput = () => {

    }
  return (
    <div className="ordersview">
        <div className="ordersview-title">Orders management</div>
        <form className="ordersview-form">
            <div className="ordersview-forminput">
                <div>
                    <div className="ordersview-forminput-orderid">
                        <input type="text" name="orderid" placeholder="Order ID" onChange={handleChange} />
                    </div>
                    <div className="ordersview-forminput-orderdate">
                        <input type="date" name="orderdate" placeholder="Order date" onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <div className="ordersview-forminput-customeremail">
                        <input type="text" name="customer" placeholder="Customer" onChange={handleChange} />
                    </div>
                    <div className="ordersview-forminput-currentstate">
                        <select name="currentstate" id="currentstate" onChange={handleChange}>
                            <option value="">Status</option>
                            <option value="1">Confirming order</option>
                            <option value="2">Preparing order's items</option>
                            <option value="3">Delivering</option>
                            <option value="4">Delivered</option>
                            <option value="5">Completed</option>
                            <option value="6">Cancelled</option>
                        </select>
                    </div>
                </div>
                
            </div>
            <div className="ordersview-formbtn">
                <button className="ordersview-formsearchbtn" onClick={handleSubmit}>Search</button>
                <button className="ordersview-formcancelbtn" onClick={clearInput}>Clear</button>
            </div>
        </form>
        <div className="orderlist-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Order date</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total price</th>
                    </tr>
                </thead>
                <tbody>
                    {orderlist?.map((order,index) => {
                        return (
                            <tr key={index} onClick={() => {navigate(`/orders/${order.orderid}`)}}>
                                <td>{order.orderid}</td>
                                <td>{order.orderdate}</td>
                                <td>{order.customer}</td>
                                <td>{getStateDescription(order.currentstate)}</td>
                                <td>{priceToString(order.totalprice)}₫</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default OrdersView