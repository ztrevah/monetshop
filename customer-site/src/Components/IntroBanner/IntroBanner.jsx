import React from 'react';
import "../IntroBanner/IntroBanner.css";
import { Link } from 'react-router-dom';
const IntroBanner = () => {
  return (
    <div className="intro-banner-wrapper">
        <div className="intro-banner">
            <div className="banner-content">
                <div>
                    <p className="shopname">Monet shop -<br/> Giftbox for lovers</p>
                    <p className="shopintro">Still confused of choosing which to give your lover, family or friends as a present? Come to our shop, we will bring you great options that help you delight your beloved!</p>
                    <Link to="/products"><button>Shop now!</button></Link>
                </div>
                
            </div>
        </div>
    </div>

  )
};

export default IntroBanner;