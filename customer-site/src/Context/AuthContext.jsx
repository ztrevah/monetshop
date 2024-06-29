import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider =  ({children}) => {
    const [currentUser,setCurrentUser] = useState({});
    axios.defaults.withCredentials = true;
    const login  = async (input) => {
        try {
            const res = await axios.post("http://localhost:9090/backend/auth/login",input,{withCredentials: true});
            setCurrentUser(res.data);
        } catch (err) {
            console.log(err);
        }
        
    };
    
    const logout = async () => {
        await axios.post("http://localhost:9090/backend/auth/logout");
        setCurrentUser(null);
    };
    const verify = async () => {
        try {
            const res = await axios.post("http://localhost:9090/backend/auth/verify",null);
            if(res.data) {
                setCurrentUser(res.data);
            } 
            else {
                setCurrentUser(null);
            }
        } catch(err) {
            setCurrentUser(null);
            console.log(err);
        }
    }
    useEffect(() => {
        verify();
    },[]);
    return <AuthContext.Provider value = {{currentUser,login,logout,verify}}>{children}</AuthContext.Provider>;
}