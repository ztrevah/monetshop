import React, { useContext } from 'react';
import "./SidebarMenu.css";
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SidebarMenu = () => {
  const navigate = useNavigate();
  const {logout} = useContext(AuthContext);

  return (
    <div className="sidebarmenu">
      <div className="menulist">
        <div className="menulist-dashboard" onClick={() => {navigate("/dashboard");}}>
          <span className="material-symbols--dashboard"></span>
          <span className="menulist-item-text">Dashboard</span>
        </div>
        <div className="menulist-categories" onClick={() => {navigate("/categories");}}>
          <span className="material-symbols--category"></span>
          <span className="menulist-item-text">Categories</span>
        </div>
        <div className="menulist-products" onClick={() => {navigate("/products");}}>
          <span className="ant-design--product-filled"></span>
          <span className="menulist-item-text">Products</span>
        </div>
        <div className="menulist-orders" onClick={() => {navigate("/orders");}}>
          <span className="lets-icons--order-fill"></span>
          <span className="menulist-item-text">Orders</span>
        </div>
        <div className="menulist-accounts" onClick={() => {navigate("/accounts");}}>
          <span className="fluent-mdl2--account-management"></span>
          <span className="menulist-item-text">Accounts</span>
        </div>
      </div>
      <div className="logoutdiv" onClick={logout}>
        <span className="material-symbols--logout"></span>
        <span className="menulist-item-text">Logout</span>
      </div>
    </div>
  )
}

export default SidebarMenu