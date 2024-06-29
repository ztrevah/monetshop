import React, { useContext, useEffect } from 'react'
import Headerbar from '../Component/Headerbar/Headerbar'
import SidebarMenu from '../Component/SidebarMenu/SidebarMenu'
import ProductsView from '../Component/ProductsView/ProductsView'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'

const Products = () => {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if(!currentUser) navigate("/");
  },[currentUser,navigate]);
  return (
    <>
      <Headerbar />
      <SidebarMenu />
      <main>
        <div className="content-wrapper">
          <ProductsView />
        </div>
      </main>
    </>
  )
}

export default Products