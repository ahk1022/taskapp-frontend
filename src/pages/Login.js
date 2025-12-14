import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

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
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>MN</div>
        </div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue earning</p>

        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>@</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>*</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.loadingText}>
                <span style={styles.spinner}></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>New here?</span>
        </div>

        <p style={styles.registerLink}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: `linear-gradient(135deg, ${theme.colors.primaryBg} 0%, ${theme.colors.successBg} 100%)`,
  },
  formCard: {
    backgroundColor: theme.colors.white,
    padding: '2.5rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.lg,
    width: '100%',
    maxWidth: '420px',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  logoIcon: {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    padding: '1rem 1.5rem',
    borderRadius: theme.radius.lg,
    fontWeight: '800',
    fontSize: '1.5rem',
    boxShadow: theme.shadows.button,
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1rem',
  },
  error: {
    backgroundColor: theme.colors.dangerBg,
    color: theme.colors.danger,
    padding: '0.875rem 1rem',
    borderRadius: theme.radius.md,
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    border: `1px solid ${theme.colors.danger}`,
    fontSize: '0.9rem',
  },
  errorIcon: {
    backgroundColor: theme.colors.danger,
    color: theme.colors.white,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    flexShrink: 0,
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
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: theme.colors.textMuted,
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 2.75rem',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: theme.colors.background,
  },
  submitBtn: {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    padding: '1rem',
    border: 'none',
    borderRadius: theme.radius.md,
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: theme.shadows.button,
    transition: 'all 0.2s ease',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
  },
  dividerText: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: '0.9rem',
    position: 'relative',
  },
  registerLink: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: '0.95rem',
  },
  link: {
    color: theme.colors.primary,
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
};

// Add keyframe animation for spinner
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    input:focus {
      border-color: ${theme.colors.primary} !important;
      background-color: ${theme.colors.white} !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
    }
  `;
  if (!document.getElementById('login-styles')) {
    styleSheet.id = 'login-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Login;
