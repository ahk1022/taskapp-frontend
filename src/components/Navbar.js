import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo} onClick={handleLinkClick}>
          MN Works
        </Link>

        <button
          className="navbar-hamburger"
          style={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
          <span style={styles.hamburgerLine}></span>
        </button>

        <div
          className={mobileMenuOpen ? 'navbar-links-mobile' : 'navbar-links'}
          style={{
            ...styles.navLinks,
            ...(mobileMenuOpen ? styles.navLinksMobile : {})
          }}
        >
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link} onClick={handleLinkClick}>Dashboard</Link>
              <Link to="/packages" style={styles.link} onClick={handleLinkClick}>Packages</Link>
              <Link to="/tasks" style={styles.link} onClick={handleLinkClick}>Tasks</Link>
              <Link to="/withdraw" style={styles.link} onClick={handleLinkClick}>Withdraw</Link>
              <Link to="/referrals" style={styles.link} onClick={handleLinkClick}>Referrals</Link>
              <div style={styles.userInfo}>
                <span style={styles.balance}>₨ {user?.wallet?.balance || 0}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} onClick={handleLinkClick}>Login</Link>
              <Link to="/register" style={styles.registerBtn} onClick={handleLinkClick}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
    flexWrap: 'wrap',
  },
  logo: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    zIndex: 1001,
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    zIndex: 1001,
  },
  hamburgerLine: {
    width: '25px',
    height: '3px',
    backgroundColor: '#fff',
    margin: '3px 0',
    display: 'block',
    borderRadius: '2px',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  navLinksMobile: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#2c3e50',
    padding: '1rem',
    gap: '1rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s',
    padding: '0.5rem 0',
  },
  registerBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: '500',
    textAlign: 'center',
  },
  userInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  balance: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

// Add mobile responsive styles for navbar
if (typeof document !== 'undefined') {
  const navbarStyleSheet = document.createElement('style');
  navbarStyleSheet.textContent = `
    @media (max-width: 768px) {
      .navbar-hamburger {
        display: flex !important;
      }

      .navbar-links {
        display: none !important;
      }

      .navbar-links-mobile {
        display: flex !important;
      }
    }
  `;
  if (!document.getElementById('navbar-mobile-styles')) {
    navbarStyleSheet.id = 'navbar-mobile-styles';
    document.head.appendChild(navbarStyleSheet);
  }
}

export default Navbar;
