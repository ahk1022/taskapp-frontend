import React, { useEffect, useState } from 'react';
import { useNotification } from '../../components/Notification';
import { adminAPI } from '../../utils/adminApi';

const UserManagement = () => {
  const { success, error } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers({ page, search });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      success('User status updated successfully! The user account has been activated/deactivated.');
      loadUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to toggle user status. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Management</h1>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={styles.searchInput}
        />
      </div>

      {loading ? (
        <div style={styles.loading}>Loading users...</div>
      ) : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Package</th>
                  <th style={styles.th}>Wallet</th>
                  <th style={styles.th}>Stats</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div>
                        <strong>{user.username}</strong>
                        <br />
                        <small>{user.email}</small>
                        <br />
                        <small>{user.phone}</small>
                        <br />
                        <small style={styles.referralCode}>Ref: {user.referralCode}</small>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {user.currentPackage ? (
                        <div>
                          <strong>{user.currentPackage.name}</strong>
                          <br />
                          <small>Since: {new Date(user.packagePurchaseDate).toLocaleDateString()}</small>
                        </div>
                      ) : (
                        <span style={styles.noPackage}>No package</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.walletInfo}>
                        <div>Balance: ₨{user.wallet.balance}</div>
                        <div>Earnings: ₨{user.wallet.earnings}</div>
                        <div>Referral: ₨{user.wallet.referralEarnings}</div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.stats}>
                        <div>Tasks: {user.tasksCompleted}</div>
                        <div>Referrals: {user.referralCount}</div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: user.isActive ? '#27ae60' : '#e74c3c'
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        style={{
                          ...styles.actionBtn,
                          backgroundColor: user.isActive ? '#e74c3c' : '#27ae60'
                        }}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={styles.pageBtn}
            >
              Previous
            </button>
            <span style={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
              style={styles.pageBtn}
            >
              Next
            </button>
          </div>
        </>
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
  searchBar: {
    marginBottom: '2rem',
  },
  searchInput: {
    width: '100%',
    maxWidth: '400px',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
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
  referralCode: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  noPackage: {
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  walletInfo: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  stats: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  actionBtn: {
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  pageBtn: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pageInfo: {
    fontSize: '1rem',
    color: '#2c3e50',
  },
};

export default UserManagement;
