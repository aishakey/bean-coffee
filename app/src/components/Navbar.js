import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./navbar.css";
import beanLogo from "../assets/bean-logo.svg";
import hamburgerIcon from "../assets/menu.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <Link to="/" onClick={closeMenu}>
        <img src={beanLogo} alt="bean" className="bean-icon" />
      </Link>

      <div className="hamburger-menu" onClick={toggleMenu}>
        <img src={hamburgerIcon} alt="Menu" />
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/coffeeshops" onClick={closeMenu}>
          coffee shops
        </Link>
        <Link to="/about" onClick={closeMenu}>
          about
        </Link>
        <Link to="/contact" onClick={closeMenu}>
          contact
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" onClick={closeMenu}>
              my profile
            </Link>
            <button onClick={handleLogout} className="auth-btn sign-out-btn">
              sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" onClick={closeMenu} className="login-btn">
              login
            </Link>
            <Link to="/signup" onClick={closeMenu} className="auth-btn">
              sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
