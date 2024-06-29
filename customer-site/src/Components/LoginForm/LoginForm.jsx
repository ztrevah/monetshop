import React, { useContext, useState } from 'react'
import logo from "../assets/media/shoplogo.png";
import "../LoginForm/LoginForm.css"
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';


export const LoginForm = (props) => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const handleChange = e => {
        setInput(values => ({...values, [e.target.name]: e.target.value}));
        
    };

    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSubmit = async e => {
        e.preventDefault();
        try{
            await login(input);
            navigate("/");
            navigate(0);
            console.log("Login successfully");
        } catch(err) {
            console.log(err);
            setError(err.response.data);
        }
        
    };
    const escLoginForm = () => {
        props.setTrigger(false);
        setError("");
    }
  return (props.trigger) ? (
    <>
        <div className="overlay" onClick={escLoginForm}></div>
        <div className="popupLoginForm">
            <div className="close-btn">
                <span className="gg--close-o" onClick={escLoginForm}></span>
            </div>
            <div className="header-loginform">
                <img className="logo-loginform" src={logo} alt="Shop logo" />
                <br />
                <span>Sign in</span>
            </div>
            <div className="loginform">
                <form method="post">
                    <div className="form-element1 form-element">
                        <label htmlFor="username">Username/ Email address:</label>
                        <br />
                        <input type="email" name="email" id="email" onChange={handleChange}/>
                    </div>
                    <div className="form-element2 form-element">
                        <label htmlFor="password">Password:</label>
                        <br />
                        <input type="password" name="password" id="password" onChange={handleChange} />
                    </div>
                    <div className="form-element3 form-element">
                        <input type="checkbox" name="rememberme" id="rememberme" />
                        <label htmlFor="rememberme">Remember me</label>
                    </div>
                    <div className="form-element4 form-element">
                        <span>{error}</span> <br/>
                        <button type="submit" onClick={handleSubmit}>Sign in</button>
                    </div>
                </form>
            </div>
            <div className="optional-login">
                <div className="op1">
                    <span><Link to="/forgotpassword" onClick={escLoginForm}>Forget your password?</Link></span>
                </div>
                <div className="op2">
                    <span>Haven't got an account? <Link to="/signup" onClick={escLoginForm}>Sign up</Link></span>
                </div>
            </div>
        </div>
    </>
  ) : "";
}
