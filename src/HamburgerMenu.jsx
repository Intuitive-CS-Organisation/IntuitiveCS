import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HamburgerMenu.css";
import Logo from "./assets/logo.JPEG";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);

    // Accessibility: Update aria-hidden
    document
      .querySelector(".sliding-menu")
      .setAttribute("aria-hidden", !isOpen);
  };

  return (
    <>
      {/* Hamburger Icon */}
      <div
        className="hamburger-icon"
        onClick={toggleMenu}
        role="button"
        tabIndex="0"
        aria-label="Toggle menu"
      >
        <img src={Logo} alt="Menu" />
      </div>

      {/* Overlay */}
      <div
        className={`menu-overlay ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      ></div>

      {/* Sliding Menu */}
      <div
        className={`sliding-menu ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        <span
          className="close-btn"
          onClick={toggleMenu}
          role="button"
          tabIndex="0"
          aria-label="Close menu"
        >
          ×
        </span>
        <ul>
          <li>
            <Link to="/" onClick={toggleMenu}>
              Home Page
            </Link>
          </li>
          <li>
            <Link to="/app" onClick={toggleMenu}>
              App Page
            </Link>
          </li>
          <li>
            <Link to="/functions" onClick={toggleMenu}>
              Functions Page
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default HamburgerMenu;
