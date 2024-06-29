import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider =  ({children}) => {
    const [currentUser,setCurrentUser] = useState({});
    axios.defaults.withCredentials = true;
    const login  = async (input) => {
        try {
            const res = await axios.post("https://monetshop.onrender.com/api/auth/login",input,{withCredentials: true});
            setCurrentUser(res.data);
        } catch (err) {
            console.log(err);
        }
        
    };
    
    const logout = async () => {
        try {
            await axios.post("https://monetshop.onrender.com/api/auth/logout",null,{withCredentials: true});
            setCurrentUser(null);
        } catch(err) {
            console.log(err);
        }
    };
    const verify = async () => {
        try {
            const res = await axios.post("https://monetshop.onrender.com/api/auth/verify",null,{withCredentials: true});
            setCurrentUser(res.data);
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