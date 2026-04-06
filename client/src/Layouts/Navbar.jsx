import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../Components/Logo";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const { cart, totalItems } = useCart();

  console.log(totalItems, "total items");

  console.log(cart);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="display-flex space-between">
          <Logo />

          <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        <ul className={`navbar-menu ${isOpen ? "open" : ""}`}>
          <li className="navbar-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              SHOP
            </NavLink>
          </li>

          <li className="navbar-item">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              CONTACT
            </NavLink>
          </li>

          {/* <li className="navbar-item">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              ABOUT
            </NavLink>
          </li> */}

          {user && user.is_admin === 1 && (
            <li className="navbar-item">
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
                onClick={() => setIsOpen(false)}
              >
                UPLOAD
              </NavLink>
            </li>
          )}
          {!user ? (
            <li className="navbar-item">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "active" : ""}`
                }
                onClick={() => setIsOpen(false)}
              >
                SIGN IN
              </NavLink>
            </li>
          ) : (
            <li className="navbar-item">
              <button
                className="navbar-link"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                SIGN OUT
              </button>
            </li>
          )}
          <li className="navbar-item" id="cart-drop-zone">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setIsOpen(false)}
            >
              <div className="cart-wrapper">
                <i className="fa-solid fa-cart-shopping"></i>
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
