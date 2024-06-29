import React, { useContext, useState } from 'react';
import "./LoginForm.css";
import { AuthContext } from '../../Context/AuthContext.jsx';

const LoginForm = () => {
    const [input,setInput] = useState({
        email: "",
        password: ""
    });
    const [error,setError] = useState("");
    const {login} = useContext(AuthContext);
    const handleChange = e => {
        setInput(values => ({...values, [e.target.name]: e.target.value}));
        
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(input);
        } catch(err) {
            setError(err.response.data);
        }
    }
  return (
    <div className="loginpage-container">
        <div className="loginpage-header">
            <div className="loginpage-header-logo-wrapper">
                <img src="http://localhost:5000/images/shoplogo.png" alt="" />
            </div>
        </div>
        <div className="loginform-wrapper">
            <div className="loginform">
                <div className="loginform-title">
                    <span style={{fontSize: "32px"}}>Sign in</span>
                </div>
                <div className="loginform-input">
                    <div className="loginform-email">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" onChange={handleChange} />
                    </div>
                    <div className="loginform-password">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" onChange={handleChange} />
                    </div>
                </div>
                <div className="loginform-error">
                    {error}
                </div>
                <div className="loginform-submit" onClick={handleSubmit}>
                    <button>Login</button>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default LoginForm