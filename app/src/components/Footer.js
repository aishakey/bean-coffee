import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Bean. All rights reserved.
    </footer>
  );
};

export default Footer;
