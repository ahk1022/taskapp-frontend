import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Earn Money by Completing Simple Tasks</h1>
        <p style={styles.subtitle}>
          Invest in a package, complete daily tasks, and earn rewards. Plus, get 10 rupees for every referral!
        </p>

        {!isAuthenticated && (
          <div style={styles.ctaButtons}>
            <Link to="/register" style={styles.primaryBtn}>Get Started</Link>
            <Link to="/login" style={styles.secondaryBtn}>Login</Link>
          </div>
        )}
      </div>

      <div style={styles.features}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>1</div>
            <h3>Choose a Package</h3>
            <p>Select from 4 investment packages based on your budget and goals</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>2</div>
            <h3>Complete Tasks</h3>
            <p>Do simple tasks daily like watching videos, clicking ads, and surveys</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>3</div>
            <h3>Earn Rewards</h3>
            <p>Get paid for each task and watch your earnings grow</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>4</div>
            <h3>Withdraw Anytime</h3>
            <p>Cash out using NayaPay, Bank, Raast, or Zindigi</p>
          </div>
        </div>
      </div>

      <div style={styles.referral}>
        <h2 style={styles.sectionTitle}>Referral Program</h2>
        <p style={styles.referralText}>
          Invite friends and earn <strong>10 rupees</strong> for every successful referral!
        </p>
      </div>

      <div style={styles.packages}>
        <h2 style={styles.sectionTitle}>Our Packages</h2>
        <div style={styles.packageGrid}>
          <div style={styles.packageCard}>
            <h3>Basic</h3>
            <p style={styles.price}>₨ 500</p>
            <ul style={styles.packageFeatures}>
              <li>✓ 3 tasks per day</li>
              <li>✓ 10 rupees per task</li>
              <li>✓ 30 days validity</li>
              <li>✓ Total earnings: 900 rupees</li>
              <li>✓ Profit: 400 rupees</li>
            </ul>
          </div>
          <div style={styles.packageCard}>
            <h3>Silver</h3>
            <p style={styles.price}>₨ 1,000</p>
            <ul style={styles.packageFeatures}>
              <li>✓ 6 tasks per day</li>
              <li>✓ 10 rupees per task</li>
              <li>✓ 30 days validity</li>
              <li>✓ Total earnings: 1800 rupees</li>
              <li>✓ Profit: 800 rupees</li>
            </ul>
          </div>
          <div style={styles.packageCard}>
            <h3>Gold</h3>
            <p style={styles.price}>₨ 2,000</p>
            <ul style={styles.packageFeatures}>
              <li>✓ 12 tasks per day</li>
              <li>✓ 10 rupees per task</li>
              <li>✓ 30 days validity</li>
              <li>✓ Total earnings: 3600 rupees</li>
              <li>✓ Profit: 1600 rupees</li>
            </ul>
          </div>
          <div style={styles.packageCard}>
            <h3>Platinum</h3>
            <p style={styles.price}>₨ 3,500</p>
            <ul style={styles.packageFeatures}>
              <li>✓ 21 tasks per day</li>
              <li>✓ 10 rupees per task</li>
              <li>✓ 30 days validity</li>
              <li>✓ Total earnings: 6300 rupees</li>
              <li>✓ Profit: 2800 rupees</li>
            </ul>
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
  hero: {
    textAlign: 'center',
    padding: '3rem 0',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    marginBottom: '2rem',
    maxWidth: '800px',
    margin: '0 auto 2rem',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '1rem 2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  features: {
    padding: '3rem 0',
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#ecf0f1',
  },
  featureIcon: {
    width: '60px',
    height: '60px',
    backgroundColor: '#3498db',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 auto 1rem',
  },
  referral: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#27ae60',
    borderRadius: '8px',
    margin: '3rem 0',
  },
  referralText: {
    color: '#fff',
    fontSize: '1.3rem',
  },
  packages: {
    padding: '3rem 0',
  },
  packageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  packageCard: {
    border: '2px solid #3498db',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
  },
  price: {
    fontSize: '2rem',
    color: '#27ae60',
    fontWeight: 'bold',
    margin: '1rem 0',
  },
  packageFeatures: {
    listStyle: 'none',
    padding: 0,
    lineHeight: '2',
  },
};

export default Home;
