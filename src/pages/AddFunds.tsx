import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Wallet, CreditCard, Smartphone, Copy, CheckCircle } from 'lucide-react';

const AddFunds: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [copied, setCopied] = useState(false);

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('quickboost@paytm');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission logic here
    console.log('Payment submitted:', { amount, paymentMethod });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">QuickBoost</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link to="/services" className="text-gray-700 hover:text-indigo-600">Services</Link>
              <Link to="/add-funds" className="text-indigo-600 font-medium">Add Funds</Link>
              <button className="text-gray-700 hover:text-red-600">Logout</button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Funds</h1>
          <p className="text-gray-600">Add money to your account to start placing orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Amount (₹)
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleAmountSelect(value)}
                      className={`p-3 text-center border rounded-lg font-medium transition-colors ${
                        amount === value.toString()
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-indigo-300'
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="10"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Minimum amount: ₹10</p>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <Smartphone className="h-5 w-5 text-gray-400 ml-3 mr-3" />
                    <span className="text-gray-900 font-medium">UPI Payment</span>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <CreditCard className="h-5 w-5 text-gray-400 ml-3 mr-3" />
                    <span className="text-gray-900 font-medium">Credit/Debit Card</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!amount}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-colors"
              >
                Proceed to Payment
              </button>
            </form>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-6">
            {/* UPI Instructions */}
            {paymentMethod === 'upi' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">UPI Payment Instructions</h3>
                
                {/* QR Code Placeholder */}
                <div className="bg-gray-100 rounded-lg p-8 text-center mb-4">
                  <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Paste your UPI QR code here</p>
                    </div>
                  </div>
                </div>

                {/* UPI ID */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Or pay directly to UPI ID:</p>
                  <div className="flex items-center justify-between bg-white rounded-md p-3 border">
                    <span className="font-mono text-gray-900">quickboost@paytm</span>
                    <button
                      onClick={handleCopyUPI}
                      className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Steps to pay:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Open your UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
                    <li>Scan the QR code or enter the UPI ID</li>
                    <li>Enter the amount: ₹{amount || '0'}</li>
                    <li>Complete the payment</li>
                    <li>Your account will be credited within 5-10 minutes</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Card Instructions */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Payment</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>You will be redirected to our secure payment gateway to complete your transaction.</p>
                  <p><strong>We accept:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Visa, MasterCard, RuPay</li>
                    <li>All major debit and credit cards</li>
                    <li>Net Banking</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Current Balance */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Wallet className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Current Balance</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">₹1,250.50</p>
              {amount && (
                <p className="text-sm text-gray-600">
                  After adding ₹{amount}, your balance will be: <strong>₹{(0 + parseFloat(amount || '0')).toFixed(2)}</strong>
                </p>
              )}
            </div>

            {/* Support */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600">
                If you face any issues with payment, contact our support team at{' '}
                <a href="mailto:support@quickboost.com" className="text-indigo-600 hover:text-indigo-500">
                  support@quickboost.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
