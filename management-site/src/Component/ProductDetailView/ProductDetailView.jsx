import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./ProductDetailView.css";
import { useNavigate } from 'react-router-dom';
const ProductDetailView = (props) => {
    const [productinfo,setProductInfo] = useState({});
    const [updateProductInfo,setUpdateProductInfo] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const getproductinfo = async () => {
            try {
                const res = await axios.post("http://localhost:9090/backend/management/productinfo",props,{withCredentials: true});
                setProductInfo(res.data);
                console.log(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        getproductinfo();
    },[props]);
    const handleChange = e => {
        setUpdateProductInfo(values => ({...values, [e.target.name]: e.target.value}));
        
    };
    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:9090/backend/management/updateproductinfo",updateProductInfo,{withCredentials: true});
            navigate("/products");
        } catch(err) {
            console.log(err);
        }
    }
  return (
    <div className="productdetail">
        <div className="productdetail-title">Products management</div>
        <div className="productdetail-initial">
            <span style={{fontSize: "24px",fontWeight: "600"}}>{productinfo.productname?.toUpperCase()}</span>
            <span style={{fontSize: "20px",color: "#074173"}}>Product ID: {productinfo.productid}</span>
        </div>
        <div className="productdetail-wrapper">
            <div className="productdetail-info">
                <div className="productdetail-info-name">
                    <label htmlFor="productname">Product name:</label>
                    <input type="text" id="productname" name="productname" defaultValue={productinfo.productname} onChange={handleChange} />
                </div>
                <div className="productdetail-info-unitprice">
                    <label htmlFor="unitprice">Unit price:</label>
                    <input type="number" id="unitprice" name="unitprice" defaultValue={productinfo.unitprice} onChange={handleChange} />
                </div>
                <div className="productdetail-info-quantity">
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" defaultValue={productinfo.quantity} onChange={handleChange} />
                </div>
                <div className="productdetail-info-description">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" rows={2} maxLength={255} defaultValue={productinfo.description} onChange={handleChange} />
                </div>
            </div>
            <div className="productdetail-img">

            </div>
        </div>
        <div className="productdetail-btn">
            <button style={{backgroundColor: "#BBBBBB"}}>Cancel</button>
            <button style={{backgroundColor: "#074173"}}>Update</button>
            <button style={{backgroundColor: "#CD1010"}}>Delete</button>
        </div>
    </div>
  )
}

export default ProductDetailView