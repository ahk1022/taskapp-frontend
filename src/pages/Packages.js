import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageAPI } from '../utils/api';

const Packages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

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
    setSelectedPackage(pkg);
    navigate('/payment', { state: { package: pkg } });
  };

  if (loading) {
    return <div style={styles.loading}>Loading packages...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Investment Packages</h1>
      <p style={styles.subtitle}>
        Choose the package that fits your investment goals and start earning today!
      </p>

      <div style={styles.packageGrid}>
        {packages.map((pkg, index) => (
          <div key={pkg._id} style={{
            ...styles.packageCard,
            ...(index === 2 ? styles.featured : {})
          }}>
            {index === 2 && <div style={styles.badge}>Popular</div>}

            <h2 style={styles.packageName}>{pkg.name}</h2>
            <div style={styles.price}>
              <span style={styles.currency}>₨</span>
              <span style={styles.amount}>{pkg.price.toLocaleString()}</span>
            </div>

            <p style={styles.description}>{pkg.description}</p>

            <div style={styles.features}>
              <div style={styles.featureItem}>
                <span style={styles.featureLabel}>Tasks per day</span>
                <strong>{pkg.tasksPerDay}</strong>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureLabel}>Reward per task</span>
                <strong>₨ {pkg.rewardPerTask}</strong>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureLabel}>Package duration</span>
                <strong>{pkg.totalDays} days</strong>
              </div>
              <div style={{...styles.featureItem, ...styles.totalEarnings}}>
                <span style={styles.featureLabel}>Total potential earnings</span>
                <strong>₨ {pkg.totalEarnings.toLocaleString()}</strong>
              </div>
            </div>

            <ul style={styles.featureList}>
              {pkg.features.map((feature, idx) => (
                <li key={idx} style={styles.featureListItem}>
                  ✓ {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPackage(pkg)}
              style={{
                ...styles.selectBtn,
                ...(index === 2 ? styles.featuredBtn : {})
              }}
            >
              Select Package
            </button>
          </div>
        ))}
      </div>

      <div style={styles.infoSection}>
        <h2>Why Invest with Us?</h2>
        <div style={styles.benefitsGrid}>
          <div style={styles.benefit}>
            <h3>🎯 Guaranteed Returns</h3>
            <p>Complete tasks daily and earn guaranteed rewards</p>
          </div>
          <div style={styles.benefit}>
            <h3>💰 High ROI</h3>
            <p>All packages offer positive returns on investment</p>
          </div>
          <div style={styles.benefit}>
            <h3>🚀 Easy Tasks</h3>
            <p>Simple tasks that anyone can complete</p>
          </div>
          <div style={styles.benefit}>
            <h3>🔒 Secure Platform</h3>
            <p>Your investment and earnings are safe with us</p>
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
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  subtitle: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.1rem',
    marginBottom: '3rem',
  },
  packageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
    transition: 'transform 0.3s, boxShadow 0.3s',
    border: '2px solid transparent',
  },
  featured: {
    border: '2px solid #27ae60',
    transform: 'scale(1.05)',
  },
  badge: {
    position: 'absolute',
    top: '-10px',
    right: '20px',
    backgroundColor: '#27ae60',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  packageName: {
    fontSize: '1.8rem',
    color: '#2c3e50',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  price: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  currency: {
    fontSize: '1.5rem',
    color: '#27ae60',
    fontWeight: 'bold',
  },
  amount: {
    fontSize: '2.5rem',
    color: '#27ae60',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  features: {
    backgroundColor: '#ecf0f1',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  featureItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #bdc3c7',
  },
  featureLabel: {
    color: '#7f8c8d',
  },
  totalEarnings: {
    borderBottom: 'none',
    color: '#27ae60',
    fontSize: '1.1rem',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '1.5rem',
  },
  featureListItem: {
    padding: '0.5rem 0',
    color: '#2c3e50',
  },
  selectBtn: {
    width: '100%',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'backgroundColor 0.3s',
  },
  featuredBtn: {
    backgroundColor: '#27ae60',
  },
  infoSection: {
    marginTop: '4rem',
    textAlign: 'center',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  benefit: {
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
};

export default Packages;
