import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNav from './AdminNav';

const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
};

export default AdminRoute;
