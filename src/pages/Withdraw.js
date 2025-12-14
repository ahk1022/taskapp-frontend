import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/Notification';
import { withdrawalAPI } from '../utils/api';
import theme from '../theme';

const Withdraw = () => {
  const { user } = useAuth();
  const { success, error, warning } = useNotification();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      const response = await withdrawalAPI.getAll();
      setWithdrawals(response.data);
    } catch (error) {
      console.error('Failed to load withdrawals:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const minWithdrawal = 300;
    if (parseFloat(formData.amount) < minWithdrawal) {
      warning(`Minimum withdrawal is ₨${minWithdrawal}`);
      return;
    }

    if (parseFloat(formData.amount) > user?.wallet?.balance) {
      error(`Insufficient balance! Your balance is ₨${user?.wallet?.balance}`);
      return;
    }

    setLoading(true);

    try {
      await withdrawalAPI.request({
        amount: parseFloat(formData.amount),
        method: formData.method,
        accountDetails: {
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          bankName: formData.method === 'bank' ? formData.bankName : undefined,
          phoneNumber: formData.phoneNumber,
        },
      });

      success('Withdrawal request submitted! Funds will be transferred within 24-48 hours.');
      setFormData({
        amount: '',
        method: '',
        accountName: '',
        accountNumber: '',
        bankName: '',
        phoneNumber: '',
      });

      loadWithdrawals();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit withdrawal request.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const statusStyles = {
      pending: { backgroundColor: theme.colors.warningBg, color: theme.colors.warning },
      processing: { backgroundColor: theme.colors.primaryBg, color: theme.colors.primary },
      completed: { backgroundColor: theme.colors.successBg, color: theme.colors.successDark },
      rejected: { backgroundColor: theme.colors.dangerBg, color: theme.colors.danger },
    };
    return statusStyles[status] || {};
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Withdraw Money</h1>
        <p style={styles.subtitle}>Transfer your earnings to your bank or wallet</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.formCard}>
          <div style={styles.balanceCard}>
            <div style={styles.balanceIcon}>💰</div>
            <div style={styles.balanceInfo}>
              <span style={styles.balanceLabel}>Available Balance</span>
              <span style={styles.balanceAmount}>₨ {user?.wallet?.balance || 0}</span>
            </div>
            <div style={styles.minBadge}>Min: ₨300</div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Amount (PKR)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter amount"
                required
                min="300"
                step="1"
              />
              {formData.amount && parseFloat(formData.amount) >= 300 && (
                <div style={styles.taxBreakdown}>
                  <div style={styles.taxRow}>
                    <span>Requested Amount:</span>
                    <strong>₨ {parseFloat(formData.amount).toFixed(0)}</strong>
                  </div>
                  <div style={styles.taxRow}>
                    <span>Tax (8%):</span>
                    <strong style={{color: theme.colors.danger}}>- ₨ {Math.round(parseFloat(formData.amount) * 0.08)}</strong>
                  </div>
                  <div style={{...styles.taxRow, ...styles.netRow}}>
                    <span>You will receive:</span>
                    <strong style={{color: theme.colors.success}}>₨ {parseFloat(formData.amount) - Math.round(parseFloat(formData.amount) * 0.08)}</strong>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Withdrawal Method</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select method</option>
                <option value="nayapay">NayaPay</option>
                <option value="jazzcash">JazzCash</option>
                <option value="easypaisa">Easypaisa</option>
                <option value="raast">Raast ID</option>
                <option value="zindigi">Zindigi App</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Account Name</label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Your full name"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={styles.input}
                placeholder="03XX-XXXXXXX"
                required
              />
            </div>

            {formData.method === 'raast' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Raast ID / Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            )}

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span style={styles.loadingText}>
                  <span style={styles.spinner}></span>
                  Processing...
                </span>
              ) : (
                <>
                  Submit Request
                  <span style={styles.btnArrow}>→</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div style={styles.historyCard}>
          <div style={styles.historyHeader}>
            <h2 style={styles.historyTitle}>Withdrawal History</h2>
          </div>

          {withdrawals.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <p style={styles.emptyText}>No withdrawal requests yet</p>
            </div>
          ) : (
            <div style={styles.historyList}>
              {withdrawals.map(withdrawal => (
                <div key={withdrawal._id} style={styles.historyItem}>
                  <div style={styles.historyItemHeader}>
                    <div>
                      <span style={styles.historyAmount}>₨ {withdrawal.amount}</span>
                      <span style={styles.historyMethod}>{withdrawal.method.toUpperCase()}</span>
                      {withdrawal.taxAmount && (
                        <div style={styles.taxNote}>
                          Tax: ₨{withdrawal.taxAmount} | Net: ₨{withdrawal.netAmount}
                        </div>
                      )}
                    </div>
                    <span style={{...styles.statusBadge, ...getStatusStyle(withdrawal.status)}}>
                      {withdrawal.status}
                    </span>
                  </div>

                  <div style={styles.historyDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Account:</span>
                      <span>{withdrawal.accountDetails.accountName}</span>
                    </div>
                    {withdrawal.accountDetails.phoneNumber && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Phone:</span>
                        <span>{withdrawal.accountDetails.phoneNumber}</span>
                      </div>
                    )}
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Date:</span>
                      <span>{new Date(withdrawal.createdAt).toLocaleDateString()}</span>
                    </div>
                    {withdrawal.remarks && (
                      <div style={styles.remarksBox}>
                        <span style={styles.remarksLabel}>Remarks:</span> {withdrawal.remarks}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  formCard: {
    backgroundColor: theme.colors.white,
    padding: '2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    height: 'fit-content',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  balanceCard: {
    background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`,
    borderRadius: theme.radius.lg,
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    color: theme.colors.white,
    flexWrap: 'wrap',
  },
  balanceIcon: {
    fontSize: '2rem',
  },
  balanceInfo: {
    flex: 1,
    minWidth: '150px',
  },
  balanceLabel: {
    display: 'block',
    fontSize: '0.85rem',
    opacity: 0.9,
    marginBottom: '0.25rem',
  },
  balanceAmount: {
    fontSize: '2rem',
    fontWeight: '800',
  },
  minBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.5rem 1rem',
    borderRadius: theme.radius.full,
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    color: theme.colors.primaryDark,
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.875rem 1rem',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: theme.colors.background,
  },
  select: {
    padding: '0.875rem 1rem',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    backgroundColor: theme.colors.background,
    cursor: 'pointer',
  },
  taxBreakdown: {
    backgroundColor: theme.colors.background,
    padding: '1rem',
    borderRadius: theme.radius.md,
    marginTop: '0.75rem',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  taxRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.375rem 0',
    fontSize: '0.95rem',
    color: theme.colors.textSecondary,
  },
  netRow: {
    borderTop: `2px solid ${theme.colors.success}`,
    marginTop: '0.5rem',
    paddingTop: '0.75rem',
    fontWeight: '600',
  },
  submitBtn: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    border: 'none',
    padding: '1rem',
    borderRadius: theme.radius.md,
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: theme.shadows.success,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
  },
  btnArrow: {
    fontSize: '1.1rem',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: theme.colors.white,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  historyCard: {
    backgroundColor: theme.colors.white,
    padding: '2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.borderLight}`,
  },
  historyHeader: {
    marginBottom: '1.5rem',
  },
  historyTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 2rem',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  historyItem: {
    border: `1px solid ${theme.colors.borderLight}`,
    borderRadius: theme.radius.lg,
    padding: '1.25rem',
    transition: 'all 0.2s ease',
  },
  historyItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '1rem',
  },
  historyAmount: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    display: 'block',
  },
  historyMethod: {
    color: theme.colors.textSecondary,
    fontSize: '0.85rem',
    marginTop: '0.25rem',
    display: 'block',
  },
  taxNote: {
    color: theme.colors.textMuted,
    fontSize: '0.8rem',
    marginTop: '0.25rem',
  },
  statusBadge: {
    padding: '0.375rem 0.875rem',
    borderRadius: theme.radius.full,
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  historyDetails: {
    fontSize: '0.9rem',
    color: theme.colors.textSecondary,
  },
  detailRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.375rem',
  },
  detailLabel: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  remarksBox: {
    backgroundColor: theme.colors.dangerBg,
    color: theme.colors.danger,
    padding: '0.75rem',
    borderRadius: theme.radius.md,
    marginTop: '0.75rem',
    fontSize: '0.85rem',
  },
  remarksLabel: {
    fontWeight: '600',
  },
};

export default Withdraw;
