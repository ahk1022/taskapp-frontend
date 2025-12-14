import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/Notification';
import { transactionAPI, authAPI } from '../utils/api';
import theme from '../theme';

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

  const user = userData;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  const activePackage = user?.currentPackage || user?.pendingPackage;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.greeting}>Welcome back, {user?.username || 'User'}!</p>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Balance Card */}
        <div style={styles.balanceCard}>
          <div style={styles.balanceHeader}>
            <span style={styles.balanceIcon}>💰</span>
            <h3 style={styles.balanceTitle}>Wallet Balance</h3>
          </div>
          <p style={styles.balanceAmount}>₨ {user?.wallet?.balance || 0}</p>
          <div style={styles.balanceDetails}>
            <div style={styles.balanceItem}>
              <span style={styles.balanceItemIcon}>📈</span>
              <div>
                <p style={styles.detailLabel}>Total Earnings</p>
                <p style={styles.detailValue}>₨ {user?.wallet?.earnings || 0}</p>
              </div>
            </div>
            <div style={styles.balanceItem}>
              <span style={styles.balanceItemIcon}>👥</span>
              <div>
                <p style={styles.detailLabel}>Referral Bonus</p>
                <p style={styles.detailValue}>₨ {user?.wallet?.referralEarnings || 0}</p>
              </div>
            </div>
          </div>
          <Link to="/withdraw" style={styles.withdrawBtn}>
            Withdraw Money
            <span style={styles.btnArrow}>→</span>
          </Link>
        </div>

        {/* Package Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📦</span>
            <h3 style={styles.cardTitle}>Current Package</h3>
          </div>
          {activePackage ? (
            <>
              <p style={styles.packageName}>{activePackage.name}</p>
              <div style={styles.packageInfo}>
                <div style={styles.packageRow}>
                  <span>Tasks per day</span>
                  <strong>{activePackage.tasksPerDay}</strong>
                </div>
                <div style={styles.packageRow}>
                  <span>Reward per task</span>
                  <strong>₨{activePackage.rewardPerTask}</strong>
                </div>
                {user.packageStatus === 'active' && user.packagePurchaseDate && (
                  <div style={styles.packageRow}>
                    <span>Valid till</span>
                    <strong>{new Date(new Date(user.packagePurchaseDate).getTime() + activePackage.totalDays * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>
                  </div>
                )}
              </div>
              <div style={styles.statusRow}>
                <span style={styles.statusLabel}>Status</span>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: user.packageStatus === 'active' ? theme.colors.successBg :
                                   user.packageStatus === 'pending' ? theme.colors.warningBg : theme.colors.dangerBg,
                  color: user.packageStatus === 'active' ? theme.colors.successDark :
                         user.packageStatus === 'pending' ? theme.colors.warning : theme.colors.danger,
                }}>
                  {user.packageStatus === 'active' ? 'Active' :
                   user.packageStatus === 'pending' ? 'Pending Approval' :
                   user.packageStatus === 'expired' ? 'Expired' : 'Unknown'}
                </span>
              </div>
            </>
          ) : (
            <div style={styles.noPackage}>
              <p style={styles.noPackageText}>No active package</p>
              <p style={styles.noPackageSubtext}>Buy a package to start earning</p>
              <Link to="/packages" style={styles.buyBtn}>
                Browse Packages
                <span style={styles.btnArrow}>→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Statistics Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📊</span>
            <h3 style={styles.cardTitle}>Statistics</h3>
          </div>
          <div style={styles.statsList}>
            <div style={styles.statItem}>
              <div style={styles.statIconWrapper}>
                <span style={styles.statIcon}>✅</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statLabel}>Tasks Completed</span>
                <strong style={styles.statValue}>{user?.tasksCompleted || 0}</strong>
              </div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statIconWrapper}>
                <span style={styles.statIcon}>👥</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statLabel}>Total Referrals</span>
                <strong style={styles.statValue}>{user?.referralCount || 0}</strong>
              </div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statIconWrapper}>
                <span style={styles.statIcon}>💸</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statLabel}>Total Withdrawn</span>
                <strong style={styles.statValue}>₨ {stats?.withdrawals?.total || 0}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🎁</span>
            <h3 style={styles.cardTitle}>Your Referral Code</h3>
          </div>
          <div style={styles.referralSection}>
            <div style={styles.referralCodeBox}>
              <code style={styles.code}>{user?.referralCode}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/register?ref=${user?.referralCode}`
                  );
                  success('Referral link copied! Share it to earn ₨10 per referral.');
                }}
                style={styles.copyBtn}
              >
                Copy Link
              </button>
            </div>
            <p style={styles.referralInfo}>
              <span style={styles.referralHighlight}>Earn ₨10</span> for each friend who registers using your code!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionGrid}>
          <Link to="/tasks" style={styles.actionCard}>
            <div style={styles.actionIconWrapper}>
              <span style={styles.actionIcon}>✅</span>
            </div>
            <div style={styles.actionContent}>
              <h3 style={styles.actionTitle}>Complete Tasks</h3>
              <p style={styles.actionDesc}>Start earning by completing available tasks</p>
            </div>
            <span style={styles.actionArrow}>→</span>
          </Link>
          <Link to="/packages" style={styles.actionCard}>
            <div style={styles.actionIconWrapper}>
              <span style={styles.actionIcon}>📦</span>
            </div>
            <div style={styles.actionContent}>
              <h3 style={styles.actionTitle}>Upgrade Package</h3>
              <p style={styles.actionDesc}>Get a better package for higher earnings</p>
            </div>
            <span style={styles.actionArrow}>→</span>
          </Link>
          <Link to="/referrals" style={styles.actionCard}>
            <div style={styles.actionIconWrapper}>
              <span style={styles.actionIcon}>👥</span>
            </div>
            <div style={styles.actionContent}>
              <h3 style={styles.actionTitle}>View Referrals</h3>
              <p style={styles.actionDesc}>Check your referral earnings and progress</p>
            </div>
            <span style={styles.actionArrow}>→</span>
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem',
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${theme.colors.borderLight}`,
    borderTopColor: theme.colors.primary,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: '1.1rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.25rem',
  },
  greeting: {
    color: theme.colors.textSecondary,
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: '1.5rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.borderLight}`,
  },
  balanceCard: {
    background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`,
    padding: '1.5rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.lg,
    color: theme.colors.white,
  },
  balanceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  balanceIcon: {
    fontSize: '1.5rem',
  },
  balanceTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: '2.75rem',
    fontWeight: '800',
    margin: '0.5rem 0 1.5rem',
    letterSpacing: '-1px',
  },
  balanceDetails: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  balanceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  balanceItemIcon: {
    fontSize: '1.25rem',
  },
  detailLabel: {
    fontSize: '0.8rem',
    opacity: 0.8,
    marginBottom: '0.125rem',
  },
  detailValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  withdrawBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: theme.colors.white,
    color: theme.colors.primaryDark,
    padding: '0.875rem',
    borderRadius: theme.radius.md,
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  },
  btnArrow: {
    fontSize: '1.1rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  cardIcon: {
    fontSize: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  packageName: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: theme.colors.success,
    marginBottom: '1rem',
  },
  packageInfo: {
    marginBottom: '1rem',
  },
  packageRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.625rem 0',
    borderBottom: `1px solid ${theme.colors.borderLight}`,
    color: theme.colors.textSecondary,
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
  },
  statusLabel: {
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  statusBadge: {
    padding: '0.375rem 0.875rem',
    borderRadius: theme.radius.full,
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  noPackage: {
    textAlign: 'center',
    padding: '1rem 0',
  },
  noPackageText: {
    color: theme.colors.textPrimary,
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  noPackageSubtext: {
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
    marginBottom: '1.25rem',
  },
  buyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    padding: '0.75rem 1.5rem',
    borderRadius: theme.radius.md,
    textDecoration: 'none',
    fontWeight: '600',
    boxShadow: theme.shadows.success,
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.875rem',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.borderLight}`,
  },
  statIconWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: theme.radius.md,
    background: `linear-gradient(135deg, ${theme.colors.primaryBg} 0%, ${theme.colors.successBg} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: '1.25rem',
  },
  statContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  statValue: {
    color: theme.colors.primaryDark,
    fontSize: '1.1rem',
  },
  referralSection: {
    textAlign: 'center',
  },
  referralCodeBox: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  code: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    fontSize: '1.1rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    border: `2px solid ${theme.colors.border}`,
    textAlign: 'center',
    letterSpacing: '1px',
  },
  copyBtn: {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    border: 'none',
    padding: '0.875rem 1.25rem',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    boxShadow: theme.shadows.button,
  },
  referralInfo: {
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  referralHighlight: {
    color: theme.colors.success,
    fontWeight: '700',
  },
  quickActions: {
    marginTop: '1rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '1.5rem',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: theme.colors.white,
    padding: '1.25rem',
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.card,
    textDecoration: 'none',
    border: `1px solid ${theme.colors.borderLight}`,
    transition: 'all 0.2s ease',
  },
  actionIconWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: theme.radius.md,
    background: `linear-gradient(135deg, ${theme.colors.primaryBg} 0%, ${theme.colors.successBg} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionIcon: {
    fontSize: '1.5rem',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginBottom: '0.25rem',
  },
  actionDesc: {
    fontSize: '0.85rem',
    color: theme.colors.textSecondary,
  },
  actionArrow: {
    fontSize: '1.25rem',
    color: theme.colors.primary,
    fontWeight: '600',
  },
};

// Add hover effects and animations
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  if (!document.getElementById('dashboard-styles')) {
    styleSheet.id = 'dashboard-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Dashboard;
