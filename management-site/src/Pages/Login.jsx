import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import LoginForm from '../Component/LoginForm/LoginForm';

const Login = () => {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if(currentUser) navigate("/dashboard");
  },[currentUser,navigate]);
  return (
    <LoginForm />
  )
}

export default Login