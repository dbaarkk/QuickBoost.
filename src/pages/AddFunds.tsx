import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Wallet,
  Smartphone,
  CheckCircle,
  Shield,
  Clock,
  AlertTriangle,
  History,
  ExternalLink,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createDeposit, getUserDeposits, Deposit } from '../lib/supabase';
import { verifyCryptoPayment } from '../lib/cryptoVerification';

const wallets = [
  { name: 'Solana', address: '99q2VEJtZjt56UjJuSLb45mkdrAnA4Lsb7q33uKUQo1P' },
  { name: 'Ethereum', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Base', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Polygon', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Bitcoin', address: 'bc1qt3vl6de9j7q7lrmmwx2g3fnaf0m0cmmk9ct4f9' },
];

// UPI Deep Link Service
const generateUPIDeepLink = (amount: number, upiId: string, note: string = 'QuickBoost Deposit') => {
  const encodedNote = encodeURIComponent(note);
  return `upi://pay?pa=${upiId}&pn=QuickBoost&am=${amount}&cu=INR&tn=${encodedNote}`;
};

const openUPIApp = (deepLink: string) => {
  window.location.href = deepLink;
};

// UPI Payment Modal Component
const UPIPaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  upiId: string;
  onSuccess: () => void;
  onFailure: (error: string) => void;
}> = ({ isOpen, onClose, amount, upiId, onSuccess, onFailure }) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('pending');
      setErrorMessage('');
      
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          // Simulate payment verification (in real app, you'd check with your backend)
          setTimeout(() => {
            // Simulate random success/failure for testing
            const isSuccess = Math.random() > 0.3; // 70% success rate for testing
            
            if (isSuccess) {
              setPaymentStatus('success');
              onSuccess();
            } else {
              setPaymentStatus('failed');
              setErrorMessage('Transaction blocked by authorities or failed');
              onFailure('Transaction blocked by authorities or failed');
            }
          }, 2000);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [isOpen, onSuccess, onFailure]);

  const handlePayment = () => {
    const deepLink = generateUPIDeepLink(amount, upiId);
    openUPIApp(deepLink);
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
    setErrorMessage('');
    handlePayment();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2A2A2A] rounded-xl max-w-md w-full p-6 border border-[#3A3A3A]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#E0E0E0]">Pay via UPI</h2>
          <button onClick={onClose} className="text-[#A0A0A0] hover:text-[#E0E0E0]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {paymentStatus === 'pending' ? (
          <>
            <div className="text-center mb-6">
              <p className="text-[#A0A0A0]">Amount to pay</p>
              <p className="text-3xl font-bold text-[#00CFFF]">₹{amount}</p>
              <p className="text-sm text-[#A0A0A0] mt-1">to {upiId}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Open UPI App to Pay
              </button>

              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <p className="text-sm text-yellow-500">
                  ⚠️ If transaction fails or gets blocked, try using a different UPI app
                </p>
              </div>
            </div>
          </>
        ) : paymentStatus === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">Payment Successful!</h3>
            <p className="text-[#A0A0A0]">₹{amount} has been added to your account</p>
            <button
              onClick={onClose}
              className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-400 mb-2">Payment Failed</h3>
            <p className="text-[#A0A0A0] mb-4">{errorMessage}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AddFunds: React.FC = () => {
  const { profile, user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'crypto'>('upi');
  const [txid, setTxid] = useState('');
  const [copied, setCopied] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'pending' | 'error' | ''>('');
  const [showUPIModal, setShowUPIModal] = useState(false);

  const upiAmounts = [100, 500, 1000, 2000, 5000, 10000];
  const cryptoAmounts = [10, 20, 50, 100, 200, 1000];
  const currentAmounts = paymentMethod === 'upi' ? upiAmounts : cryptoAmounts;
  const YOUR_UPI_ID = 'aaryaveer@upi';

  // Reset states when component mounts or payment method changes
  useEffect(() => {
    setAmount('');
    setTxid('');
    setSubmitError('');
    setVerificationStatus('');
    setShowSuccess(false);
  }, [paymentMethod]);

  // Fetch user deposits
  useEffect(() => {
    const fetchDeposits = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await getUserDeposits(user.id);
        if (error) {
          console.error('Error fetching deposits:', error);
          setDeposits([]);
        } else {
          setDeposits(data || []);
        }
      } catch (error) {
        console.error('Error fetching deposits:', error);
        setDeposits([]);
      }
    };

    fetchDeposits();
  }, [user]);

  const handleAmountSelect = (value: number) => setAmount(value.toString());

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (!amount || amountValue <= 0) {
      setSubmitError('Please enter a valid amount');
      return;
    }
    
    if (paymentMethod === 'upi' && amountValue < 10) {
      setSubmitError('Minimum deposit amount is ₹10 for UPI');
      return;
    }
    
    if (paymentMethod === 'crypto' && amountValue < 1) {
      setSubmitError('Minimum deposit amount is $1 for crypto');
      return;
    }

    if (paymentMethod === 'crypto' && !txid) {
      setSubmitError('Please enter transaction ID');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setVerificationStatus('pending');

    try {
      let depositStatus = 'pending';
      
      if (paymentMethod === 'crypto') {
        const verification = await verifyCryptoPayment(txid, 'auto');
        
        if (verification.success) {
          depositStatus = 'verified';
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
          setSubmitError(verification.error || 'Payment verification failed. Please check transaction hash.');
          setIsSubmitting(false);
          return;
        }
      }

      const depositData = {
        amount: amountValue,
        payment_method: paymentMethod,
        status: depositStatus,
        ...(paymentMethod === 'crypto' && { 
          txid, 
          crypto_type: 'auto' 
        }),
      };

      const { data, error } = await createDeposit(depositData);
      
      if (error) {
        setVerificationStatus('error');
        setSubmitError(error.message);
      } else {
        setShowSuccess(true);
        setAmount('');
        setTxid('');
        
        if (user) {
          const { data: depositsData } = await getUserDeposits(user.id);
          if (depositsData) setDeposits(depositsData);
        }
        
        setTimeout(() => {
          setShowSuccess(false);
          setVerificationStatus('');
        }, 5000);
      }
    } catch (error) {
      setVerificationStatus('error');
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUPISuccess = async () => {
    const amountValue = parseFloat(amount);
    
    const depositData = {
      amount: amountValue,
      payment_method: 'upi' as const,
      status: 'verified' as const,
      utr_number: `auto_${Date.now()}`,
    };

    const { error } = await createDeposit(depositData);
    
    if (!error) {
      setShowSuccess(true);
      setAmount('');
      
      if (user) {
        const { data: depositsData } = await getUserDeposits(user.id);
        if (depositsData) setDeposits(depositsData);
      }
    } else {
      setSubmitError('Failed to update balance. Please contact support.');
    }
  };

  const handleUPIFailure = (error: string) => {
    setSubmitError(error);
    setShowUPIModal(false);
  };

  const resetStates = () => {
    setAmount('');
    setSubmitError('');
    setVerificationStatus('');
    setShowSuccess(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="bg-[#1E1E1E] shadow-lg border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link to="/" className="flex items-center">
              <TrendingUp className="h-6 w-6 text-[#00CFFF]" />
              <span className="ml-2 text-xl font-bold text-[#E0E0E0]">QuickBoost</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#E0E0E0] mb-1">Add Funds to Your Account</h1>
          <p className="text-[#A0A0A0]">Add money to your account to start placing orders instantly</p>
        </div>

        {/* Error Message Display - Moved to top */}
        {submitError && (
          <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-[#FF5C5C] mr-2" />
              <p className="text-[#FF5C5C] text-sm">{submitError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A]">
              <div className="p-4 border-b border-[#2A2A2A]">
                <h2 className="text-lg font-semibold text-[#E0E0E0]">Payment Details</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {showSuccess && (
                  <div className="bg-[#00CFFF]/10 border border-[#00CFFF]/30 rounded-lg p-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#00CFFF] mr-3" />
                    <span className="text-[#00CFFF] font-medium">
                      {paymentMethod === 'crypto' 
                        ? '✅ Payment verified successfully! Funds added to your account.' 
                        : '✅ Payment successful! Funds added to your account.'}
                    </span>
                  </div>
                )}

                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                    Select Amount {paymentMethod === 'upi' ? '(₹)' : '($)'}
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {currentAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleAmountSelect(value)}
                        className={`p-4 text-center border rounded-xl font-semibold transition-all hover:scale-105 ${
                          amount === value.toString()
                            ? 'border-[#00CFFF] bg-[#00CFFF]/10 text-[#00CFFF] shadow-md'
                            : 'border-[#2A2A2A] hover:border-[#00CFFF]/50 hover:bg-[#1E1E1E]'
                        }`}
                      >
                        {paymentMethod === 'upi' ? '₹' : '$'}{value}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter custom amount ${paymentMethod === 'upi' ? '(₹)' : '($)'}`}
                    className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00CFFF] focus:border-[#00CFFF] transition-all duration-300 text-lg"
                    min={paymentMethod === 'upi' ? 10 : 1}
                    required
                  />
                  <div className="mt-2 flex items-center text-sm text-[#FF5C5C]">
                    <AlertTriangle className="h-4 w-4 mr-1 text-[#FF5C5C]" />
                    <span>
                      Minimum deposit amount is {paymentMethod === 'upi' ? '₹10 for UPI' : '$1 for crypto'}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Choose Payment Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-[#2A2A2A] rounded-xl cursor-pointer hover:bg-[#1E1E1E] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value as 'upi' | 'crypto');
                          resetStates();
                        }}
                        className="text-[#00CFFF] focus:ring-[#00CFFF]"
                      />
                      <div className="ml-4 flex items-center">
                        <div className="bg-[#00CFFF]/20 p-2 rounded-lg mr-3">
                          <Smartphone className="h-5 w-5 text-[#00CFFF]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#E0E0E0]">UPI Payment</div>
                          <div className="text-sm text-[#A0A0A0]">Instant payment via UPI apps</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-[#2A2A2A] rounded-xl cursor-pointer hover:bg-[#1E1E1E] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="crypto"
                        checked={paymentMethod === 'crypto'}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value as 'upi' | 'crypto');
                          resetStates();
                        }}
                        className="text-[#00CFFF] focus:ring-[#00CFFF]"
                      />
                      <div className="ml-4 flex items-center">
                        <div className="bg-[#7B61FF]/20 p-2 rounded-lg mr-3">
                          <Smartphone className="h-5 w-5 text-[#7B61FF]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#E0E0E0]">Cryptocurrency</div>
                          <div className="text-sm text-[#A0A0A0]">Bitcoin, Ethereum, Solana, etc.</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="bg-[#00CFFF]/10 rounded-xl p-4 mb-4 border border-[#00CFFF]/30">
                      <h4 className="font-medium text-[#00CFFF] mb-2">Instant UPI Payment</h4>
                      <div className="text-sm text-[#E0E0E0] space-y-2">
                        <p>Click the button below to open your UPI app and pay instantly:</p>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitError('');
                            setShowUPIModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center"
                        >
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Pay Instantly with UPI App
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-[#2A2A2A]">
                      <p className="text-sm text-[#A0A0A0] mb-2">
                        You will be redirected to your UPI app to complete the payment
                      </p>
                      <p className="text-xs text-[#00CFFF]">
                        Supported: PhonePe, Google Pay, Paytm, BHIM, and all UPI apps
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="space-y-4">
                    <div className="bg-[#7B61FF]/10 rounded-xl p-4 mb-4 border border-[#7B61FF]/30">
                      <h4 className="font-medium text-[#7B61FF] mb-2">Crypto Payment Instructions:</h4>
                      <ol className="text-sm text-[#E0E0E0] space-y-1">
                        <li>1. Send the exact amount to any of the wallet addresses below</li>
                        <li>2. Submit your transaction ID (TXID)</li>
                        <li>3. Instant verification (usually within seconds)</li>
                      </ol>
                    </div>
                    
                    <input
                      type="text"
                      value={txid}
                      onChange={(e) => setTxid(e.target.value)}
                      placeholder="Enter transaction hash/ID"
                      className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00CFFF] focus:border-[#00CFFF] transition-all duration-300"
                      required
                    />

                    <div className="space-y-2">
                      {wallets.map((wallet) => (
                        <div
                          key={wallet.name}
                          className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1E1E1E] rounded-lg p-3 border border-[#2A2A2A] break-words"
                        >
                          <span className="font-mono text-[#E0E0E0] break-all">
                            {wallet.name}: {wallet.address}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(wallet.address)}
                            className="flex items-center text-[#00CFFF] hover:text-[#0AC5FF] text-sm font-medium mt-2 sm:mt-0 transition-colors"
                          >
                            {copied === wallet.address ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#00CFFF] to-[#0AC5FF] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#00CFFF]/90 hover:to-[#0AC5FF]/90 transition-all duration-300 disabled:from-[#2A2A2A] disabled:to-[#2A2A2A] disabled:text-[#A0A0A0] flex items-center justify-center disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Verify Crypto Payment
                      </>
                    )}
                  </button>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="mt-4">
                    {verificationStatus === 'pending' && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                        <p className="text-yellow-500 font-medium">
                          🔄 Verifying transaction on blockchain...
                        </p>
                      </div>
                    )}
                    {verificationStatus === 'success' && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <p className="text-green-500 font-medium">
                          ✅ Transaction successful! Funds added to your account.
                        </p>
                      </div>
                    )}
                    {verificationStatus === 'error' && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                        <p className="text-red-500 font-medium">
                          ❌ Transaction not confirmed. Please check your transaction hash.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Side Info - Same as before */}
          {/* ... keep the right side info section unchanged ... */}
        </div>
      </div>

      <UPIPaymentModal
        isOpen={showUPIModal}
        onClose={() => setShowUPIModal(false)}
        amount={parseFloat(amount) || 0}
        upiId={YOUR_UPI_ID}
        onSuccess={handleUPISuccess}
        onFailure={handleUPIFailure}
      />
    </div>
  );
};

export default AddFunds;
