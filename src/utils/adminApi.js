import api from './api';

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),

  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (userId) => api.put('/admin/users/toggle-status', { userId }),

  // Withdrawals
  getAllWithdrawals: (params) => api.get('/admin/withdrawals', { params }),
  updateWithdrawal: (withdrawalId, status, remarks) =>
    api.put('/admin/withdrawals/update', { withdrawalId, status, remarks }),

  // Package Purchases
  getPendingPackages: () => api.get('/admin/packages/pending'),
  approvePackage: (userId, packageId) =>
    api.put('/admin/packages/approve', { userId, packageId }),

  // Transactions
  getAllTransactions: (params) => api.get('/admin/transactions', { params }),

  // Tasks
  getAllTasks: () => api.get('/admin/tasks'),
  createTask: (taskData) => api.post('/admin/tasks', taskData),
  updateTask: (taskId, taskData) => api.put(`/admin/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/admin/tasks/${taskId}`),
  toggleTaskStatus: (taskId) => api.put(`/admin/tasks/${taskId}/toggle`),
  importTasks: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/tasks/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default adminAPI;
