import React, { useEffect, useState } from 'react';
import "./SignupForm.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

const Step1 = () => {
    const accTypes = ["Customer","Employee","Manager"];
    const [inputs,setInputs] = useState({email: "",accountType: "Customer"});
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const handleChange = e => {
        setInputs(values => ({...values, [e.target.name]: e.target.value}));
        if(e.target.name === "email") {
            if(e.target.value.length === 0) setError("Required");
            else setError("");
        }
    };
    const handleSubmit = async e => {
        e.preventDefault();
        if(inputs.email.length === 0) setError("Required");
        else {
            try{
                const res = await axios.post("http://localhost:9090/backend/auth/signups1",inputs,{withCredentials: true});
                console.log(res);
                const url = "/signup/step2?email=" + inputs.email;
                navigate(url);
            } catch(err) {
                console.log(err);
                setError(err.response.data);
            }
        }
    };
    
    return (
        <form className="form-s1">
            <div className="email-enter-wrapper">
                <label htmlFor="email-enter">Enter your email address:</label> <br/>
                <div>
                    <input type="email" name="email" id="email-enter" placeholder="abc@xyz.mnp" required={true} onChange={handleChange} />
                    {(error.length > 0) ? 
                    <div className="errormsg" style={{marginLeft: "0"}}>
                        <span className="ep--warning-filled"></span>
                        <span style={{color: "red",fontSize: "16px"} }>{error}</span>
                    </div> : ""}
                    
                </div>
            </div>
            <div className="account-type-wrapper">
                <label htmlFor="account-type">Account for:</label> 
                <select id="account-type" className="account-type" name="accountType" onChange={handleChange}>
                    {accTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
            <div className="continue-btn">
                <button className="submit-email-loginform" type="submit" onClick={handleSubmit}>Continue</button>
            </div>
        </form>
    );
}
const Step2 = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const param = new URLSearchParams(location.search);
    const email = param.get("email");
    const [input,setInput] = useState({});
    input["email"] = email;
    useEffect(() => {
        if(email === null) {
            navigate("/error");
        }
        else {
            const checkEmail = async () => {
                try{
                    const res = await axios.post("http://localhost:9090/backend/auth/checkmailsignup",{email: email},{withCredentials: true});
                    input["accountType"] = res.data.accountType;
                } catch(err) {
                    console.log(err);
                    navigate("/error");
                }
            }
            checkEmail();
        }
    },[email,navigate,input]);
    
    const [requestError,setRequestError] = useState("");
    const [inputError,setInputError] = useState({
        email: "",
        password: "",
        firstname: "",
        phone: "",
        gender: "",
        code: ""
    });

    const handleChange = e => {
        setInput(values => ({...values, [e.target.name]: e.target.value}));
        if(e.target.name === "email") {
            if(e.target.value != null && e.target.value.length < 1) setInputError(values => ({...values, email: "Required"}));
            else setInputError(values => ({...values, email: ""}));
        }
        if(e.target.name === "password") {
            if(e.target.value != null && e.target.value.length < 1) setInputError(values => ({...values, password: "Required"}));
            else setInputError(values => ({...values, password: ""}));
        }
        if(e.target.name === "firstname") {
            if(e.target.value != null && e.target.value.length < 1) setInputError(values => ({...values, firstname: "Required"}));
            else setInputError(values => ({...values, firstname: ""}));
        }
        if(e.target.name === "phone") {
            if(e.target.value != null && e.target.value.length === 0) setInputError(values => ({...values, phone: "Required"}));
            else if(e.target.value != null && ( !(/^\d+$/.test(e.target.value)) || (e.target.value.length !== 10))) setInputError(values => ({...values, phone: "Invalid phone number"}));
            else setInputError(values => ({...values, phone: ""}));
        }
        if(e.target.name === "gender") {
            if(e.target.value && (e.target.value !== "Male" && e.target.value !== "Female")) setInputError(values => ({...values, gender: "Invalid gender"}));
            else setInputError(values => ({...values, gender: ""}));
        }
        if(e.target.name === "code") {
            if(e.target.value != null && e.target.value.length < 1) setInputError(values => ({...values, code: "Required"}));
            else setInputError(values => ({...values, code: ""}));
        }
        
    };
    console.log(inputError);
    const handleSubmit = async e => {
        e.preventDefault();
        if(!(input.email) || !(input.password) || !(input.firstname) || !(input.phone) || !(input.code)) {
            if(!(input.email)) setInputError(values => ({...values, email: "Required"}));
            if(!(input.password)) setInputError(values => ({...values, password: "Required"}));
            if(!(input.firstname)) setInputError(values => ({...values, firstname: "Required"}));
            if(!(input.phone)) setInputError(values => ({...values, phone: "Required"}));
            if(!(input.code)) setInputError(values => ({...values, code: "Required"}));
        }
        
        else if(!(inputError.code) && !(inputError.email) && !(inputError.password) && !(inputError.firstname) && !(inputError.gender) && !(inputError.phone)) {
            try{
                const res = await axios.post("http://localhost:9090/backend/auth/signups2",input,{withCredentials: true});
                console.log(res);
                navigate("/signup/step3",{state: {accountType: input.accountType}});
            } catch(err) {
                console.log(err);
                setRequestError(err.response.data);
            }
        }
        
    };
    const resendCode = () => {
        try{
            const res = axios.post("http://localhost:9090/backend/auth/signups1",input,{withCredentials: true});
            console.log(res);
        } catch(err) {
            console.log(err);
            setRequestError(err.response.data);
        }
    }
    return (
        <form className="form-s3">
            <div className="inform-s3">
                <span>We have sent verification code to your email address which will expire in 5 minutes. Enter the code and fill in your information to create account:</span>
            </div>
            <div className="form-s3-row1">
                <div className="verification-code-field">
                    <label htmlFor="code" className="form-s3-label">Verification code: {"(*)"}</label> <br/>
                    <div>
                        <input type="text" id="code" name="code" onChange={handleChange} />
                        <div className="resend-code" onClick={resendCode}>
                            <span className="mdi--refresh"></span>
                            <span>Resend code</span>
                        </div>
                    </div>
                </div>
                {(inputError.code.length === 0) ? "" : 
                    <div className="error">
                        <span className="ep--warning-filled"></span>
                        <span className="inputError">{inputError.code}</span>
                    </div>
                }
            </div>
            <div className="form-s3-row">
                <div className="email-field">
                    <label htmlFor="email" className="form-s3-label">Email address: {"(*)"}</label> 
                    <input type="email" id="email" name="email" value={email} readOnly={true} required={true} />
                    {(inputError.email.length === 0) ? "" : 
                        <div className="error">
                            <span className="ep--warning-filled"></span>
                            <span className="inputError">{inputError.email}</span>
                        </div>
                    }
                </div>
                <div className="password-field">
                    <label htmlFor="password" className="form-s3-label">Password: {"(*)"}</label> 
                    <input type="password" id="password" name="password" required={true} onChange={handleChange} />
                    {(inputError.password.length === 0) ? "" : 
                        <div className="error">
                            <span className="ep--warning-filled"></span>
                            <span className="inputError">{inputError.password}</span>
                        </div>
                    }
                </div>
            </div>
            <div className="form-s3-row">
                <div className="firstname-field">
                    <label htmlFor="firstname" className="form-s3-label">First Name: {"(*)"}</label> 
                    <input type="text" id="firstname" name="firstname" required={true} onChange={handleChange} />
                    {(inputError.firstname.length === 0) ? "" : 
                        <div className="error">
                            <span className="ep--warning-filled"></span>
                            <span className="inputError">{inputError.firstname}</span>
                        </div>
                    }
                </div>
                <div className="surname-field">
                    <label htmlFor="surname" className="form-s3-label">Surname:</label> 
                    <input type="text" id="surname" name="surname" onChange={handleChange} />
                </div>
            </div>
            <div className="form-s3-row">
                <div className="dob-field">
                    <label htmlFor="dob" className="form-s3-label">Date of birth:</label> 
                    <input type="date" id="dob" name="dob" onChange={handleChange} />
                </div>
                <div className="gender-field">
                    <label htmlFor="gender" className="form-s3-label">Gender:</label> 
                    <input type="text" id="gender" name="gender" placeholder="Male/Female" onChange={handleChange} />
                    {(inputError.gender.length === 0) ? "" : 
                        <div className="error">
                            <span className="ep--warning-filled"></span>
                            <span className="inputError">{inputError.gender}</span>
                        </div>
                    }
                </div>
            </div>
            <div className="form-s3-row">
                <div className="address-field">
                    <label htmlFor="address" className="form-s3-label">Address:</label> 
                    <input type="text" id="address" name="address" onChange={handleChange} />
                </div>
                <div className="phone-field"> 
                    <label htmlFor="phone" className="form-s3-label">Phone number: {"(*)"}</label> 
                    <input type="tel" id="phone" name="phone" required={true} onChange={handleChange} />
                    {(inputError.phone.length === 0) ? "" : 
                        <div className="error">
                            <span className="ep--warning-filled"></span>
                            <span className="inputError">{inputError.phone}</span>
                        </div>
                    }
                </div>
            </div>
            <p className="requestError">{(requestError.length === 0) ? "" : <><span className="ep--warning-filled"></span>{requestError}</>}</p>
            <div className="continue-btn">
                <button className="submit-info-loginform" type="submit" onClick={handleSubmit}>Create account</button>
            </div>
        </form>
    );
}
const Step3 = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if(!location.state || !location.state.accountType) {
            navigate("/error");
            navigate(0);
        }
    });
    if(location.state?.accountType === "Customer") {
        return (
            <div className="form-s4">
                <div className="inform-s4">
                    <span>Your account has been created and you can now login using this account.</span> <br/>
                    <span>Welcome to our online shop! </span>
                </div>
                <div className="continue-btn">
                    <Link to="/">Let's start</Link>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="form-s4">
                <span>Your request to create an employee/manager account has been sent. We will inform you via your email address soon!</span>
                <div className="continue-btn">
                    <Link to="/">Back to home</Link>
                </div>
            </div>
        );
    }
    
}

const SignupForm = (props) => {
    return (
        <div className="signupform">
            <div className="signupform-header">
                <span>Create new account</span>
            </div>
            <div className="signupform-content">
                {(props.step === 1) ? <Step1/> : ( (props.step === 2) ? <Step2/> : <Step3/> )}
            </div>
        </div>
    )
}

export default SignupForm;
