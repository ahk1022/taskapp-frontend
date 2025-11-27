import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/Notification';
import { transactionAPI, authAPI } from '../utils/api';

const Dashboard = () => {
  const { updateUser } = useAuth();
  const { success } = useNotification();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, profileResponse] = await Promise.all([
        transactionAPI.getStats(),
        authAPI.getProfile(),
      ]);
      setStats(statsResponse.data);
      setUserData(profileResponse.data);
      updateUser(profileResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use userData from API response directly
  const user = userData;

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  // Get the package (either current or pending)
  const activePackage = user?.currentPackage || user?.pendingPackage;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.grid}>
        <div style={{ ...styles.card, ...styles.balanceCard }}>
          <h3 style={styles.cardTitle}>Wallet Balance</h3>
          <p style={styles.balanceAmount}>₨ {user?.wallet?.balance || 0}</p>
          <div style={styles.balanceDetails}>
            <div>
              <p style={styles.detailLabel}>Total Earnings</p>
              <p style={styles.detailValue}>₨ {user?.wallet?.earnings || 0}</p>
            </div>
            <div>
              <p style={styles.detailLabel}>Referral Earnings</p>
              <p style={styles.detailValue}>₨ {user?.wallet?.referralEarnings || 0}</p>
            </div>
          </div>
          <Link to="/withdraw" style={styles.withdrawBtn}>Withdraw Money</Link>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Current Package</h3>
          {activePackage ? (
            <>
              <p style={styles.packageName}>{activePackage.name}</p>
              <div style={styles.packageDetails}>
                <p>Tasks per day: {activePackage.tasksPerDay}</p>
                <p>Reward per task: ₨{activePackage.rewardPerTask}</p>
                {user.packageStatus === 'active' && user.packagePurchaseDate && (
                  <p>Valid till: {new Date(new Date(user.packagePurchaseDate).getTime() + activePackage.totalDays * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                )}
              </div>
              <div style={styles.statusRow}>
                <span>Status:</span>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: user.packageStatus === 'active' ? '#27ae60' :
                                   user.packageStatus === 'pending' ? '#f39c12' : '#e74c3c'
                }}>
                  {user.packageStatus === 'active' ? 'Active' :
                   user.packageStatus === 'pending' ? 'Pending' :
                   user.packageStatus === 'expired' ? 'Expired' : 'Unknown'}
                </span>
              </div>
            </>
          ) : (
            <>
              <p style={styles.noPackage}>No active package</p>
              <Link to="/packages" style={styles.buyBtn}>Buy Package</Link>
            </>
          )}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Statistics</h3>
          <div style={styles.statsList}>
            <div style={styles.statItem}>
              <span>Tasks Completed</span>
              <strong>{user?.tasksCompleted || 0}</strong>
            </div>
            <div style={styles.statItem}>
              <span>Referrals</span>
              <strong>{user?.referralCount || 0}</strong>
            </div>
            <div style={styles.statItem}>
              <span>Total Withdrawn</span>
              <strong>₨ {stats?.withdrawals?.total || 0}</strong>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Referral Code</h3>
          <div style={styles.referralCode}>
            <code style={styles.code}>{user?.referralCode}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/register?ref=${user?.referralCode}`
                );
                success('Referral link copied to clipboard! Share it with friends to earn ₨10 per referral.');
              }}
              style={styles.copyBtn}
            >
              Copy Link
            </button>
          </div>
          <p style={styles.referralInfo}>
            Earn ₨10 for each friend who registers using your code!
          </p>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionGrid}>
          <Link to="/tasks" style={styles.actionCard}>
            <h3>Complete Tasks</h3>
            <p>Start earning by completing available tasks</p>
          </Link>
          <Link to="/packages" style={styles.actionCard}>
            <h3>Upgrade Package</h3>
            <p>Get a better package for higher earnings</p>
          </Link>
          <Link to="/referrals" style={styles.actionCard}>
            <h3>View Referrals</h3>
            <p>Check your referral earnings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
  },
  cardTitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    opacity: 0.9,
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #ecf0f1',
  },
  statusBadge: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '1rem 0',
  },
  balanceDetails: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
  },
  detailLabel: {
    fontSize: '0.85rem',
    opacity: 0.8,
    marginBottom: '0.25rem',
  },
  detailValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  withdrawBtn: {
    display: 'block',
    textAlign: 'center',
    backgroundColor: '#fff',
    color: '#667eea',
    padding: '0.75rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  packageName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '1rem',
  },
  packageDetails: {
    lineHeight: '1.8',
  },
  noPackage: {
    color: '#7f8c8d',
    marginBottom: '1rem',
  },
  buyBtn: {
    display: 'inline-block',
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
  },
  referralCode: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  code: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  copyBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  referralInfo: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  quickActions: {
    marginTop: '3rem',
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
};

export default Dashboard;
