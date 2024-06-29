import React, { useContext, useEffect } from 'react'
import Headerbar from '../Component/Headerbar/Headerbar'
import SidebarMenu from '../Component/SidebarMenu/SidebarMenu'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import ProductDetailView from '../Component/ProductDetailView/ProductDetailView.jsx'

const ProductDetail = () => {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if(!currentUser) navigate("/");
  },[currentUser,navigate]);
  const param = useParams();
  return (
    <>
      <Headerbar />
      <SidebarMenu />
      <main>
        <div className="content-wrapper">
          <ProductDetailView productid={param.productid} />
        </div>
      </main>
    </>
  )
}

export default ProductDetail