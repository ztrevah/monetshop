import React from 'react';
import "./Footer.css";
import logo from "../assets/media/shoplogo.png";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer1">
        <div className="footer11">
          <div><img className="logo" src={logo} alt="Shop logo" /></div>
          <div className="shopaddress">
            <span>Address: Hadong, Hanoi</span>
          </div>
          <div className="hotline">
            <span>{"Hotline: (+84) 094-339-4091"}</span>
          </div>
        </div>
        <div className="footer12">
          <div><span style={{fontWeight: 600}}>Social media:</span></div>
          <div className="socialmedia">
            <div className="instagram">
                <span className="mdi--instagram"></span>
                <span>Instagram: </span>
                <a href='https://www.instagram.com/monet.giftbox/' target='_blank' rel="noopener noreferrer">@monet.giftbox</a>
            </div>
            <div className="facebook">
              <span className="ic--baseline-facebook"></span>
              <span>Facebook: </span>
              <a href='https://www.facebook.com/harlinguy' target='_blank' rel="noopener noreferrer">@monet.giftbox</a>
            </div>
          </div>
        </div>
        <div className="footer13">
          <div><Link>Help & customer service</Link></div>
          <div><Link>Terms & conditions</Link></div>
          <div><Link>Privacy policy</Link></div>
        </div>
      </div>
      <div className="footer2">
        <div className="footer21">
          <div><span className="twemoji--flag-vietnam"></span></div>
          <div><span>VN</span></div>
        </div>
        <div className="footer22">
          <span>©2024 Monet giftbox</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer;