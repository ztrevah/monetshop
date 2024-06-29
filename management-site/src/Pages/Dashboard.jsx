import React, { useContext, useEffect } from 'react'
import Headerbar from '../Component/Headerbar/Headerbar'
import SidebarMenu from '../Component/SidebarMenu/SidebarMenu'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const Dashboard = () => {
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
        <div className="paddingtop"></div>
      </main>
    </>

  )
}

export default Dashboard