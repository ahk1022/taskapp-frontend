import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    referralCode: searchParams.get('ref') || '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Start earning money today!</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

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
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="03XX-XXXXXXX"
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Referral Code (Optional)</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter referral code if you have one"
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.loginLink}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
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
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '1rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#7f8c8d',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
  },
};

export default Register;
