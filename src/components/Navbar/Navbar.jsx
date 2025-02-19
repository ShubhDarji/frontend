import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbar.css"; 
import SearchBar from "../SeachBar/SearchBar"
import CloseIcon from "../../Images/svgs/close_FILL0_wght400_GRAD0_opsz48.svg";
import MenuIcon from "../../Images/svgs/menu_FILL0_wght400_GRAD0_opsz48.svg";
import CartIcon from "../../Images/svgs/shopping-cart-01-svgrepo-com.svg";
import UserIcon from "../../Images/svgs/user-icon.svg"; // Add user icon
import Logo from "../../Images/logo.png";

const Navbar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(storedCart.length);
    };

    updateCartCount(); // Update on mount
    window.addEventListener("storage", updateCartCount);
    
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Mobile Sidebar */}
      <ul className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
        <li onClick={() => setIsSidebarVisible(false)}>
          <img src={CloseIcon} alt="Close menu" width={26} height={26} />
        </li>
        <li><Link to="/">Festival Offer</Link></li>
        <li><Link to="/shop">Products</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/cart">
          <img src={CartIcon} alt="Cart" width={26} height={26} />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link></li>
      </ul>

      {/* Desktop & Mobile Navbar */}
      <div className="navbar-container">
        {/* Mobile Menu Button */}
        <button className="menu-btn" onClick={() => setIsSidebarVisible(true)}>
          <img src={MenuIcon} alt="Menu" width={26} height={26} />
        </button>

        {/* Logo */}
        <Link to="/" className="logo">
          <img src={Logo} alt="Smart Appliances" />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="nav-links hideOnMobile">
          <li><Link to="/shop">Products</Link></li>
          <li><Link to="/">Festival Offers</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        {/* Search Bar */}
        <SearchBar />

        {/* User & Cart Icons */}
        <div className="icons">
          <Link to="/profile"><img src={UserIcon} alt="User" width={26} height={26} /></Link>
          <Link to="/cart" className="cart-icon">
            <img src={CartIcon} alt="Cart" width={26} height={26} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
