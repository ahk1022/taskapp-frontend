import React, { useEffect, useState } from 'react';
import { useNotification } from '../../components/Notification';
import { adminAPI } from '../../utils/adminApi';

const PackageApprovals = () => {
  const { success, error, confirm } = useNotification();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingPackages();
  }, []);

  const loadPendingPackages = async () => {
    try {
      const response = await adminAPI.getPendingPackages();
      setPending(response.data);
    } catch (error) {
      console.error('Failed to load pending packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, packageId) => {
    const confirmed = await confirm(
      'Are you sure you want to approve and activate this package purchase? The user will be able to start completing tasks immediately.',
      {
        title: 'Approve Package',
        confirmText: 'Approve & Activate',
        cancelText: 'Cancel',
        type: 'success'
      }
    );

    if (!confirmed) return;

    try {
      await adminAPI.approvePackage(userId, packageId);
      success('Package activated successfully! User can now start completing tasks and earning rewards.');
      loadPendingPackages();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to approve package. Please try again or check the system logs.');
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading pending packages...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Package Approvals</h1>

      {pending.length === 0 ? (
        <div style={styles.empty}>No pending package approvals</div>
      ) : (
        <div style={styles.grid}>
          {pending.map(transaction => (
            <div key={transaction._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3>{transaction.relatedPackage?.name}</h3>
                <span style={styles.amount}>₨{Math.abs(transaction.amount)}</span>
              </div>

              <div style={styles.userInfo}>
                <p><strong>User:</strong> {transaction.user?.username}</p>
                <p><strong>Email:</strong> {transaction.user?.email}</p>
                <p><strong>Phone:</strong> {transaction.user?.phone}</p>
              </div>

              <div style={styles.packageInfo}>
                <p><strong>Tasks/Day:</strong> {transaction.relatedPackage?.tasksPerDay}</p>
                <p><strong>Reward/Task:</strong> ₨{transaction.relatedPackage?.rewardPerTask}</p>
                <p><strong>Duration:</strong> {transaction.relatedPackage?.totalDays} days</p>
                <p><strong>Total Earnings:</strong> ₨{transaction.relatedPackage?.totalEarnings}</p>
              </div>

              <div style={styles.meta}>
                <p><small>Requested: {new Date(transaction.createdAt).toLocaleString()}</small></p>
                <p><small>{transaction.description}</small></p>
              </div>

              <div style={styles.proofSection}>
                <h4 style={styles.proofTitle}>Payment Proof</h4>
                {transaction.paymentProof && (
                  <div style={styles.imageProof}>
                    <p style={styles.proofLabel}>Screenshot:</p>
                    <img
                      src={transaction.paymentProof}
                      alt="Payment proof"
                      style={styles.proofImage}
                      onClick={() => window.open(transaction.paymentProof, '_blank')}
                    />
                  </div>
                )}
                {transaction.transactionId && (
                  <div style={styles.transactionIdProof}>
                    <p style={styles.proofLabel}>Transaction ID:</p>
                    <p style={styles.transactionIdText}>{transaction.transactionId}</p>
                  </div>
                )}
                {!transaction.paymentProof && !transaction.transactionId && (
                  <p style={styles.noProof}>No payment proof submitted</p>
                )}
              </div>

              <button
                onClick={() => handleApprove(transaction.user._id, transaction.relatedPackage._id)}
                style={styles.approveBtn}
              >
                Activate Package
              </button>
            </div>
          ))}
        </div>
      )}
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
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '2px solid #f39c12',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #ecf0f1',
  },
  amount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  userInfo: {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #ecf0f1',
    lineHeight: '1.8',
  },
  packageInfo: {
    backgroundColor: '#ecf0f1',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    lineHeight: '1.8',
  },
  meta: {
    marginBottom: '1rem',
    color: '#7f8c8d',
  },
  approveBtn: {
    width: '100%',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '1rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  proofSection: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #dee2e6',
  },
  proofTitle: {
    marginTop: 0,
    marginBottom: '0.75rem',
    color: '#2c3e50',
    fontSize: '1rem',
  },
  imageProof: {
    marginBottom: '0.75rem',
  },
  proofLabel: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#495057',
    fontSize: '0.9rem',
  },
  proofImage: {
    maxWidth: '100%',
    maxHeight: '250px',
    borderRadius: '4px',
    border: '2px solid #dee2e6',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  transactionIdProof: {
    marginTop: '0.75rem',
  },
  transactionIdText: {
    backgroundColor: '#fff',
    padding: '0.75rem',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.95rem',
    border: '1px solid #dee2e6',
    wordBreak: 'break-all',
  },
  noProof: {
    color: '#dc3545',
    fontStyle: 'italic',
    margin: 0,
  },
};

export default PackageApprovals;
