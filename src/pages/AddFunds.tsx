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
  History
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createDeposit, getUserDeposits, Deposit } from '../lib/supabase';

const wallets = [
  { name: 'Solana', address: '99q2VEJtZjt56UjJuSLb45mkdrAnA4Lsb7q33uKUQo1P' },
  { name: 'Ethereum', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Base', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Sui', address: '0xed8bb93f61609b27a2d586c658c17715f6fc6cfa8166b41aea6cad7f57f35d10' },
  { name: 'Polygon', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Bitcoin', address: 'bc1qt3vl6de9j7q7lrmmwx2g3fnaf0m0cmmk9ct4f9' },
];

const AddFunds: React.FC = () => {
  const { profile, user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'crypto'>('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [txid, setTxid] = useState('');
  const [copied, setCopied] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (!amount || amountValue <= 0) {
      setSubmitError('Please enter a valid amount');
      return;
    }
    
    if (amountValue < 10) {
      setSubmitError('Minimum deposit amount is ₹10');
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

    const depositData = {
      amount: parseFloat(amount),
      payment_method: paymentMethod,
      ...(paymentMethod === 'upi' ? { utr_number: utrNumber } : { txid }),
    };

    createDeposit(depositData).then(({ data, error }) => {
      if (error) {
        setSubmitError(error.message);
      } else {
        setShowSuccess(true);
        setAmount('');
        setUtrNumber('');
        setTxid('');
        // Refresh deposits list
        if (user) {
          getUserDeposits(user.id).then(({ data }) => {
            if (data) setDeposits(data);
          });
        }
        setTimeout(() => setShowSuccess(false), 5000);
      }
      setIsSubmitting(false);
    });
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
                      ✅ Transaction is being verified, please wait 1-2 minutes
                    </span>
                  </div>
                )}

                {submitError && (
                  <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-lg p-3">
                    <p className="text-[#FF5C5C] text-sm">{submitError}</p>
                  </div>
                )}

                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Select Amount (₹)</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((value) => (
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
                        ₹{value}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00CFFF] focus:border-[#00CFFF] transition-all duration-300 text-lg"
                    min={10}
                    required
                  />
                  <div className="mt-2 flex items-center text-sm text-[#FF5C5C]">
                    <AlertTriangle className="h-4 w-4 mr-1 text-[#FF5C5C]" />
                    <span>Minimum deposit amount is ₹10</span>
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
                        onChange={(e) => setPaymentMethod(e.target.value as 'upi' | 'crypto')}
                        className="text-[#00CFFF] focus:ring-[#00CFFF]"
                      />
                      <div className="ml-4 flex items-center">
                        <div className="bg-[#00CFFF]/20 p-2 rounded-lg mr-3">
                          <Smartphone className="h-5 w-5 text-[#00CFFF]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#E0E0E0]">UPI Payment</div>
                          <div className="text-sm text-[#A0A0A0]">Pay via PhonePe, Google Pay, Paytm</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-[#2A2A2A] rounded-xl cursor-pointer hover:bg-[#1E1E1E] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="crypto"
                        checked={paymentMethod === 'crypto'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'upi' | 'crypto')}
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

                {/* Verification Fields */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="bg-[#00CFFF]/10 rounded-xl p-4 mb-4 border border-[#00CFFF]/30">
                      <h4 className="font-medium text-[#00CFFF] mb-2">UPI Payment Instructions:</h4>
                      <ol className="text-sm text-[#E0E0E0] space-y-1">
                        <li>1. Pay the exact amount to the UPI ID below</li>
                        <li>2. Submit your 12-digit UTR number</li>
                        <li>3. Wait 2-5 minutes for verification</li>
                      </ol>
                    </div>
                    
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Enter 12-digit UTR number"
                      className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00CFFF] focus:border-[#00CFFF] transition-all duration-300"
                      required
                    />

                    <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-[#2A2A2A]">
                      <img
                        src="/IMG_20250906_102052.jpg"
                        alt="UPI QR"
                        className="h-32 w-32 mx-auto mb-3"
                      />
                      <p className="text-sm text-[#A0A0A0] mb-2">
                        Scan this QR code with your UPI app
                      </p>
                      <div className="flex justify-center items-center bg-[#2A2A2A] p-2 rounded-lg border border-[#2A2A2A]">
                        <span className="font-mono text-[#E0E0E0] mr-3">aaryaveer@upi</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('aaryaveer@upi')}
                          className="flex items-center text-[#00CFFF] hover:text-[#0AC5FF] text-sm font-medium transition-colors"
                        >
                          {copied === 'aaryaveer@upi' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="space-y-4">
                    <div className="bg-[#7B61FF]/10 rounded-xl p-4 mb-4 border border-[#7B61FF]/30">
                      <h4 className="font-medium text-[#7B61FF] mb-2">Crypto Payment Instructions:</h4>
                      <ol className="text-sm text-[#E0E0E0] space-y-1">
                        <li>1. Send the exact amount to the wallet address</li>
                        <li>2. Submit your transaction ID (TXID)</li>
                        <li>3. Wait 2-5 minutes for verification</li>
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-accent disabled:from-[#2A2A2A] disabled:to-[#2A2A2A] py-3 px-6 flex items-center justify-center disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {paymentMethod === 'upi' ? 'Verify UPI Payment' : 'Verify Crypto Payment'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="space-y-4">
            <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A] p-4">
              <div className="flex items-center mb-4">
                <div className="bg-[#00CFFF]/20 p-3 rounded-xl mr-4">
                  <Wallet className="h-6 w-6 text-[#00CFFF]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#E0E0E0]">Current Balance</h3>
                  <p className="text-3xl font-bold text-[#00CFFF]">₹{profile?.balance.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              {amount && (
                <div className="bg-[#1E1E1E] rounded-lg p-4 border border-[#2A2A2A]">
                  <p className="text-sm text-[#A0A0A0]">
                    After adding ₹{amount}, your balance will be:{' '}
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
                          <div className="mt-1">TXID: {deposit.txid.slice(0, 20)}...</div>
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

            <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A] p-4">
              <h3 className="text-base font-semibold text-[#E0E0E0] mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#00CFFF]" />
                Security & Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-[#00CFFF] mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#E0E0E0]">100% Secure</div>
                    <div className="text-sm text-[#A0A0A0]">All transactions are encrypted and secure</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-[#7B61FF] mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#E0E0E0]">Instant Credit</div>
                    <div className="text-sm text-[#A0A0A0]">Funds are credited within 2-5 minutes</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Smartphone className="h-5 w-5 text-[#A085FF] mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-[#E0E0E0]">Contact Us</div>
                    <div className="text-sm text-[#A0A0A0]">Email: quickboostbusiness@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
