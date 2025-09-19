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
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createDeposit, getUserDeposits, updateDepositStatus, updateUserBalance, Deposit } from '../lib/supabase';
import { verifyCryptoPayment } from '../lib/cryptoVerification';

const wallets = [
  { name: 'Solana', address: '99q2VEJtZjt56UjJuSLb45mkdrAnA4Lsb7q33uKUQo1P' },
  { name: 'Ethereum', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Base', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Polygon', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Bitcoin', address: 'bc1qt3vl6de9j7q7lrmmwx2g3fnaf0m0cmmk9ct4f9' },
];

// Add this function to check if user is admin
const isAdmin = (email: string | undefined) => {
  if (!email) return false;
  const adminEmails = ['admin@quickboost.com', 'quickboostbusiness@gmail.com', 'your-email@gmail.com'];
  return adminEmails.includes(email);
};

const AddFunds: React.FC = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'crypto'>('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [txid, setTxid] = useState('');
  const [copied, setCopied] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'pending' | 'error' | ''>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null); // Track which deposit is being verified

  // Check if current user is admin
  const userIsAdmin = isAdmin(user?.email);

  // Different predefined amounts for UPI and Crypto
  const upiAmounts = [100, 500, 1000, 2000, 5000, 10000];
  const cryptoAmounts = [10, 20, 50, 100, 200, 1000];
  const currentAmounts = paymentMethod === 'upi' ? upiAmounts : cryptoAmounts;

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

  const handleRefreshBalance = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      await refreshProfile();
      // Also refresh deposits
      const { data } = await getUserDeposits(user.id);
      if (data) setDeposits(data);
    } catch (error) {
      console.error('Error refreshing balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (!amount || amountValue <= 0) {
      setSubmitError('Please enter a valid amount');
      return;
    }
    
    // Different minimum amounts for UPI and Crypto
    if (paymentMethod === 'upi' && amountValue < 10) {
      setSubmitError('Minimum deposit amount is ₹10 for UPI');
      return;
    }
    
    if (paymentMethod === 'crypto' && amountValue < 1) {
      setSubmitError('Minimum deposit amount is $1 for crypto');
      return;
    }

    if (paymentMethod === 'upi' && !utrNumber) {
      setSubmitError('Please enter UTR number');
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
      
      // Only verify crypto payments automatically
      if (paymentMethod === 'crypto') {
        const verification = await verifyCryptoPayment(txid, 'auto');
        
        if (verification.success) {
          depositStatus = 'success';
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
        ...(paymentMethod === 'upi' ? { 
          utr_number: utrNumber 
        } : { 
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
        setUtrNumber('');
        setTxid('');
        
        // Update the user's balance in the database and AuthContext
        if (depositStatus === 'success' && user) {
          const newBalance = (profile?.balance || 0) + amountValue;
          
          // Update in database
          const { error: updateError } = await updateUserBalance(user.id, newBalance);
          
          if (!updateError) {
            // Refresh profile to get updated balance
            await refreshProfile();
          } else {
            console.error('Error updating balance:', updateError);
          }
        }
        
        // Refresh deposits list
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

  // Function to manually verify a deposit
  const handleVerifyDeposit = async (depositId: string, depositAmount: number) => {
    if (!userIsAdmin) return; // Only admins can verify
    
    setVerifyingId(depositId);
    
    try {
      const { error } = await updateDepositStatus(depositId, 'success');
      
      if (error) {
        console.error('Error verifying deposit:', error);
        setSubmitError('Failed to verify deposit. Please try again.');
        return;
      }
      
      // Update the deposit in local state
      setDeposits(prevDeposits => 
        prevDeposits.map(deposit => 
          deposit.id === depositId 
            ? { ...deposit, status: 'success' } 
            : deposit
        )
      );
      
      // Update balance if the deposit was successful
      if (user) {
        const newBalance = (profile?.balance || 0) + depositAmount;
        
        // Update in database
        const { error: updateError } = await updateUserBalance(user.id, newBalance);
        
        if (!updateError) {
          // Refresh profile to get updated balance
          await refreshProfile();
          setSubmitError(''); // Clear any previous errors
        } else {
          console.error('Error updating balance:', updateError);
          setSubmitError('Balance updated but deposit status may not have changed.');
        }
      }
    } catch (error) {
      console.error('Error verifying deposit:', error);
      setSubmitError('An unexpected error occurred during verification.');
    } finally {
      setVerifyingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Success';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#1E1E1E] shadow-lg border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link to="/" className="flex items-center">
              <TrendingUp className="h-6 w-6 text-[#00CFFF]" />
              <span className="ml-2 text-xl font-bold text-[#E0E0E0]">QuickBoost</span>
            </Link>
            {userIsAdmin && (
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                Admin Mode
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#E0E0E0] mb-1">Add Funds to Your Account</h1>
          <p className="text-[#A0A0A0]">Add money to your account to start placing orders instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Payment Form */}
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
                        : '✅ Transaction submitted for verification. Please wait 1-2 minutes.'}
                    </span>
                  </div>
                )}

                {submitError && (
                  <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-lg p-3">
                    <p className="text-[#FF5C5C] text-sm">{submitError}</p>
                  </div>
                )}

                {/* ... (rest of the form remains the same) ... */}
              </form>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="space-y-4">
            <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A] p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-[#00CFFF]/20 p-3 rounded-xl mr-4">
                    <Wallet className="h-6 w-6 text-[#00CFFF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#E0E0E0]">Current Balance</h3>
                    <p className="text-3xl font-bold text-[#00CFFF]">₹{profile?.balance?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                <button
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing}
                  className="p-2 bg-[#1E1E1E] rounded-lg hover:bg-[#2A2A2A] transition-colors"
                  title="Refresh balance"
                >
                  <RefreshCw className={`h-5 w-5 text-[#00CFFF] ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {amount && (
                <div className="bg-[#1E1E1E] rounded-lg p-4 border border-[#2A2A2A]">
                  <p className="text-sm text-[#A0A0A0]">
                    After adding {paymentMethod === 'upi' ? '₹' : '$'}{amount}, your balance will be:{' '}
                    <span className="font-semibold text-[#E0E0E0] ml-1">
                      ₹{((profile?.balance || 0) + parseFloat(amount || '0')).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Recent Deposits */}
            <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A]">
              <div className="p-4 border-b border-[#2A2A2A] flex items-center">
                <History className="h-5 w-5 text-[#A0A0A0] mr-2" />
                <h3 className="text-lg font-semibold text-[#E0E0E0]">Recent Deposits</h3>
              </div>
              
              {deposits.length > 0 ? (
                <div className="divide-y divide-[#2A2A2A]">
                  {deposits.slice(0, 5).map((deposit) => (
                    <div key={deposit.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#E0E0E0]">₹{deposit.amount.toFixed(2)}</span>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                            {getStatusLabel(deposit.status)}
                          </span>
                          {deposit.status === 'pending' && userIsAdmin && (
                            <button
                              onClick={() => handleVerifyDeposit(deposit.id, deposit.amount)}
                              disabled={verifyingId === deposit.id}
                              className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                              {verifyingId === deposit.id ? 'Verifying...' : 'Verify'}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-[#A0A0A0]">
                        <div className="flex justify-between">
                          <span>{deposit.payment_method.toUpperCase()}</span>
                          <span>{new Date(deposit.created_at).toLocaleDateString()}</span>
                        </div>
                        {deposit.utr_number && (
                          <div className="mt-1">UTR: {deposit.utr_number}</div>
                        )}
                        {deposit.txid && (
                          <div className="mt-1">TXID: {deposit.txid?.slice(0, 20)}...</div>
                        )}
                        {deposit.crypto_type && (
                          <div className="mt-1">Network: {deposit.crypto_type.toUpperCase()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-[#A0A0A0]">No deposits yet</p>
                </div>
              )}
            </div>

            {/* ... (rest of the component remains the same) ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
