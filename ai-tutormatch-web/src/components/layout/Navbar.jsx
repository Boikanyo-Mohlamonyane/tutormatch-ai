import { useState } from "react";

import { Link } from "react-router-dom";

import AuthModal from "../ui/AuthModal";

import "../../assets/styles/home.css";
import "../../assets/styles/components.css";

function Navbar() {

  const [mobileMenu, setMobileMenu] = useState(false);

  const [showLogin, setShowLogin] = useState(false);

  const [showRegister, setShowRegister] =
    useState(false);

  return (
    <>
      {/* LOGIN MODAL */}
      {showLogin && (
        <AuthModal
          type="login"
          closeModal={() => setShowLogin(false)}
        />
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <AuthModal
          type="register"
          closeModal={() => setShowRegister(false)}
        />
      )}

      <nav className="navbar">

        {/* LOGO */}
        <div className="logo">
          <span className="logo-highlight">AI</span> TutorMatch
        </div>

        {/* MOBILE MENU */}
        <div
          className="mobile-menu-btn"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰
        </div>

        {/* NAV LINKS */}
        <div
          className={
            mobileMenu
              ? "nav-links nav-mobile-active"
              : "nav-links"
          }
        >

          <Link to="/" className="active">
            Home
          </Link>

          <Link to="/">
            Features
          </Link>

          <Link to="/">
            Tutors
          </Link>

          <Link to="/">
            Dashboards
          </Link>

          <Link to="/">
            Contact
          </Link>

        </div>

        {/* BUTTONS */}
        <div className="nav-actions">

          <button
            className="btn btn-outline"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>

        </div>

      </nav>
    </>
  );
}

export default Navbar;
