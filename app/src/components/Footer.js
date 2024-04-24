import React from "react";
import "./footer.css";
import logo from "../assets/w-logo.svg";
import inst from "../assets/inst.svg";
import fb from "../assets/fb.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={logo} alt="White Bean" className="footer-logo" />
        <p>DISCOVER COFFEE SPOTS THAT MOVE YOU</p>
        <div className="social-links">
          <a href="https://www.instagram.com">
            <img src={inst} alt="Instagram" />
          </a>
          <a href="https://www.facebook.com">
            <img src={fb} alt="Facebook" />
          </a>
        </div>
      </div>
      <div className="footer-date">
        © {new Date().getFullYear()} Bean. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
