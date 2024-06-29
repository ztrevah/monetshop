import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider =  ({children}) => {
    const [currentUser,setCurrentUser] = useState({});
    axios.defaults.withCredentials = true;
    const login  = async (input) => {
        try {
            const res = await axios.post("https://monetshop.onrender.com/api/management/login",input,{withCredentials: true});
            setCurrentUser(res.data);
        } catch (err) {
            console.log(err);
        }
        
    };
    
    const logout = async () => {
        await axios.post("https://monetshop.onrender.com/api/management/logout");
        setCurrentUser(null);
    };
    const verify = async () => {
        try {
            const res = await axios.post("https://monetshop.onrender.com/api/management/verify",null,{withCredentials: true});
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
    return <AuthContext.Provider value = {{currentUser,login,logout}}>{children}</AuthContext.Provider>;
}