import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

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
          <span style={styles.logoIcon}>MN</span>
          <span style={styles.logoText}>Works</span>
        </Link>

        <button
          className="navbar-hamburger"
          style={styles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{
            ...styles.hamburgerLine,
            transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }}></span>
          <span style={{
            ...styles.hamburgerLine,
            opacity: mobileMenuOpen ? 0 : 1
          }}></span>
          <span style={{
            ...styles.hamburgerLine,
            transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
          }}></span>
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
              <Link to="/dashboard" style={styles.link} onClick={handleLinkClick}>
                <span style={styles.linkIcon}>📊</span> Dashboard
              </Link>
              <Link to="/packages" style={styles.link} onClick={handleLinkClick}>
                <span style={styles.linkIcon}>📦</span> Packages
              </Link>
              <Link to="/tasks" style={styles.link} onClick={handleLinkClick}>
                <span style={styles.linkIcon}>✅</span> Tasks
              </Link>
              <Link to="/withdraw" style={styles.link} onClick={handleLinkClick}>
                <span style={styles.linkIcon}>💰</span> Withdraw
              </Link>
              <Link to="/referrals" style={styles.link} onClick={handleLinkClick}>
                <span style={styles.linkIcon}>👥</span> Referrals
              </Link>
              <div style={styles.userInfo}>
                <span style={styles.balance}>
                  <span style={styles.balanceIcon}>💵</span>
                  ₨ {user?.wallet?.balance || 0}
                </span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link} onClick={handleLinkClick}>Login</Link>
              <Link to="/register" style={styles.registerBtn} onClick={handleLinkClick}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`,
    padding: '0.75rem 0',
    boxShadow: '0 4px 20px rgba(30, 64, 175, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
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
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    zIndex: 1001,
  },
  logoIcon: {
    backgroundColor: theme.colors.success,
    color: theme.colors.white,
    padding: '0.5rem 0.75rem',
    borderRadius: theme.radius.md,
    fontWeight: '800',
    fontSize: '1.1rem',
    boxShadow: theme.shadows.success,
  },
  logoText: {
    color: theme.colors.white,
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    zIndex: 1001,
    gap: '4px',
  },
  hamburgerLine: {
    width: '24px',
    height: '2px',
    backgroundColor: theme.colors.white,
    display: 'block',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  navLinks: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  navLinksMobile: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`,
    padding: '1rem',
    gap: '0.5rem',
    boxShadow: '0 10px 30px rgba(30, 64, 175, 0.3)',
    zIndex: 1000,
  },
  link: {
    color: 'rgba(255, 255, 255, 0.9)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    padding: '0.625rem 1rem',
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  linkIcon: {
    fontSize: '1rem',
  },
  registerBtn: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    padding: '0.625rem 1.25rem',
    borderRadius: theme.radius.md,
    textDecoration: 'none',
    fontWeight: '600',
    textAlign: 'center',
    boxShadow: theme.shadows.success,
    transition: 'all 0.2s ease',
  },
  userInfo: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: '0.5rem',
  },
  balance: {
    background: 'rgba(16, 185, 129, 0.2)',
    border: `1px solid ${theme.colors.success}`,
    color: theme.colors.white,
    padding: '0.5rem 1rem',
    borderRadius: theme.radius.full,
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  balanceIcon: {
    fontSize: '1rem',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: `1px solid ${theme.colors.danger}`,
    color: theme.colors.white,
    padding: '0.5rem 1rem',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
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

    .navbar-links a:hover,
    .navbar-links-mobile a:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: #fff !important;
    }

    .navbar-links button:hover,
    .navbar-links-mobile button:hover {
      background-color: rgba(239, 68, 68, 0.3) !important;
    }
  `;
  if (!document.getElementById('navbar-mobile-styles')) {
    navbarStyleSheet.id = 'navbar-mobile-styles';
    document.head.appendChild(navbarStyleSheet);
  }
}

export default Navbar;
