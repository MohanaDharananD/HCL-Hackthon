import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="nav-logo">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">Retail<span className="logo-accent">Hub</span></span>
        </Link>

        {/* Search */}
        <div className="navbar-search" id="nav-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search products..." className="search-input" />
        </div>

        {/* Desktop Nav */}
        <div className="navbar-actions">
          <Link to="/" className="nav-link" id="nav-home">Home</Link>

          {user ? (
            <>
              <Link to="/orders" className="nav-link" id="nav-orders">
                <Package size={18} />
                <span>Orders</span>
              </Link>

              <Link to="/cart" className="nav-link cart-link" id="nav-cart">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>

              <div className="profile-menu">
                <button
                  className="profile-trigger"
                  onClick={() => setProfileOpen(!profileOpen)}
                  id="nav-profile"
                >
                  <div className="avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>

                {profileOpen && (
                  <div className="profile-dropdown animate-scaleIn">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setProfileOpen(false)}
                        id="nav-admin"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    <button className="dropdown-item logout" onClick={handleLogout} id="nav-logout">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="nav-login-btn">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} id="nav-mobile-toggle">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu animate-slideDown">
          <div className="mobile-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search products..." className="search-input" />
          </div>
          <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>
          {user && (
            <>
              <Link to="/cart" className="mobile-link" onClick={() => setMobileOpen(false)}>
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              <Link to="/orders" className="mobile-link" onClick={() => setMobileOpen(false)}>Orders</Link>
              {isAdmin && (
                <Link to="/admin" className="mobile-link" onClick={() => setMobileOpen(false)}>Admin</Link>
              )}
              <button className="mobile-link logout" onClick={handleLogout}>Sign Out</button>
            </>
          )}
          {!user && (
            <Link to="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
