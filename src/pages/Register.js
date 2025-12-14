import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

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
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>MN</div>
        </div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Start earning money today!</p>

        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.inputWrapper}>
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
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
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

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Referral Code
              <span style={styles.optional}> (Optional)</span>
            </label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter referral code if you have one"
              />
            </div>
            {formData.referralCode && (
              <span style={styles.referralHint}>
                You'll get bonus rewards when you sign up with a referral code!
              </span>
            )}
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.loadingText}>
                <span style={styles.spinner}></span>
                Creating Account...
              </span>
            ) : (
              <>
                Create Account
                <span style={styles.btnIcon}>→</span>
              </>
            )}
          </button>
        </form>

        <p style={styles.loginLink}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login here</Link>
        </p>

        <p style={styles.terms}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
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
    maxWidth: '520px',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  logoIcon: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    padding: '1rem 1.5rem',
    borderRadius: theme.radius.lg,
    fontWeight: '800',
    fontSize: '1.5rem',
    boxShadow: theme.shadows.success,
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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
  optional: {
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: theme.colors.background,
  },
  referralHint: {
    color: theme.colors.success,
    fontSize: '0.8rem',
    marginTop: '0.5rem',
    display: 'block',
  },
  submitBtn: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    padding: '1rem',
    border: 'none',
    borderRadius: theme.radius.md,
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: theme.shadows.success,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  btnIcon: {
    fontSize: '1.2rem',
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
  loginLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: theme.colors.textSecondary,
    fontSize: '0.95rem',
  },
  link: {
    color: theme.colors.primary,
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
  terms: {
    textAlign: 'center',
    marginTop: '1rem',
    color: theme.colors.textMuted,
    fontSize: '0.8rem',
  },
};

// Add responsive styles
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

    @media (max-width: 500px) {
      .row {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  if (!document.getElementById('register-styles')) {
    styleSheet.id = 'register-styles';
    document.head.appendChild(styleSheet);
  }
}

export default Register;
