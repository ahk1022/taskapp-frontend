import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/Notification';
import { packageAPI } from '../utils/api';
import theme from '../theme';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.package;
  const { warning, success, error } = useNotification();

  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [proofPreview, setProofPreview] = useState(null);

  const paymentMethods = [
    {
      id: 'nayapay',
      name: 'NayaPay',
      icon: '💳',
      accountName: 'ALI HASSAN',
      accountNumber: '0309-0319063',
      instructions: 'Send payment to the NayaPay number above and submit screenshot',
    },
    {
      id: 'raast',
      name: 'Raast ID',
      icon: '🏦',
      accountName: 'ALI HASSAN',
      raastId: '0309-0319063',
      instructions: 'Send payment via Raast ID and provide transaction ID',
    },
    {
      id: 'zindigi',
      name: 'Zindigi App',
      icon: '📱',
      accountName: 'ALI HASSAN',
      phoneNumber: '0309-0319063',
      instructions: 'Send payment through Zindigi app and submit proof',
    },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        warning('File size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result);
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePurchase = async () => {
    if (!selectedMethod) {
      warning('Please select a payment method to continue.');
      return;
    }

    if (!paymentProof && !transactionId) {
      warning('Please upload payment proof or enter transaction ID');
      return;
    }

    setLoading(true);

    try {
      await packageAPI.purchase({
        packageId: selectedPackage._id,
        paymentMethod: selectedMethod,
        paymentProof: paymentProof,
        transactionId: transactionId,
      });

      success('Payment submitted! Your package will be activated within 24 hours.');
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to process payment.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPackage) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>📦</div>
          <h2 style={styles.errorTitle}>No Package Selected</h2>
          <p style={styles.errorText}>Please select a package first</p>
          <button onClick={() => navigate('/packages')} style={styles.backBtn}>
            Go to Packages
            <span style={styles.btnArrow}>→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Complete Payment</h1>
        <p style={styles.subtitle}>Secure checkout for your package</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.packageSummary}>
          <h2 style={styles.sectionTitle}>Package Summary</h2>
          <div style={styles.summaryContent}>
            <div style={styles.packageBadge}>{selectedPackage.name}</div>
            <div style={styles.priceBox}>
              <span style={styles.priceLabel}>Total Amount</span>
              <span style={styles.priceValue}>₨ {selectedPackage.price.toLocaleString()}</span>
            </div>
            <div style={styles.summaryList}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryIcon}>📋</span>
                <span>Tasks per day</span>
                <strong>{selectedPackage.tasksPerDay}</strong>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryIcon}>💰</span>
                <span>Reward per task</span>
                <strong>₨ {selectedPackage.rewardPerTask}</strong>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryIcon}>📅</span>
                <span>Duration</span>
                <strong>{selectedPackage.totalDays} days</strong>
              </div>
            </div>
            <div style={styles.earningsBox}>
              <span style={styles.earningsLabel}>Potential Earnings</span>
              <span style={styles.earningsValue}>₨ {selectedPackage.totalEarnings.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={styles.paymentSection}>
          <h2 style={styles.sectionTitle}>Select Payment Method</h2>

          <div style={styles.methodsGrid}>
            {paymentMethods.map(method => (
              <div
                key={method.id}
                style={{
                  ...styles.methodCard,
                  ...(selectedMethod === method.id ? styles.selectedMethod : {})
                }}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div style={styles.methodHeader}>
                  <div style={styles.radioWrapper}>
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      style={styles.radio}
                    />
                  </div>
                  <span style={styles.methodIcon}>{method.icon}</span>
                  <h3 style={styles.methodName}>{method.name}</h3>
                </div>

                {selectedMethod === method.id && (
                  <div style={styles.methodDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Account Name:</span>
                      <span style={styles.detailValue}>{method.accountName}</span>
                    </div>
                    {method.accountNumber && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Account Number:</span>
                        <span style={styles.detailValueHighlight}>{method.accountNumber}</span>
                      </div>
                    )}
                    {method.raastId && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Raast ID:</span>
                        <span style={styles.detailValueHighlight}>{method.raastId}</span>
                      </div>
                    )}
                    {method.phoneNumber && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Phone:</span>
                        <span style={styles.detailValueHighlight}>{method.phoneNumber}</span>
                      </div>
                    )}
                    <p style={styles.instructions}>{method.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={styles.proofSection}>
            <h3 style={styles.proofTitle}>Payment Proof</h3>
            <p style={styles.proofInfo}>Upload payment screenshot OR enter transaction ID</p>

            <div style={styles.proofInputs}>
              <div style={styles.fileUpload}>
                <label style={styles.label}>Upload Screenshot</label>
                <div style={styles.fileInputWrapper}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                    id="payment-proof"
                  />
                  <label htmlFor="payment-proof" style={styles.fileLabel}>
                    <span style={styles.fileIcon}>📤</span>
                    {proofPreview ? 'Change Image' : 'Choose File'}
                  </label>
                </div>
                {proofPreview && (
                  <div style={styles.previewContainer}>
                    <img src={proofPreview} alt="Payment proof" style={styles.preview} />
                  </div>
                )}
              </div>

              <div style={styles.orDivider}>
                <span style={styles.orText}>OR</span>
              </div>

              <div style={styles.transactionInput}>
                <label style={styles.label}>Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction or reference ID"
                  style={styles.textInput}
                />
              </div>
            </div>
          </div>

          <div style={styles.importantNote}>
            <div style={styles.noteHeader}>
              <span style={styles.noteIcon}>⚠️</span>
              <h3 style={styles.noteTitle}>Important Instructions</h3>
            </div>
            <ol style={styles.noteList}>
              <li>Make payment of ₨ {selectedPackage.price.toLocaleString()} using selected method</li>
              <li>Keep your payment receipt/screenshot</li>
              <li>Click "Confirm Payment" after completing payment</li>
              <li>Admin will verify and activate your package within 24 hours</li>
            </ol>
          </div>

          <button
            onClick={handlePurchase}
            style={styles.confirmBtn}
            disabled={!selectedMethod || loading}
          >
            {loading ? (
              <span style={styles.loadingText}>
                <span style={styles.spinner}></span>
                Processing...
              </span>
            ) : (
              <>
                Confirm Payment
                <span style={styles.btnArrow}>→</span>
              </>
            )}
          </button>
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
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  errorCard: {
    backgroundColor: theme.colors.white,
    padding: '4rem 2rem',
    borderRadius: theme.radius.xl,
    textAlign: 'center',
    boxShadow: theme.shadows.card,
    maxWidth: '500px',
    margin: '2rem auto',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '0.5rem',
  },
  errorText: {
    color: theme.colors.textSecondary,
    marginBottom: '1.5rem',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: theme.shadows.button,
  },
  btnArrow: {
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  packageSummary: {
    backgroundColor: theme.colors.white,
    padding: '2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    height: 'fit-content',
    border: `1px solid ${theme.colors.borderLight}`,
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: '1.5rem',
  },
  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  packageBadge: {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
    color: theme.colors.white,
    padding: '0.75rem 1.5rem',
    borderRadius: theme.radius.md,
    fontSize: '1.25rem',
    fontWeight: '700',
    textAlign: 'center',
  },
  priceBox: {
    background: `linear-gradient(135deg, ${theme.colors.successBg} 0%, ${theme.colors.primaryBg} 100%)`,
    padding: '1.25rem',
    borderRadius: theme.radius.lg,
    textAlign: 'center',
  },
  priceLabel: {
    display: 'block',
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  priceValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: theme.colors.success,
  },
  summaryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    gap: '0.75rem',
  },
  summaryIcon: {
    fontSize: '1.1rem',
  },
  earningsBox: {
    background: `linear-gradient(135deg, ${theme.colors.primaryDark} 0%, ${theme.colors.primary} 100%)`,
    padding: '1.25rem',
    borderRadius: theme.radius.lg,
    textAlign: 'center',
    color: theme.colors.white,
  },
  earningsLabel: {
    display: 'block',
    opacity: 0.9,
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  earningsValue: {
    fontSize: '1.75rem',
    fontWeight: '800',
  },
  paymentSection: {
    backgroundColor: theme.colors.white,
    padding: '2rem',
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.borderLight}`,
  },
  methodsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  methodCard: {
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: theme.colors.background,
  },
  selectedMethod: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.successBg,
  },
  methodHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  radioWrapper: {
    flexShrink: 0,
  },
  radio: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: theme.colors.success,
  },
  methodIcon: {
    fontSize: '1.5rem',
  },
  methodName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    margin: 0,
  },
  methodDetails: {
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: `1px solid ${theme.colors.border}`,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  detailValue: {
    color: theme.colors.primaryDark,
    fontWeight: '500',
  },
  detailValueHighlight: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  instructions: {
    marginTop: '0.75rem',
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
  proofSection: {
    backgroundColor: theme.colors.background,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  proofTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginBottom: '0.25rem',
  },
  proofInfo: {
    color: theme.colors.textSecondary,
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  proofInputs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fileUpload: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '600',
    color: theme.colors.primaryDark,
    fontSize: '0.9rem',
  },
  fileInputWrapper: {
    position: 'relative',
  },
  fileInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    border: `2px dashed ${theme.colors.primary}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    cursor: 'pointer',
    color: theme.colors.primary,
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  fileIcon: {
    fontSize: '1.25rem',
  },
  previewContainer: {
    marginTop: '1rem',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '0.5rem',
    backgroundColor: theme.colors.white,
  },
  preview: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: theme.radius.sm,
    display: 'block',
    margin: '0 auto',
  },
  orDivider: {
    textAlign: 'center',
    position: 'relative',
  },
  orText: {
    backgroundColor: theme.colors.background,
    padding: '0 1rem',
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  transactionInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  textInput: {
    padding: '0.875rem 1rem',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    fontSize: '1rem',
    backgroundColor: theme.colors.white,
    transition: 'all 0.2s ease',
  },
  importantNote: {
    backgroundColor: theme.colors.warningBg,
    border: `1px solid ${theme.colors.warning}`,
    borderRadius: theme.radius.lg,
    padding: '1.25rem',
    marginBottom: '1.5rem',
  },
  noteHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  noteIcon: {
    fontSize: '1.25rem',
  },
  noteTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: theme.colors.warning,
    margin: 0,
  },
  noteList: {
    margin: 0,
    paddingLeft: '1.5rem',
    lineHeight: '1.8',
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  confirmBtn: {
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.successDark} 100%)`,
    color: theme.colors.white,
    border: 'none',
    padding: '1rem',
    borderRadius: theme.radius.md,
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: theme.shadows.success,
    transition: 'all 0.2s ease',
  },
  loadingText: {
    display: 'flex',
    alignItems: 'center',
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
};

export default Payment;
