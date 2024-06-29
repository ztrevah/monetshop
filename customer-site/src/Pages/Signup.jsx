import React, { useContext, useEffect } from 'react';
import Header from '../Components/Header/Header';
import SignupForm from '../Components/SignupForm/SignupForm';
import Footer from '../Components/Footer/Footer';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if(currentUser?.uid) {
      navigate("/error");
    }
  },[navigate,currentUser]);
  return (
    <>
      <Header />
      <main>
        <SignupForm step={props.step}/>
      </main>
      <Footer />
    </>
  )
}

export default Signup;