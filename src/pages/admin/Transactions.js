import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/adminApi';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllTransactions({ type: filter });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyle = (type) => {
    const styles = {
      task_reward: { backgroundColor: '#27ae60', color: '#fff' },
      referral_bonus: { backgroundColor: '#3498db', color: '#fff' },
      package_purchase: { backgroundColor: '#e67e22', color: '#fff' },
      withdrawal: { backgroundColor: '#e74c3c', color: '#fff' },
    };
    return styles[type] || {};
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: { backgroundColor: '#f39c12', color: '#fff' },
      completed: { backgroundColor: '#27ae60', color: '#fff' },
      failed: { backgroundColor: '#e74c3c', color: '#fff' },
      cancelled: { backgroundColor: '#7f8c8d', color: '#fff' },
    };
    return styles[status] || {};
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>All Transactions</h1>

      <div style={styles.filterBar}>
        <button
          onClick={() => setFilter('')}
          style={{...styles.filterBtn, ...(filter === '' ? styles.activeFilter : {})}}
        >
          All
        </button>
        <button
          onClick={() => setFilter('task_reward')}
          style={{...styles.filterBtn, ...(filter === 'task_reward' ? styles.activeFilter : {})}}
        >
          Task Rewards
        </button>
        <button
          onClick={() => setFilter('referral_bonus')}
          style={{...styles.filterBtn, ...(filter === 'referral_bonus' ? styles.activeFilter : {})}}
        >
          Referrals
        </button>
        <button
          onClick={() => setFilter('package_purchase')}
          style={{...styles.filterBtn, ...(filter === 'package_purchase' ? styles.activeFilter : {})}}
        >
          Packages
        </button>
        <button
          onClick={() => setFilter('withdrawal')}
          style={{...styles.filterBtn, ...(filter === 'withdrawal' ? styles.activeFilter : {})}}
        >
          Withdrawals
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading transactions...</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction._id} style={styles.tr}>
                  <td style={styles.td}>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                    <br />
                    <small>{new Date(transaction.createdAt).toLocaleTimeString()}</small>
                  </td>
                  <td style={styles.td}>
                    <div>
                      <strong>{transaction.user?.username}</strong>
                      <br />
                      <small>{transaction.user?.email}</small>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getTypeStyle(transaction.type)}}>
                      {transaction.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <strong style={{
                      color: transaction.amount >= 0 ? '#27ae60' : '#e74c3c'
                    }}>
                      {transaction.amount >= 0 ? '+' : ''}₨{transaction.amount}
                    </strong>
                  </td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...getStatusStyle(transaction.status)}}>
                      {transaction.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {transaction.description}
                    {transaction.relatedPackage && (
                      <div><small>Package: {transaction.relatedPackage.name}</small></div>
                    )}
                    {transaction.relatedTask && (
                      <div><small>Task: {transaction.relatedTask.title}</small></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
};

export default Transactions;
