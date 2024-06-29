import React, { useEffect, useState } from 'react';
import "./ProductsView.css";
import axios from "axios";
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

const ProductsView = () => { 
    const [productlist, setProductList] = useState([]);
    const [input,setInput] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const fetchproducts = async () => {
            try {
                const res = await axios.post("http://localhost:9090/backend/management/productlist",null,{withCredentials: true});
                setProductList(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        fetchproducts();
    },[]);
    const handleChange = e => {
        setInput(values => ({...values, [e.target.name]: e.target.value}));
        
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:9090/backend/management/productlist",input,{withCredentials: true});
            setProductList(res.data);
            console.log(res.data);
        } catch(err) {
            console.log(err);
        }
    }
    const clearInput = () => {

    }
    return (
    <div className="productsview">
        <div className="productsview-header">
            <span className="productsview-title">Products management</span>
            <button className="productsview-addbbtn">Add new product</button>
        </div>
        <form className="productsview-form">
            <div className="productsview-forminput">
                <div className="productsview-forminput-productname">
                    <input type="text" name="productname" placeholder="Product name" onChange={handleChange} />
                </div>
                <div className="productsview-forminput-productid">
                    <input type="text" name="productid" placeholder="Product id" onChange={handleChange} />
                </div>
                <div className="productsview-forminput-category">
                    <input type="text" name="category" placeholder="Category" onChange={handleChange} />
                </div>
            </div>
            <div className="productsview-formbtn">
                <button className="productsview-formsearchbtn" onClick={handleSubmit}>Search</button>
                <button className="productsview-formcancelbtn" onClick={clearInput}>Cancel</button>
            </div>

        </form>
        <div className="productlist-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product name</th>
                        <th>Category</th>
                        <th>Unit price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {productlist?.map((product,index) => {
                        return (
                            <tr key={index} onClick={() => {navigate(`/products/${product.productid}`)}}>
                                <td>{product.productid}</td>
                                <td>{product.productname}</td>
                                <td>{product.category}</td>
                                <td>{priceToString(product.unitprice)}₫</td>
                                <td>{product.quantity}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default ProductsView