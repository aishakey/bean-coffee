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
        <img src={beanLogo} alt="Outlined Coffee Bean" className="bean-icon" />
      </Link>

      <div className="hamburger-menu" onClick={toggleMenu}>
        <img src={hamburgerIcon} alt="Menu" />
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/coffeeshops" onClick={closeMenu}>
          CoffeeShops
        </Link>
        <Link to="/about" onClick={closeMenu}>
          About
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" onClick={closeMenu}>
              Profile
            </Link>
            <button onClick={handleLogout} className="sign-out-btn">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" onClick={closeMenu}>
              Sign Up
            </Link>
            <Link to="/signin" onClick={closeMenu}>
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
