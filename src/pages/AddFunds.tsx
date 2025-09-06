import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Copy, 
  CheckCircle,
  Plus,
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react';
const AddFunds: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [copied, setCopied] = useState(false);
  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];
  const currentBalance = 0;
  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };
  const handleCopyUPI = () => {
    navigator.clipboard.writeText('aaryaveer@indianbank');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Payment submitted:', { amount, paymentMethod });
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
            <nav className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Dashboard</Link>
              <Link to="/services" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Services</Link>
              <Link to="/place-order" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Place Order</Link>
              <Link to="/add-funds" className="text-indigo-600 text-sm font-medium">Add Funds</Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="text-sm font-semibold text-green-600">₹{currentBalance.toFixed(2)}</span>
              </div>
            </nav>
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
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4">
                {/* Amount Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Amount (₹)
                  </label>
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
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter custom amount"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                      min="10"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-500">₹</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Minimum amount: ₹10</p>
                </div>
                {/* Payment Method */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose Payment Method
                  </label>
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
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="ml-4 flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Credit/Debit Card</div>
                          <div className="text-sm text-gray-500">Visa, MasterCard, RuPay</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!amount}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>
          {/* Payment Instructions & Info */}
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
                    After adding ₹{amount}, your balance will be: 
                    <span className="font-semibold text-gray-900 ml-1">
                      ₹{(currentBalance + parseFloat(amount || '0')).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </div>
            {/* UPI Instructions */}
            {paymentMethod === 'upi' && (
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                  UPI Payment Instructions
                </h3>
                
                {/* QR Code Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center mb-4">
                  <div className="w-32 h-32 bg-white rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 mb-3">
                    <div className="text-center">
                      <img src="/IMG_20250906_102052.jpg" alt="UPI QR Code" className="h-32 w-32 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Scan QR Code</p>
                      <p className="text-xs text-gray-400">with any UPI app</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan this QR code with your UPI app to pay ₹{amount || '0'}
                  </p>
                </div>
                {/* UPI ID */}
                <div className="bg-blue-50 rounded-xl p-3 mb-4">
                  <p className="text-sm text-gray-600 mb-3">Or pay directly to UPI ID:</p>
                  <div className="flex items-center justify-between bg-white rounded-lg p-4 border">
                    <span className="font-mono text-gray-900 font-medium">aaryaveer@indianbank</span>
                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
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
                {/* Steps */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Payment Steps:</h4>
                  <div className="space-y-2">
                    {[
                      'Open your UPI app (PhonePe, Google Pay, Paytm, etc.)',
                      'Scan the QR code or enter the UPI ID',
                      `Enter the amount ₹${amount || ''}`,
                      'Complete the payment',
                      'Your account will be credited within 5-10 minutes'
                    ].map((step, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Card Instructions */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Card Payment
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">
                      You will be redirected to our secure payment gateway to complete your transaction.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">We Accept:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Visa, MasterCard, RuPay
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        All major debit and credit cards
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Net Banking
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
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
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-600">
                    If you face any issues with payment, contact our support team at{' '}
                    <a href="mailto:support@quickboost.com" className="text-indigo-600 hover:text-indigo-500 font-medium">
                      quickboostbusiness@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Transactions</h3>
              <div className="text-center py-4">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400">Your recent transactions will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddFunds;
