import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./ProductsView.css";


const ProductsView = (props) => {
    const [productList,setProductList] = useState([]);
    const [filterInput,setFilterInput] = useState({
        category: props.category,
        minprice: props.minprice,
        maxprice: props.maxprice
    });
    const navigate = useNavigate();
    const [initProductList,setInitProductList] = useState([]); 

    useEffect(() => {
        const fetchProductLists = async () => {
            try{
                const res = await axios.post("http://localhost:9090/backend/search/getproductslist",props,{withCredentials: true});
                setProductList(res.data);
                setInitProductList(res.data);
            } catch(err) {
                console.log(err);
            }
        }
        return () => fetchProductLists();
    },[props]);
    const handleChange = (e) => {
        setFilterInput(values => ({...values, [e.target.name]: e.target.value}));
    };
    console.log(initProductList);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let url = "/products";
        if(filterInput.category === "All") filterInput.category = null;
        if(filterInput.category === null && filterInput.minprice === null && filterInput.maxprice === null) {
        }
        else {
            url += "?";
            if(filterInput.category != null) url += `category=${filterInput.category}&`;
            if(filterInput.minprice != null) url += `minprice=${filterInput.minprice}&`;
            if(filterInput.maxprice != null) url += `maxprice=${filterInput.maxprice}`;
        }
        navigate(url);
        navigate(0);
    }

    const sortProducts = (e) => {
        if(e.target.value === "Price: Low - High") {
            const templist = productList.toSorted((a,b) => a.unitprice - b.unitprice);
            setProductList(templist);
        }
        else if(e.target.value === "Price: High - Low") {
            const templist = productList.toSorted((a,b) => b.unitprice - a.unitprice);
            setProductList(templist);
        }
        else {
            setProductList(initProductList);
        }
    }
    return (
        <div className="productsview">
            <div className="title">
                <h2>Home / Products</h2>
            </div>
            <div className="products-content">
                <div className="products-filter">
                    <form className="filter">
                        <div className="category-filter">
                            <p>Category</p>
                            <div className="cate-wrapper">
                                <input type="radio" id="cate0" name="category" value="All" defaultChecked={props.category === "All" || props.category === null} onChange={handleChange}></input>
                                <label htmlFor="cate0">All categories</label>
                            </div>
                            <div className="cate-wrapper">
                                <input type="radio" id="cate1" name="category" value="Christmas" defaultChecked={props.category === "Christmas"} onChange={handleChange}></input>
                                <label htmlFor="cate1">Christmas</label>
                            </div>
                            <div className="cate-wrapper">
                                <input type="radio" id="cate2" name="category" value="Valentine" defaultChecked={props.category === "Valentine"} onChange={handleChange}></input>
                                <label htmlFor="cate2">Valentine</label>
                            </div>
                            <div className="cate-wrapper">
                                <input type="radio" id="cate3" name="category" value="Women's day" defaultChecked={props.category === "Women's day"} onChange={handleChange}></input>
                                <label htmlFor="cate3">Women's day</label>
                            </div>
                        </div>
                        <div className="price-filter">
                            <p>Price range:</p>
                            <div className="pricerange-wrapper">
                                <div className="minprice-wrapper">
                                    <input type="number" id="minprice" name="minprice" placeholder="min" defaultValue={(props.minprice || null)} onChange={handleChange}></input>
                                </div>
                                <div className="minus-icon-wrapper">
                                    <span className="typcn--minus"></span>
                                </div>
                                <div className="maxprice-wrapper">
                                    <input type="number" id="maxprice" name="maxprice" placeholder="max" defaultValue={(props.maxprice || null)} onChange={handleChange}></input>
                                </div>
                            </div>
                        </div>
                        <div className="filter-btn">
                            <button type="submit" onClick={handleSubmit}>Apply</button>
                        </div>
                    </form>
                    
                </div>
                <div className="products-list">
                    <div className="products-list-header">
                        <div className="number-results">
                            <span>{productList.length} results</span>
                        </div>
                        <div className="sort-option-wrapper">
                            <label htmlFor="sort-option">Sort by: </label> 
                            <select id="sort-option" className="sort-option" name="sortOption" onChange={sortProducts}>
                                <option value="Default">Default</option>
                                <option value="Price: Low - High">Price: Low - High</option>
                                <option value="Price: High - Low">Price: High - Low</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="products-list-wrapper">
                        {productList.map((p,i) => {
                            return (
                            <div className="product" key={p.productid} onClick={() => {navigate(`/products/${p.productid}`);navigate(0)}}>
                                <div className="thumbnail">
                                    <img src={p.imgurl} alt={p.imgurl}></img>
                                </div>
                                <div className="productname">
                                    <span>{p.productname}</span>
                                </div>
                                <div className="unitprice">
                                    <span>{p.unitprice/1000},000đ</span>
                                </div>
                            </div>
                            );
                        }) }
                        { (productList.length % 3 === 2) ? <div className="product"></div> : ""  }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductsView