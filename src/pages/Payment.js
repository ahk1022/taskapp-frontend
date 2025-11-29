import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/Notification';
import { packageAPI } from '../utils/api';

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
      accountName: 'ALI HASSAN',
      accountNumber: '0309-0319063',
      instructions: 'Send payment to the NayaPay number above and submit screenshot',
    },
    {
      id: 'raast',
      name: 'Raast ID',
      accountName: 'ALI HASSAN',
      raastId: '0309-0319063',
      instructions: 'Send payment via Raast ID and provide transaction ID',
    },
    {
      id: 'zindigi',
      name: 'Zindigi App',
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
      warning('Please select a payment method to continue with your purchase.');
      return;
    }

    if (!paymentProof && !transactionId) {
      warning('Please upload payment proof image or enter transaction ID');
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

      success(
        'Package purchase request submitted successfully! Your package will be activated within 24 hours once admin verifies your payment.'
      );

      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to initiate purchase. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPackage) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2>No Package Selected</h2>
          <p>Please select a package first</p>
          <button onClick={() => navigate('/packages')} style={styles.backBtn}>
            Go to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Complete Payment</h1>

      <div style={styles.grid}>
        <div style={styles.packageSummary}>
          <h2>Package Summary</h2>
          <div style={styles.summaryContent}>
            <h3 style={styles.packageName}>{selectedPackage.name}</h3>
            <div style={styles.summaryItem}>
              <span>Package Price</span>
              <strong style={styles.price}>₨ {selectedPackage.price.toLocaleString()}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span>Tasks per day</span>
              <strong>{selectedPackage.tasksPerDay}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span>Reward per task</span>
              <strong>₨ {selectedPackage.rewardPerTask}</strong>
            </div>
            <div style={styles.summaryItem}>
              <span>Total duration</span>
              <strong>{selectedPackage.totalDays} days</strong>
            </div>
            <div style={{...styles.summaryItem, ...styles.totalEarnings}}>
              <span>Potential earnings</span>
              <strong>₨ {selectedPackage.totalEarnings.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div style={styles.paymentSection}>
          <h2>Select Payment Method</h2>

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
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    style={styles.radio}
                  />
                  <h3>{method.name}</h3>
                </div>

                {selectedMethod === method.id && (
                  <div style={styles.methodDetails}>
                    <p><strong>Account Name:</strong> {method.accountName}</p>
                    {method.accountNumber && (
                      <p><strong>Account Number:</strong> {method.accountNumber}</p>
                    )}
                    {method.raastId && (
                      <p><strong>Raast ID:</strong> {method.raastId}</p>
                    )}
                    {method.phoneNumber && (
                      <p><strong>Phone:</strong> {method.phoneNumber}</p>
                    )}
                    <p style={styles.instructions}>{method.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={styles.proofSection}>
            <h3>Payment Proof</h3>
            <p style={styles.proofInfo}>Please provide either a payment screenshot OR transaction ID</p>

            <div style={styles.proofInputs}>
              <div style={styles.fileUpload}>
                <label style={styles.label}>Upload Payment Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                />
                {proofPreview && (
                  <div style={styles.previewContainer}>
                    <img src={proofPreview} alt="Payment proof" style={styles.preview} />
                  </div>
                )}
              </div>

              <div style={styles.orDivider}>OR</div>

              <div style={styles.transactionInput}>
                <label style={styles.label}>Transaction/Reference ID</label>
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
            <h3>Important Instructions:</h3>
            <ol>
              <li>Make payment of ₨ {selectedPackage.price.toLocaleString()} using selected method</li>
              <li>Keep your payment receipt/screenshot</li>
              <li>Click "Confirm Payment" below after completing payment</li>
              <li>Admin will verify payment and activate your package within 24 hours</li>
              <li>You will receive a notification once package is activated</li>
            </ol>
          </div>

          <button
            onClick={handlePurchase}
            style={styles.confirmBtn}
            disabled={!selectedMethod || loading}
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
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
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  backBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
  },
  packageSummary: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 'fit-content',
  },
  summaryContent: {
    marginTop: '1rem',
  },
  packageName: {
    color: '#27ae60',
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #ecf0f1',
  },
  price: {
    color: '#27ae60',
    fontSize: '1.2rem',
  },
  totalEarnings: {
    borderBottom: 'none',
    backgroundColor: '#ecf0f1',
    padding: '1rem',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  paymentSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  methodsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
    marginBottom: '2rem',
  },
  methodCard: {
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  selectedMethod: {
    borderColor: '#27ae60',
    backgroundColor: '#f0fff4',
  },
  methodHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  radio: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  methodDetails: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #ecf0f1',
    lineHeight: '1.8',
  },
  instructions: {
    marginTop: '0.5rem',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  importantNote: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  proofSection: {
    backgroundColor: '#f8f9fa',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  proofInfo: {
    color: '#7f8c8d',
    marginBottom: '1rem',
    fontStyle: 'italic',
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
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '0.95rem',
  },
  fileInput: {
    padding: '0.75rem',
    border: '2px dashed #bdc3c7',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  previewContainer: {
    marginTop: '1rem',
    border: '2px solid #ecf0f1',
    borderRadius: '4px',
    padding: '0.5rem',
    backgroundColor: '#fff',
  },
  preview: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '4px',
    display: 'block',
  },
  orDivider: {
    textAlign: 'center',
    color: '#95a5a6',
    fontWeight: 'bold',
    margin: '0.5rem 0',
  },
  transactionInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  textInput: {
    padding: '0.75rem',
    border: '2px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
  },
};

export default Payment;
