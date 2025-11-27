import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

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
    return <div style={styles.loading}>Loading referrals...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Referral Program</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Referrals</h3>
          <p style={styles.statValue}>{user?.referralCount || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Referral Earnings</h3>
          <p style={styles.statValue}>₨ {user?.wallet?.referralEarnings || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Earnings Per Referral</h3>
          <p style={styles.statValue}>₨ 10</p>
        </div>
      </div>

      <div style={styles.referralSection}>
        <h2 style={styles.sectionTitle}>Your Referral Code</h2>
        <div style={styles.codeCard}>
          <div style={styles.codeDisplay}>
            <code style={styles.code}>{user?.referralCode}</code>
            <button onClick={copyReferralLink} style={styles.copyBtn}>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <div style={styles.shareSection}>
            <p style={styles.shareText}>Share your referral link:</p>
            <div style={styles.shareButtons}>
              <button onClick={shareViaWhatsApp} style={styles.whatsappBtn}>
                Share on WhatsApp
              </button>
              <button onClick={copyReferralLink} style={styles.shareBtn}>
                Copy Link
              </button>
            </div>
          </div>

          <div style={styles.infoBox}>
            <h4>How it works:</h4>
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
            <p>You haven't referred anyone yet</p>
            <p style={styles.emptySubtext}>Start sharing your referral code to earn ₨10 per referral!</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Joined Date</th>
                  <th style={styles.th}>Tasks Done</th>
                  <th style={styles.th}>Their Earnings</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <tr key={referral._id} style={styles.tr}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{referral.username}</td>
                    <td style={styles.td}>{referral.email}</td>
                    <td style={styles.td}>
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{referral.tasksCompleted}</td>
                    <td style={styles.td}>₨ {referral.wallet?.earnings || 0}</td>
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
            <h3>📱 Share on Social Media</h3>
            <p>Post your referral link on Facebook, WhatsApp groups, Instagram</p>
          </div>
          <div style={styles.tipCard}>
            <h3>👥 Tell Friends & Family</h3>
            <p>Personal recommendations work best - tell people you know</p>
          </div>
          <div style={styles.tipCard}>
            <h3>💬 Join Communities</h3>
            <p>Share in online forums and communities interested in earning money</p>
          </div>
          <div style={styles.tipCard}>
            <h3>📧 Email Contacts</h3>
            <p>Send personalized emails to your contacts explaining the benefits</p>
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
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#27ae60',
    margin: '1rem 0',
  },
  referralSection: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  codeCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
    padding: '1rem',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  copyBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  shareSection: {
    marginBottom: '2rem',
  },
  shareText: {
    marginBottom: '1rem',
    color: '#2c3e50',
  },
  shareButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  shareBtn: {
    backgroundColor: '#7f8c8d',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #27ae60',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  infoList: {
    marginTop: '0.5rem',
    paddingLeft: '1.5rem',
    lineHeight: '1.8',
  },
  referralListSection: {
    marginBottom: '3rem',
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#7f8c8d',
    marginTop: '0.5rem',
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
  tipsSection: {
    marginBottom: '3rem',
  },
  tipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
};

export default Referrals;
