import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/Notification';
import { withdrawalAPI } from '../utils/api';

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
      warning(`Minimum withdrawal amount is ₨${minWithdrawal}. Please enter an amount of at least ₨${minWithdrawal} to proceed.`);
      return;
    }

    if (parseFloat(formData.amount) > user?.wallet?.balance) {
      error(`Insufficient balance! Your current balance is ₨${user?.wallet?.balance}. Please enter an amount within your available balance.`);
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
          phoneNumber: ['nayapay', 'zindigi'].includes(formData.method)
            ? formData.phoneNumber
            : undefined,
        },
      });

      success('Withdrawal request submitted successfully! Your request is pending approval. Funds will be transferred to your account within 24-48 hours after admin approval.');
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
      error(err.response?.data?.message || 'Failed to submit withdrawal request. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: { backgroundColor: '#f39c12', color: '#fff' },
      processing: { backgroundColor: '#3498db', color: '#fff' },
      completed: { backgroundColor: '#27ae60', color: '#fff' },
      rejected: { backgroundColor: '#e74c3c', color: '#fff' },
    };
    return styles[status] || {};
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Withdraw Money</h1>

      <div style={styles.grid}>
        <div style={styles.formCard}>
          <div style={styles.balanceInfo}>
            <h3>Available Balance</h3>
            <p style={styles.balance}>₨ {user?.wallet?.balance || 0}</p>
            <small style={styles.minWithdraw}>Minimum withdrawal: ₨300</small>
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
                    <strong style={{color: '#e74c3c'}}>- ₨ {Math.round(parseFloat(formData.amount) * 0.08)}</strong>
                  </div>
                  <div style={{...styles.taxRow, ...styles.netAmount}}>
                    <span>You will receive:</span>
                    <strong style={{color: '#27ae60'}}>₨ {parseFloat(formData.amount) - Math.round(parseFloat(formData.amount) * 0.08)}</strong>
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
                required
              />
            </div>

            {['nayapay', 'jazzcash', 'easypaisa', 'zindigi'].includes(formData.method) && (
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
            )}

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
              {loading ? 'Processing...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>

        <div style={styles.historyCard}>
          <h2>Withdrawal History</h2>

          {withdrawals.length === 0 ? (
            <p style={styles.emptyState}>No withdrawal requests yet</p>
          ) : (
            <div style={styles.historyList}>
              {withdrawals.map(withdrawal => (
                <div key={withdrawal._id} style={styles.historyItem}>
                  <div style={styles.historyHeader}>
                    <div>
                      <strong>₨ {withdrawal.amount}</strong>
                      <p style={styles.method}>{withdrawal.method.toUpperCase()}</p>
                      {withdrawal.taxAmount && (
                        <div style={styles.taxInfo}>
                          <small>Tax: ₨{withdrawal.taxAmount} | Net: ₨{withdrawal.netAmount}</small>
                        </div>
                      )}
                    </div>
                    <span style={{...styles.status, ...getStatusStyle(withdrawal.status)}}>
                      {withdrawal.status}
                    </span>
                  </div>

                  <div style={styles.historyDetails}>
                    <p><strong>Account:</strong> {withdrawal.accountDetails.accountName}</p>
                    {withdrawal.accountDetails.accountNumber && (
                      <p><strong>Number:</strong> {withdrawal.accountDetails.accountNumber}</p>
                    )}
                    {withdrawal.accountDetails.phoneNumber && (
                      <p><strong>Phone:</strong> {withdrawal.accountDetails.phoneNumber}</p>
                    )}
                    <p><strong>Requested:</strong> {new Date(withdrawal.createdAt).toLocaleDateString()}</p>
                    {withdrawal.remarks && (
                      <p style={styles.remarks}><strong>Remarks:</strong> {withdrawal.remarks}</p>
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
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  balanceInfo: {
    backgroundColor: '#ecf0f1',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  balance: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#27ae60',
    margin: '0.5rem 0',
  },
  minWithdraw: {
    color: '#7f8c8d',
  },
  taxBreakdown: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '6px',
    marginTop: '0.75rem',
    border: '1px solid #e9ecef',
  },
  taxRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4rem 0',
    fontSize: '0.95rem',
  },
  netAmount: {
    borderTop: '2px solid #27ae60',
    marginTop: '0.5rem',
    paddingTop: '0.75rem',
    fontSize: '1.05rem',
  },
  taxInfo: {
    color: '#7f8c8d',
    fontSize: '0.8rem',
    marginTop: '0.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontWeight: '500',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '1rem',
    borderRadius: '4px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  historyCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  emptyState: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '2rem',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  historyItem: {
    border: '1px solid #ecf0f1',
    borderRadius: '8px',
    padding: '1rem',
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  method: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
    margin: '0.25rem 0',
  },
  status: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  historyDetails: {
    lineHeight: '1.8',
    fontSize: '0.9rem',
    color: '#2c3e50',
  },
  remarks: {
    color: '#e74c3c',
    marginTop: '0.5rem',
  },
};

export default Withdraw;
