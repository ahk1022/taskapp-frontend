import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/admin" style={styles.logo}>
          Admin Panel
        </Link>

        <div style={styles.navLinks}>
          <Link to="/admin" style={styles.link}>Dashboard</Link>
          <Link to="/admin/tasks" style={styles.link}>Tasks</Link>
          <Link to="/admin/withdrawals" style={styles.link}>Withdrawals</Link>
          <Link to="/admin/packages" style={styles.link}>Packages</Link>
          <Link to="/admin/users" style={styles.link}>Users</Link>
          <Link to="/admin/transactions" style={styles.link}>Transactions</Link>

          <div style={styles.userInfo}>
            <span style={styles.adminBadge}>{user?.username} (Admin)</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#34495e',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
  },
  logo: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s',
  },
  userInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  adminBadge: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default AdminNav;
