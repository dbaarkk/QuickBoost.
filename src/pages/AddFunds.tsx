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
import { createDeposit, getUserDeposits, updateUserBalance, Deposit } from '../lib/supabase';
import { verifyCryptoPayment } from '../lib/cryptoVerification';

const wallets = [
  { name: 'Solana', address: '99q2VEJtZjt56UjJuSLb45mkdrAnA4Lsb7q33uKUQo1P' },
  { name: 'Ethereum', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Base', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Polygon', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Bitcoin', address: 'bc1qt3vl6de9j7q7lrmmwx2g3fnaf0m0cmmk9ct4f9' },
];

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

  const upiAmounts = [100, 500, 1000, 2000, 5000, 10000];
  const cryptoAmounts = [10, 20, 50, 100, 200, 1000];
  const currentAmounts = paymentMethod === 'upi' ? upiAmounts : cryptoAmounts;

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
        ...(paymentMethod === 'upi'
          ? { utr_number: utrNumber }
          : { txid, crypto_type: 'auto' }),
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
        if (depositStatus === 'success' && user) {
          const newBalance = (profile?.balance || 0) + amountValue;
          const { error: updateError } = await updateUserBalance(user.id, newBalance);
          if (!updateError) await refreshProfile();
        }
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
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Left side is unchanged */}
        {/* ... */}

        {/* Right Side Info */}
        <div className="space-y-4">
          {/* Balance card unchanged */}
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
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                        {getStatusLabel(deposit.status)}
                      </span>
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
          {/* Security & Support unchanged */}
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
