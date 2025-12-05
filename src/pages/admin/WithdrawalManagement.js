import React, { useEffect, useState } from 'react';
import { useNotification } from '../../components/Notification';
import { adminAPI } from '../../utils/adminApi';

const WithdrawalManagement = () => {
  const { success, error, confirm } = useNotification();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadWithdrawals();
  }, [filter]);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllWithdrawals({ status: filter });
      setWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.error('Failed to load withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (withdrawalId, status) => {
    const statusConfig = {
      processing: {
        title: 'Mark as Processing',
        message: 'Mark this withdrawal request as processing? User will be notified that their withdrawal is being processed.',
        type: 'info',
        confirmText: 'Mark Processing'
      },
      completed: {
        title: 'Complete Withdrawal',
        message: 'Mark this withdrawal as completed? Confirm that the payment has been sent to the user.',
        type: 'success',
        confirmText: 'Complete'
      },
      rejected: {
        title: 'Reject Withdrawal',
        message: 'Are you sure you want to reject this withdrawal request? The amount will be refunded to user wallet.',
        type: 'danger',
        confirmText: 'Reject'
      }
    };

    const config = statusConfig[status] || {
      title: 'Update Status',
      message: `Are you sure you want to ${status} this withdrawal request?`,
      type: 'warning',
      confirmText: 'Confirm'
    };

    const confirmed = await confirm(config.message, {
      title: config.title,
      confirmText: config.confirmText,
      cancelText: 'Cancel',
      type: config.type
    });

    if (!confirmed) return;

    setProcessing(true);
    try {
      await adminAPI.updateWithdrawal(withdrawalId, status, remarks);
      success(`Withdrawal ${status} successfully! User has been notified about the status update.`);
      setSelectedWithdrawal(null);
      setRemarks('');
      loadWithdrawals();
    } catch (err) {
      error(err.response?.data?.message || `Failed to update withdrawal status. Please try again.`);
    } finally {
      setProcessing(false);
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

  const getMethodStyle = (method) => {
    const methodStyles = {
      jazzcash: { backgroundColor: '#e74c3c', color: '#fff' },
      easypaisa: { backgroundColor: '#27ae60', color: '#fff' },
      nayapay: { backgroundColor: '#9b59b6', color: '#fff' },
      raast: { backgroundColor: '#2c3e50', color: '#fff' },
      zindigi: { backgroundColor: '#e67e22', color: '#fff' },
    };
    return methodStyles[method] || { backgroundColor: '#7f8c8d', color: '#fff' };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Withdrawal Management</h1>

      <div style={styles.filterBar}>
        <button
          onClick={() => setFilter('pending')}
          style={{...styles.filterBtn, ...(filter === 'pending' ? styles.activeFilter : {})}}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('processing')}
          style={{...styles.filterBtn, ...(filter === 'processing' ? styles.activeFilter : {})}}
        >
          Processing
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{...styles.filterBtn, ...(filter === 'completed' ? styles.activeFilter : {})}}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('rejected')}
          style={{...styles.filterBtn, ...(filter === 'rejected' ? styles.activeFilter : {})}}
        >
          Rejected
        </button>
        <button
          onClick={() => setFilter('')}
          style={{...styles.filterBtn, ...(filter === '' ? styles.activeFilter : {})}}
        >
          All
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading withdrawals...</div>
      ) : withdrawals.length === 0 ? (
        <div style={styles.empty}>No withdrawals found</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Requested</th>
                <th style={styles.th}>Tax (8%)</th>
                <th style={styles.th}>Amount to Pay</th>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Account Details</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map(withdrawal => (
                <tr key={withdrawal._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div>
                      <strong>{withdrawal.user?.username}</strong>
                      <br />
                      <small>{withdrawal.user?.email}</small>
                      <br />
                      <small style={{color: '#3498db', fontWeight: 'bold'}}>{withdrawal.user?.phone}</small>
                      <br />
                      <small>Balance: ₨{withdrawal.user?.wallet?.balance}</small>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <strong>₨ {withdrawal.amount}</strong>
                  </td>
                  <td style={styles.td}>
                    {withdrawal.taxAmount ? (
                      <span style={{color: '#e74c3c'}}>₨ {withdrawal.taxAmount}</span>
                    ) : (
                      <span>₨ 0</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.amountToPay}>
                      <strong style={{fontSize: '1.1rem', color: '#27ae60'}}>
                        ₨ {withdrawal.netAmount || withdrawal.amount}
                      </strong>
                      <div style={styles.paymentNote}>Transfer this amount</div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.methodBadge, ...getMethodStyle(withdrawal.method)}}>
                      {withdrawal.method.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.accountDetails}>
                      <div><strong>Name:</strong> {withdrawal.accountDetails.accountName}</div>
                      {withdrawal.accountDetails.accountNumber && (
                        <div><strong>Account:</strong> {withdrawal.accountDetails.accountNumber}</div>
                      )}
                      {withdrawal.accountDetails.phoneNumber && (
                        <div><strong>Phone:</strong> {withdrawal.accountDetails.phoneNumber}</div>
                      )}
                      {withdrawal.accountDetails.bankName && (
                        <div><strong>Bank:</strong> {withdrawal.accountDetails.bankName}</div>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.status, ...getStatusStyle(withdrawal.status)}}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                    <br />
                    <small>{new Date(withdrawal.createdAt).toLocaleTimeString()}</small>
                  </td>
                  <td style={styles.td}>
                    {withdrawal.status === 'pending' && (
                      <>
                        {withdrawal.taxAmount && (
                          <div style={styles.paymentSummary}>
                            <div style={styles.summaryTitle}>Payment Breakdown:</div>
                            <div style={styles.summaryRow}>
                              <span>Requested:</span>
                              <span>₨{withdrawal.amount}</span>
                            </div>
                            <div style={styles.summaryRow}>
                              <span>Tax (8%):</span>
                              <span style={{color: '#e74c3c'}}>-₨{withdrawal.taxAmount}</span>
                            </div>
                            <div style={styles.summaryTotal}>
                              <span>Pay to User:</span>
                              <strong style={{color: '#27ae60'}}>₨{withdrawal.netAmount}</strong>
                            </div>
                          </div>
                        )}
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => handleUpdateStatus(withdrawal._id, 'processing')}
                            style={styles.processingBtn}
                            disabled={processing}
                          >
                            Mark Processing
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(withdrawal._id, 'completed')}
                            style={styles.approveBtn}
                            disabled={processing}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                            }}
                            style={styles.rejectBtn}
                            disabled={processing}
                          >
                            Reject
                          </button>
                        </div>
                      </>
                    )}
                    {withdrawal.status === 'processing' && (
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleUpdateStatus(withdrawal._id, 'completed')}
                          style={styles.approveBtn}
                          disabled={processing}
                        >
                          Complete
                        </button>
                      </div>
                    )}
                    {withdrawal.remarks && (
                      <div style={styles.remarks}>
                        <strong>Remarks:</strong> {withdrawal.remarks}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedWithdrawal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Reject Withdrawal</h3>
            <p>User: {selectedWithdrawal.user?.username}</p>
            <p>Requested Amount: ₨{selectedWithdrawal.amount}</p>
            {selectedWithdrawal.taxAmount && (
              <div style={styles.modalTaxInfo}>
                <p>Tax ({selectedWithdrawal.taxPercentage}%): ₨{selectedWithdrawal.taxAmount}</p>
                <p>Net Amount: ₨{selectedWithdrawal.netAmount}</p>
                <small style={{color: '#7f8c8d'}}>Note: Full amount will be refunded to user wallet</small>
              </div>
            )}
            <textarea
              placeholder="Enter reason for rejection..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={styles.textarea}
            />
            <div style={styles.modalButtons}>
              <button
                onClick={() => {
                  handleUpdateStatus(selectedWithdrawal._id, 'rejected');
                }}
                style={styles.confirmBtn}
                disabled={processing}
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setSelectedWithdrawal(null);
                  setRemarks('');
                }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
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
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '0.75rem 1.5rem',
    border: '2px solid #ecf0f1',
    backgroundColor: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeFilter: {
    backgroundColor: '#3498db',
    color: '#fff',
    borderColor: '#3498db',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
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
    verticalAlign: 'top',
  },
  accountDetails: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  taxBreakdown: {
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#7f8c8d',
    lineHeight: '1.5',
  },
  amountToPay: {
    backgroundColor: '#d5f4e6',
    padding: '0.75rem',
    borderRadius: '6px',
    textAlign: 'center',
    border: '2px solid #27ae60',
  },
  paymentNote: {
    fontSize: '0.75rem',
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: '0.25rem',
    textTransform: 'uppercase',
  },
  paymentSummary: {
    backgroundColor: '#fff3cd',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    border: '1px solid #ffc107',
    fontSize: '0.85rem',
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#856404',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.25rem 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '2px solid #27ae60',
    fontSize: '0.95rem',
  },
  modalTaxInfo: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '6px',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  status: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  methodBadge: {
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  processingBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  approveBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  rejectBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  remarks: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#fff3cd',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    marginTop: '1rem',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#7f8c8d',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default WithdrawalManagement;
