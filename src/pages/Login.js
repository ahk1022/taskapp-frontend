import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);

      // Redirect based on user role
      if (userData.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue earning</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.registerLink}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '0 1rem',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  error: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
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
  submitBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '1rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#7f8c8d',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
  },
};

export default Login;
