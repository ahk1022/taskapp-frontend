import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageAPI } from '../utils/api';
import theme from '../theme';

const Packages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await packageAPI.getAll();
      setPackages(response.data);
    } catch (error) {
      console.error('Failed to load packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg) => {
    navigate('/payment', { state: { package: pkg } });
  };

  const packageIcons = ['🥉', '🥈', '🥇', '💎'];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading packages...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.badge}>Investment Plans</span>
        <h1 style={styles.title}>Choose Your Package</h1>
        <p style={styles.subtitle}>
          Select the package that fits your investment goals and start earning today!
        </p>
      </div>

      <div style={styles.packageGrid}>
        {packages.map((pkg, index) => (
          <div key={pkg._id} style={{
            ...styles.packageCard,
            ...(index === 2 ? styles.featured : {})
          }}>
            {index === 2 && <div style={styles.popularBadge}>Most Popular</div>}

            <div style={styles.packageIcon}>{packageIcons[index] || '📦'}</div>
            <h2 style={styles.packageName}>{pkg.name}</h2>

            <div style={styles.price}>
              <span style={styles.currency}>₨</span>
              <span style={styles.amount}>{pkg.price.toLocaleString()}</span>
            </div>

            <p style={styles.description}>{pkg.description}</p>

            <div style={styles.features}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>📋</span>
                <span style={styles.featureLabel}>Tasks per day</span>
                <strong style={styles.featureValue}>{pkg.tasksPerDay}</strong>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>💰</span>
                <span style={styles.featureLabel}>Reward per task</span>
                <strong style={styles.featureValue}>₨ {pkg.rewardPerTask}</strong>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>📅</span>
                <span style={styles.featureLabel}>Duration</span>
                <strong style={styles.featureValue}>{pkg.totalDays} days</strong>
              </div>
              <div style={{...styles.featureItem, ...styles.totalRow}}>
                <span style={styles.featureIcon}>📈</span>
                <span style={styles.featureLabel}>Total earnings</span>
                <strong style={styles.totalValue}>₨ {pkg.totalEarnings.toLocaleString()}</strong>
              </div>
            </div>

            <ul style={styles.featureList}>
              {pkg.features.map((feature, idx) => (
                <li key={idx} style={styles.featureListItem}>
                  <span style={styles.checkIcon}>✓</span> {feature}
                </li>
              ))}
            </ul>

            <div style={styles.profitBox}>
              <span style={styles.profitLabel}>Net Profit</span>
              <span style={styles.profitValue}>₨ {(pkg.totalEarnings - pkg.price).toLocaleString()}</span>
            </div>

            <button
              onClick={() => handleSelectPackage(pkg)}
              style={{
                ...styles.selectBtn,
                ...(index === 2 ? styles.featuredBtn : {})
              }}
            >
              Select Package
              <span style={styles.btnArrow}>→</span>
            </button>
          </div>
        ))}
      </div>

      <div style={styles.infoSection}>
        <h2 style={styles.infoTitle}>Why Invest with Us?</h2>
        <div style={styles.benefitsGrid}>
          <div style={styles.benefit}>
            <div style={styles.benefitIcon}>🎯</div>
            <h3 style={styles.benefitTitle}>Guaranteed Returns</h3>
            <p style={styles.benefitText}>Complete tasks daily and earn guaranteed rewards</p>
          </div>
          <div style={styles.benefit}>
            <div style={styles.benefitIcon}>💰</div>
            <h3 style={styles.benefitTitle}>High ROI</h3>
            <p style={styles.benefitText}>All packages offer positive returns on investment</p>
          </div>
          <div style={styles.benefit}>
            <div style={styles.benefitIcon}>🚀</div>
            <h3 style={styles.benefitTitle}>Easy Tasks</h3>
            <p style={styles.benefitText}>Simple tasks that anyone can complete</p>
          </div>
          <div style={styles.benefit}>
            <div style={styles.benefitIcon}>🔒</div>
            <h3 style={styles.benefitTitle}>Secure Platform</h3>
            <p style={styles.benefitText}>Your investment and earnings are safe with us</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem',
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${theme.colors.borderLight}`,
    borderTopColor: theme.colors.primary,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: '1.1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: theme.colors.primaryBg,
    color: theme.colors.primary,
    padding: '0.5rem 1rem',
    borderRadius: theme.radius.full,
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '1rem',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: '1.1rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  packageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '4rem',
  },
  packageCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: '2rem',
    boxShadow: theme.shadows.card,
    position: 'relative',
    transition: 'all 0.3s ease',
    border: `2px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
  },
  featured: {
    borderColor: theme.colors.primary,
    transform: 'scale(1.02)',
    boxShadow: theme.shadows.lg,
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    padding: '0.5rem 1.25rem',
    borderRadius: theme.radius.full,
    fontSize: '0.8rem',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    boxShadow: theme.shadows.button,
  },
  packageIcon: {
    fontSize: '3rem',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  packageName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  price: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  currency: {
    fontSize: '1.25rem',
    color: theme.colors.primary,
    fontWeight: '700',
  },
  amount: {
    fontSize: '2.5rem',
    color: theme.colors.primary,
    fontWeight: '800',
  },
  description: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    fontSize: '0.95rem',
  },
  features: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.625rem 0',
    borderBottom: `1px solid ${theme.colors.borderLight}`,
    gap: '0.75rem',
  },
  featureIcon: {
    fontSize: '1rem',
  },
  featureLabel: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  featureValue: {
    color: theme.colors.primaryDark,
    fontWeight: '600',
  },
  totalRow: {
    borderBottom: 'none',
    paddingTop: '0.75rem',
  },
  totalValue: {
    color: theme.colors.success,
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '1.5rem',
    flex: 1,
  },
  featureListItem: {
    padding: '0.5rem 0',
    color: theme.colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
  },
  checkIcon: {
    color: theme.colors.success,
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  profitBox: {
    background: `linear-gradient(135deg, ${theme.colors.successBg} 0%, ${theme.colors.primaryBg} 100%)`,
    borderRadius: theme.radius.md,
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  profitLabel: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  profitValue: {
    color: theme.colors.success,
    fontWeight: '800',
    fontSize: '1.25rem',
  },
  selectBtn: {
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    border: 'none',
    padding: '1rem',
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: theme.shadows.button,
    transition: 'all 0.2s ease',
  },
  featuredBtn: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    boxShadow: theme.shadows.success,
  },
  btnArrow: {
    fontSize: '1.1rem',
  },
  infoSection: {
    textAlign: 'center',
    padding: '3rem 0',
  },
  infoTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '2rem',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  benefit: {
    padding: '2rem',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.borderLight}`,
  },
  benefitIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  benefitTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  benefitText: {
    color: theme.colors.textSecondary,
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
};

export default Packages;
