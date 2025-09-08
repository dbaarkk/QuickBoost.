import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Wallet,
  Smartphone,
  Copy,
  CheckCircle,
  Shield,
  Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createDeposit } from '../lib/supabase';

const wallets = [
  { name: 'Solana', address: '99q2VEJtZjt56UjJuSLb45mkdrAnA4Lsb7q33uKUQo1P' },
  { name: 'Ethereum', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Base', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Sui', address: '0xed8bb93f61609b27a2d586c658c17715f6fc6cfa8166b41aea6cad7f57f35d10' },
  { name: 'Polygon', address: '0x9B4Eac49Ea99e73655Ad0ADA11bEAE7E1E326EB7' },
  { name: 'Bitcoin', address: 'bc1qt3vl6de9j7q7lrmmwx2g3fnaf0m0cmmk9ct4f9' },
];

const AddFunds: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [txid, setTxid] = useState('');
  const [copied, setCopied] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleAmountSelect = (value: number) => setAmount(value.toString());

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setSubmitError('Please enter a valid amount');
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
      payment_method: paymentMethod as 'upi' | 'crypto',
      ...(paymentMethod === 'upi' ? { utr_number: utrNumber } : { txid })
    };

    createDeposit(depositData).then(({ data, error }) => {
      if (error) {
        setSubmitError(error.message);
      } else {
        setShowSuccess(true);
        setAmount('');
        setUtrNumber('');
        setTxid('');
        setTimeout(() => setShowSuccess(false), 5000);
      }
      setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link to="/" className="flex items-center">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">QuickBoost</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Funds to Your Account</h1>
          <p className="text-gray-600">Add money to your account to start placing orders instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Success Message */}
                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-800 font-medium">
                      ✅ Transaction is being verified, please wait 1-2 minutes
                    </span>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{submitError}</p>
                  </div>
                )}

                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount (₹)</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleAmountSelect(value)}
                        className={`p-4 text-center border rounded-xl font-semibold transition-all hover:scale-105 ${
                          amount === value.toString()
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                    min="10"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Payment Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="ml-4 flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <Smartphone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">UPI Payment</div>
                          <div className="text-sm text-gray-500">Pay via PhonePe, Google Pay, Paytm</div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="crypto"
                        checked={paymentMethod === 'crypto'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="ml-4 flex items-center">
                        <div className="bg-orange-100 p-2 rounded-lg mr-3">
                          <Smartphone className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Cryptocurrency</div>
                          <div className="text-sm text-gray-500">Bitcoin, Ethereum, Solana, etc.</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Verification Fields */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Enter 12-digit UTR number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />

                    {/* UPI QR and ID */}
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <img
                        src="/IMG_20250906_102052.jpg"
                        alt="UPI QR"
                        className="h-32 w-32 mx-auto mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-2">
                        Scan this QR code with your UPI app
                      </p>
                      <div className="flex justify-center items-center bg-white p-2 rounded-lg border">
                        <span className="font-mono text-gray-900 mr-3">6263288522@upi</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('6263288522@upi')}
                          className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          {copied === '6263288522@upi' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={txid}
                      onChange={(e) => setTxid(e.target.value)}
                      placeholder="Enter transaction hash/ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                    {/* Wallets */}
                    <div className="space-y-2">
                      {wallets.map((wallet) => (
                        <div
                          key={wallet.name}
                          className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-lg p-3 border break-words"
                        >
                          <span className="font-mono text-gray-900 break-all">
                            {wallet.name}: {wallet.address}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(wallet.address)}
                            className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 sm:mt-0"
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
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center"
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
            {/* Current Balance */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Balance</h3>
                  <p className="text-3xl font-bold text-green-600">₹{profile?.balance.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              {amount && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    After adding ₹{amount}, your balance will be:{' '}
                    <span className="font-semibold text-gray-900 ml-1">
                      ₹{((profile?.balance || 0) + parseFloat(amount || '0')).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Security & Support */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Security & Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">100% Secure</div>
                    <div className="text-sm text-gray-600">All transactions are encrypted and secure</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Instant Credit</div>
                    <div className="text-sm text-gray-600">Funds are credited within 5-10 minutes</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Smartphone className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Contact Us</div>
                    <div className="text-sm text-gray-600">Email: quickboostbusiness@gmail.com</div>
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
                      placeholder="Enter amount paid"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="10"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Enter 12-digit UTR number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />

                    {/* UPI QR and ID */}
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <img
                        src="/IMG_20250906_102052.jpg"
                        alt="UPI QR"
                        className="h-32 w-32 mx-auto mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-2">
                        Scan this QR code with your UPI app
                      </p>
                      <div className="flex justify-center items-center bg-white p-2 rounded-lg border">
                        <span className="font-mono text-gray-900 mr-3">aaryaveer@upi</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('aaryaveer@upi')}
                          className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          {copied === 'aaryaveer@upi' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="space-y-4">
                    <input
                      type="number"
                      placeholder="Enter amount paid in USD"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="1"
                      step="0.01"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Enter transaction hash/ID"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                    {/* Wallets */}
                    <div className="space-y-2">
                      {wallets.map((wallet) => (
                        <div
                          key={wallet.name}
                          className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-lg p-3 border break-words"
                        >
                          <span className="font-mono text-gray-900 break-all">
                            {wallet.name}: {wallet.address}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(wallet.address)}
                            className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 sm:mt-0"
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {paymentMethod === 'upi' ? 'Verify UPI Payment' : 'Verify Crypto Payment'}
                </button>

                {showSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center mt-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-800 font-medium">
                      ✅ Transaction is being verified, please wait 1-2 minutes
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="space-y-4">
            {/* Current Balance */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Balance</h3>
                  <p className="text-3xl font-bold text-green-600">₹{currentBalance.toFixed(2)}</p>
                </div>
              </div>
              {amount && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    After adding ₹{amount}, your balance will be:{' '}
                    <span className="font-semibold text-gray-900 ml-1">
                      ₹{(currentBalance + parseFloat(amount || '0')).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Security & Support */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Security & Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">100% Secure</div>
                    <div className="text-sm text-gray-600">All transactions are encrypted and secure</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Instant Credit</div>
                    <div className="text-sm text-gray-600">Funds are credited within 5-10 minutes</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Smartphone className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Contact Us</div>
                    <div className="text-sm text-gray-600">Email: quickboostbusiness@gmail.com</div>
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
