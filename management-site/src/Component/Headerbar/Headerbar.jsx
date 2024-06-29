import React, { useContext } from 'react'
import "./Headerbar.css"
import { AuthContext } from '../../Context/AuthContext'

const Headerbar = () => {
    const {currentUser} = useContext(AuthContext);
    if(currentUser) {
        return (
            <header>
                <div className="shoplogo">
                    <img src="http://localhost:5000/images/shoplogo.png" alt="" />
                </div>
                <div className="accountlogo-wrapper">
                    <div className="accountinfo">
                        <span className="accountname">{currentUser.firstname + " " + currentUser.surname}</span>
                        <span className="accounttype">{currentUser.type}</span>
                    </div>
                    <div className="accountavatar">
                        <span className="carbon--user-avatar-filled"></span>
                    </div>
                </div>
            </header>
        )
    }
}

export default Headerbar