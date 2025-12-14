import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>Trusted by 10,000+ Users</div>
          <h1 style={styles.title}>
            Earn Money by Completing
            <span style={styles.titleHighlight}> Simple Tasks</span>
          </h1>
          <p style={styles.subtitle}>
            Invest in a package, complete daily tasks, and earn rewards.
            Plus, get <strong style={styles.highlight}>₨10</strong> for every referral!
          </p>

          {!isAuthenticated && (
            <div style={styles.ctaButtons}>
              <Link to="/register" style={styles.primaryBtn}>
                Get Started Free
                <span style={styles.btnIcon}>→</span>
              </Link>
              <Link to="/login" style={styles.secondaryBtn}>
                Login to Account
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <div style={styles.ctaButtons}>
              <Link to="/dashboard" style={styles.primaryBtn}>
                Go to Dashboard
                <span style={styles.btnIcon}>→</span>
              </Link>
            </div>
          )}
        </div>
        <div style={styles.heroStats}>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>₨50K+</span>
            <span style={styles.statLabel}>Paid Out</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>10K+</span>
            <span style={styles.statLabel}>Active Users</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>4</span>
            <span style={styles.statLabel}>Packages</span>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div style={styles.features}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Simple Process</span>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>Start earning in just 4 easy steps</p>
        </div>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <div style={styles.featureIcon}>📦</div>
              <div style={styles.stepNumber}>1</div>
            </div>
            <h3 style={styles.featureTitle}>Choose a Package</h3>
            <p style={styles.featureText}>Select from 4 investment packages based on your budget and goals</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <div style={styles.featureIcon}>✅</div>
              <div style={styles.stepNumber}>2</div>
            </div>
            <h3 style={styles.featureTitle}>Complete Tasks</h3>
            <p style={styles.featureText}>Do simple tasks daily like watching videos, clicking ads, and surveys</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <div style={styles.featureIcon}>💰</div>
              <div style={styles.stepNumber}>3</div>
            </div>
            <h3 style={styles.featureTitle}>Earn Rewards</h3>
            <p style={styles.featureText}>Get paid ₨10 for each task and watch your earnings grow</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIconWrapper}>
              <div style={styles.featureIcon}>🏦</div>
              <div style={styles.stepNumber}>4</div>
            </div>
            <h3 style={styles.featureTitle}>Withdraw Anytime</h3>
            <p style={styles.featureText}>Cash out using NayaPay, Bank, Raast, or Zindigi</p>
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div style={styles.referral}>
        <div style={styles.referralContent}>
          <div style={styles.referralIcon}>👥</div>
          <div style={styles.referralText}>
            <h2 style={styles.referralTitle}>Referral Program</h2>
            <p style={styles.referralDesc}>
              Invite friends and earn <strong>₨10</strong> for every successful referral!
              No limits on how many people you can refer.
            </p>
          </div>
          {!isAuthenticated && (
            <Link to="/register" style={styles.referralBtn}>
              Start Earning Now
            </Link>
          )}
        </div>
      </div>

      {/* Packages Section */}
      <div style={styles.packages}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Investment Plans</span>
          <h2 style={styles.sectionTitle}>Our Packages</h2>
          <p style={styles.sectionSubtitle}>Choose the perfect plan for your earnings goal</p>
        </div>
        <div style={styles.packageGrid}>
          <div style={styles.packageCard}>
            <div style={styles.packageHeader}>
              <span style={styles.packageIcon}>🥉</span>
              <h3 style={styles.packageName}>Basic</h3>
            </div>
            <p style={styles.price}>₨ 500</p>
            <ul style={styles.packageFeatures}>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> 3 tasks per day</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> ₨10 per task</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> 90 days validity</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> Total: ₨2,700</li>
            </ul>
            <div style={styles.profitBadge}>
              Profit: ₨2,200
            </div>
          </div>

          <div style={styles.packageCard}>
            <div style={styles.packageHeader}>
              <span style={styles.packageIcon}>🥈</span>
              <h3 style={styles.packageName}>Silver</h3>
            </div>
            <p style={styles.price}>₨ 1,000</p>
            <ul style={styles.packageFeatures}>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> 6 tasks per day</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> ₨10 per task</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> 90 days validity</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> Total: ₨5,400</li>
            </ul>
            <div style={styles.profitBadge}>
              Profit: ₨4,400
            </div>
          </div>

          <div style={{...styles.packageCard, ...styles.popularPackage}}>
            <div style={styles.popularBadge}>Most Popular</div>
            <div style={styles.packageHeader}>
              <span style={styles.packageIcon}>🥇</span>
              <h3 style={styles.packageName}>Gold</h3>
            </div>
            <p style={styles.price}>₨ 2,000</p>
            <ul style={styles.packageFeatures}>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> 12 tasks per day</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> ₨10 per task</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> 90 days validity</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> Total: ₨10,800</li>
            </ul>
            <div style={{...styles.profitBadge, ...styles.profitBadgePopular}}>
              Profit: ₨8,800
            </div>
          </div>

          <div style={styles.packageCard}>
            <div style={styles.packageHeader}>
              <span style={styles.packageIcon}>💎</span>
              <h3 style={styles.packageName}>Platinum</h3>
            </div>
            <p style={styles.price}>₨ 3,500</p>
            <ul style={styles.packageFeatures}>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> 21 tasks per day</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> ₨10 per task</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> 90 days validity</li>
              <li style={styles.featureItem}><span style={styles.checkIcon}>✓</span> Total: ₨18,900</li>
            </ul>
            <div style={styles.profitBadge}>
              Profit: ₨15,400
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={styles.footerCta}>
        <h2 style={styles.footerCtaTitle}>Ready to Start Earning?</h2>
        <p style={styles.footerCtaText}>Join thousands of users who are already earning daily rewards</p>
        {!isAuthenticated && (
          <Link to="/register" style={styles.footerCtaBtn}>
            Create Free Account
          </Link>
        )}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2024 MN Works. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 0 3rem',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: theme.colors.successBg,
    color: theme.colors.success,
    padding: '0.5rem 1rem',
    borderRadius: theme.radius.full,
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    border: `1px solid ${theme.colors.successLight}`,
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    color: theme.colors.primaryDark,
    marginBottom: '1.5rem',
    lineHeight: '1.2',
  },
  titleHighlight: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.primary} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: theme.colors.textSecondary,
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  highlight: {
    color: theme.colors.success,
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    padding: '1rem 2rem',
    borderRadius: theme.radius.lg,
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: theme.shadows.success,
    transition: 'all 0.3s ease',
  },
  btnIcon: {
    fontSize: '1.2rem',
  },
  secondaryBtn: {
    backgroundColor: theme.colors.white,
    color: theme.colors.primary,
    padding: '1rem 2rem',
    borderRadius: theme.radius.lg,
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: `2px solid ${theme.colors.primary}`,
    transition: 'all 0.3s ease',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '3rem',
    flexWrap: 'wrap',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 2rem',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
  statLabel: {
    fontSize: '0.875rem',
    color: theme.colors.textSecondary,
    marginTop: '0.25rem',
  },
  features: {
    padding: '4rem 0',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  sectionBadge: {
    display: 'inline-block',
    backgroundColor: theme.colors.primaryBg,
    color: theme.colors.primary,
    padding: '0.5rem 1rem',
    borderRadius: theme.radius.full,
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: theme.colors.textSecondary,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.white,
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.borderLight}`,
    transition: 'all 0.3s ease',
  },
  featureIconWrapper: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  featureIcon: {
    width: '70px',
    height: '70px',
    background: `linear-gradient(135deg, ${theme.colors.primaryBg} 0%, ${theme.colors.successBg} 100%)`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    margin: '0 auto',
  },
  stepNumber: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    width: '28px',
    height: '28px',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '700',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  featureText: {
    color: theme.colors.textSecondary,
    lineHeight: '1.6',
  },
  referral: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    borderRadius: theme.radius.xl,
    padding: '3rem',
    margin: '2rem 0',
  },
  referralContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  referralIcon: {
    fontSize: '3.5rem',
  },
  referralText: {
    color: theme.colors.white,
  },
  referralTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: theme.colors.white,
  },
  referralDesc: {
    fontSize: '1.1rem',
    opacity: 0.95,
    color: theme.colors.white,
  },
  referralBtn: {
    backgroundColor: theme.colors.white,
    color: theme.colors.successDark,
    padding: '1rem 2rem',
    borderRadius: theme.radius.lg,
    textDecoration: 'none',
    fontWeight: '700',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  packages: {
    padding: '4rem 0',
  },
  packageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  packageCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: '2rem',
    textAlign: 'center',
    boxShadow: theme.shadows.card,
    border: `2px solid ${theme.colors.border}`,
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  popularPackage: {
    borderColor: theme.colors.primary,
    transform: 'scale(1.02)',
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    padding: '0.5rem 1rem',
    borderRadius: theme.radius.full,
    fontSize: '0.75rem',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },
  packageHeader: {
    marginBottom: '1rem',
  },
  packageIcon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  packageName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  price: {
    fontSize: '2.5rem',
    color: theme.colors.primary,
    fontWeight: '800',
    marginBottom: '1.5rem',
  },
  packageFeatures: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  featureItem: {
    padding: '0.5rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: theme.colors.textSecondary,
    borderBottom: `1px solid ${theme.colors.borderLight}`,
  },
  checkIcon: {
    color: theme.colors.success,
    fontWeight: 'bold',
  },
  profitBadge: {
    backgroundColor: theme.colors.successBg,
    color: theme.colors.successDark,
    padding: '0.75rem 1rem',
    borderRadius: theme.radius.md,
    fontWeight: '700',
    fontSize: '1rem',
  },
  profitBadgePopular: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
  },
  footerCta: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`,
    borderRadius: theme.radius.xl,
    marginBottom: '3rem',
  },
  footerCtaTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: '0.5rem',
  },
  footerCtaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  footerCtaBtn: {
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    padding: '1rem 2.5rem',
    borderRadius: theme.radius.lg,
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '700',
    boxShadow: theme.shadows.success,
    display: 'inline-block',
  },
  footer: {
    textAlign: 'center',
    padding: '2rem',
    color: theme.colors.textSecondary,
    borderTop: `1px solid ${theme.colors.border}`,
  },
};

export default Home;
