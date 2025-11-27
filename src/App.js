import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './components/Notification';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Packages from './pages/Packages';
import Payment from './pages/Payment';
import Withdraw from './pages/Withdraw';
import Referrals from './pages/Referrals';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TaskManagement from './pages/admin/TaskManagement';
import WithdrawalManagement from './pages/admin/WithdrawalManagement';
import PackageApprovals from './pages/admin/PackageApprovals';
import UserManagement from './pages/admin/UserManagement';
import Transactions from './pages/admin/Transactions';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={styles.app}>
      {!isAdminRoute && <Navbar />}
      <main style={styles.main}>
        <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <Tasks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/packages"
                element={
                  <PrivateRoute>
                    <Packages />
                  </PrivateRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <PrivateRoute>
                    <Payment />
                  </PrivateRoute>
                }
              />
              <Route
                path="/withdraw"
                element={
                  <PrivateRoute>
                    <Withdraw />
                  </PrivateRoute>
                }
              />
              <Route
                path="/referrals"
                element={
                  <PrivateRoute>
                    <Referrals />
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/tasks"
                element={
                  <AdminRoute>
                    <TaskManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/withdrawals"
                element={
                  <AdminRoute>
                    <WithdrawalManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/packages"
                element={
                  <AdminRoute>
                    <PackageApprovals />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/transactions"
                element={
                  <AdminRoute>
                    <Transactions />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <footer style={styles.footer}>
            <p>&copy; 2025 MN Works. All rights reserved.</p>
          </footer>
        </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f6fa',
  },
  main: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    textAlign: 'center',
    padding: '1.5rem 0',
    marginTop: '3rem',
  },
};

export default App;
