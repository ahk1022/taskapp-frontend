import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.stats);
      setRecentUsers(response.data.recentUsers);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Users</h3>
          <p style={styles.statValue}>{stats?.totalUsers || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Active Packages</h3>
          <p style={styles.statValue}>{stats?.activePackages || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Total Earnings Paid</h3>
          <p style={styles.statValue}>₨ {stats?.totalEarnings || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Total Withdrawals</h3>
          <p style={styles.statValue}>₨ {stats?.totalWithdrawals || 0}</p>
        </div>
        <div style={{...styles.statCard, ...styles.pendingCard}}>
          <h3>Pending Withdrawals</h3>
          <p style={styles.statValue}>{stats?.pendingWithdrawals || 0}</p>
          <Link to="/admin/withdrawals" style={styles.viewLink}>View All</Link>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionGrid}>
          <Link to="/admin/withdrawals" style={styles.actionCard}>
            <h3>📤 Manage Withdrawals</h3>
            <p>Approve or reject withdrawal requests</p>
          </Link>
          <Link to="/admin/packages" style={styles.actionCard}>
            <h3>📦 Package Approvals</h3>
            <p>Approve pending package purchases</p>
          </Link>
          <Link to="/admin/users" style={styles.actionCard}>
            <h3>👥 Manage Users</h3>
            <p>View and manage all users</p>
          </Link>
          <Link to="/admin/transactions" style={styles.actionCard}>
            <h3>💳 Transactions</h3>
            <p>View all transaction history</p>
          </Link>
        </div>
      </div>

      <div style={styles.recentSection}>
        <h2 style={styles.sectionTitle}>Recent Users</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Balance</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user._id} style={styles.tr}>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>₨ {user.wallet.balance}</td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  pendingCard: {
    backgroundColor: '#fff3cd',
    border: '2px solid #ffc107',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#27ae60',
    margin: '1rem 0',
  },
  viewLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  quickActions: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: '#2c3e50',
    transition: 'transform 0.2s',
  },
  recentSection: {
    marginTop: '3rem',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  tr: {
    borderBottom: '1px solid #ecf0f1',
  },
  td: {
    padding: '1rem',
  },
};

export default AdminDashboard;
