import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import theme from '../theme';

const Referrals = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      const response = await authAPI.getReferrals();
      setReferrals(response.data);
    } catch (error) {
      console.error('Failed to load referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
    const text = `Join MN Works and start earning money by completing simple tasks! Use my referral code: ${user?.referralCode}\n\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading referrals...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.badge}>Earn More</span>
        <h1 style={styles.title}>Referral Program</h1>
        <p style={styles.subtitle}>Invite friends and earn ₨10 for each successful referral</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <h3 style={styles.statLabel}>Total Referrals</h3>
          <p style={styles.statValue}>{user?.referralCount || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <h3 style={styles.statLabel}>Referral Earnings</h3>
          <p style={styles.statValueSuccess}>₨ {user?.wallet?.referralEarnings || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎁</div>
          <h3 style={styles.statLabel}>Per Referral</h3>
          <p style={styles.statValue}>₨ 10</p>
        </div>
      </div>

      <div style={styles.referralSection}>
        <div style={styles.codeCard}>
          <h2 style={styles.sectionTitle}>Your Referral Code</h2>
          <div style={styles.codeDisplay}>
            <code style={styles.code}>{user?.referralCode}</code>
            <button onClick={copyReferralLink} style={styles.copyBtn}>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

          <div style={styles.shareSection}>
            <p style={styles.shareLabel}>Share your referral link:</p>
            <div style={styles.shareButtons}>
              <button onClick={shareViaWhatsApp} style={styles.whatsappBtn}>
                <span style={styles.shareIcon}>📱</span>
                Share on WhatsApp
              </button>
              <button onClick={copyReferralLink} style={styles.shareBtn}>
                <span style={styles.shareIcon}>📋</span>
                Copy Link
              </button>
            </div>
          </div>

          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>How it works:</h4>
            <ol style={styles.infoList}>
              <li>Share your referral link or code with friends</li>
              <li>When they register using your code, you earn ₨10 instantly</li>
              <li>Unlimited referrals - invite as many friends as you want!</li>
              <li>Earnings are added directly to your wallet</li>
            </ol>
          </div>
        </div>
      </div>

      <div style={styles.referralListSection}>
        <h2 style={styles.sectionTitle}>Your Referrals ({referrals.length})</h2>

        {referrals.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <p style={styles.emptyTitle}>No referrals yet</p>
            <p style={styles.emptyText}>Start sharing your referral code to earn ₨10 per referral!</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Tasks</th>
                  <th style={styles.th}>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <tr key={referral._id} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.tdBold}>{referral.username}</td>
                    <td style={styles.td}>{referral.email}</td>
                    <td style={styles.td}>
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{referral.tasksCompleted}</td>
                    <td style={styles.tdSuccess}>₨ {referral.wallet?.earnings || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={styles.tipsSection}>
        <h2 style={styles.sectionTitle}>Tips to Maximize Referrals</h2>
        <div style={styles.tipsGrid}>
          <div style={styles.tipCard}>
            <div style={styles.tipIcon}>📱</div>
            <h3 style={styles.tipTitle}>Share on Social Media</h3>
            <p style={styles.tipText}>Post your referral link on Facebook, WhatsApp groups, Instagram</p>
          </div>
          <div style={styles.tipCard}>
            <div style={styles.tipIcon}>👥</div>
            <h3 style={styles.tipTitle}>Tell Friends & Family</h3>
            <p style={styles.tipText}>Personal recommendations work best - tell people you know</p>
          </div>
          <div style={styles.tipCard}>
            <div style={styles.tipIcon}>💬</div>
            <h3 style={styles.tipTitle}>Join Communities</h3>
            <p style={styles.tipText}>Share in online forums and communities interested in earning money</p>
          </div>
          <div style={styles.tipCard}>
            <div style={styles.tipIcon}>📧</div>
            <h3 style={styles.tipTitle}>Email Contacts</h3>
            <p style={styles.tipText}>Send personalized emails to your contacts explaining the benefits</p>
          </div>
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
    textAlign: 'center',
    marginBottom: '3rem',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: theme.colors.successBg,
    color: theme.colors.success,
    padding: '0.5rem 1rem',
    borderRadius: theme.radius.full,
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: '1.1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: theme.colors.white,
    padding: '2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    textAlign: 'center',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: theme.colors.primaryDark,
    margin: 0,
  },
  statValueSuccess: {
    fontSize: '2rem',
    fontWeight: '800',
    color: theme.colors.success,
    margin: 0,
  },
  referralSection: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '1.5rem',
  },
  codeCard: {
    backgroundColor: theme.colors.white,
    padding: '2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.borderLight}`,
  },
  codeDisplay: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  code: {
    flex: 1,
    minWidth: '200px',
    padding: '1rem 1.5rem',
    backgroundColor: theme.colors.background,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    fontSize: '1.5rem',
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.primaryDark,
    letterSpacing: '2px',
  },
  copyBtn: {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: theme.radius.lg,
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: theme.shadows.button,
    transition: 'all 0.2s ease',
    minWidth: '140px',
  },
  shareSection: {
    marginBottom: '2rem',
  },
  shareLabel: {
    marginBottom: '1rem',
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  shareButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
    color: theme.colors.white,
    border: 'none',
    padding: '0.875rem 1.5rem',
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
  },
  shareBtn: {
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
    border: `2px solid ${theme.colors.border}`,
    padding: '0.875rem 1.5rem',
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
  },
  shareIcon: {
    fontSize: '1.1rem',
  },
  infoBox: {
    background: `linear-gradient(135deg, ${theme.colors.successBg} 0%, ${theme.colors.primaryBg} 100%)`,
    border: `1px solid ${theme.colors.successLight}`,
    borderRadius: theme.radius.lg,
    padding: '1.5rem',
  },
  infoTitle: {
    color: theme.colors.primaryDark,
    marginBottom: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
  },
  infoList: {
    marginTop: '0.5rem',
    paddingLeft: '1.5rem',
    lineHeight: '2',
    color: theme.colors.textSecondary,
  },
  referralListSection: {
    marginBottom: '3rem',
  },
  emptyState: {
    backgroundColor: theme.colors.white,
    padding: '4rem 2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    textAlign: 'center',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
  tableContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    overflowX: 'auto',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`,
    color: theme.colors.white,
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  tr: {
    borderBottom: `1px solid ${theme.colors.borderLight}`,
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '1rem',
    color: theme.colors.textSecondary,
  },
  tdBold: {
    padding: '1rem',
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  tdSuccess: {
    padding: '1rem',
    color: theme.colors.success,
    fontWeight: '700',
  },
  tipsSection: {
    marginBottom: '3rem',
  },
  tipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  tipCard: {
    backgroundColor: theme.colors.white,
    padding: '2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    textAlign: 'center',
    border: `1px solid ${theme.colors.borderLight}`,
    transition: 'all 0.2s ease',
  },
  tipIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  tipTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  tipText: {
    color: theme.colors.textSecondary,
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
};

export default Referrals;
