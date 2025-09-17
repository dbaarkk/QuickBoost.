import React, { useState, useEffect } from 'react';
import { X, Smartphone, ExternalLink, CheckCircle } from 'lucide-react';
import { UPIDeepLinkService } from '../lib/upiDeepLink';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  upiId: string;
  onSuccess: () => void;
  onFailure: () => void;
}

const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  upiId,
  onSuccess,
  onFailure
}) => {
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [availableApps, setAvailableApps] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      checkAvailableApps();
      // Listen for app return
      window.addEventListener('focus', checkPaymentStatus);
    }
    
    return () => {
      window.removeEventListener('focus', checkPaymentStatus);
    };
  }, [isOpen]);

  const checkAvailableApps = async () => {
    // Simulate checking available apps
    const apps = ['phonepe', 'gpay', 'paytm', 'bhim'];
    setAvailableApps(apps);
  };

  const checkPaymentStatus = () => {
    // In real implementation, you'd check your backend
    // For demo, we'll simulate success
    setTimeout(() => {
      setPaymentStatus('success');
      onSuccess();
    }, 2000);
  };

  const handleAppSelect = (appName: string) => {
    setSelectedApp(appName);
    const links = UPIDeepLinkService.generateUPILink(amount, upiId);
    const appLink = links.apps.find(app => app.name.toLowerCase() === appName.toLowerCase());
    
    if (appLink) {
      UPIDeepLinkService.openUPIApp(
        appLink.url,
        `https://play.google.com/store/search?q=${appName}`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Pay via UPI</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {paymentStatus === 'pending' ? (
          <>
            {/* Amount Display */}
            <div className="text-center mb-6">
              <p className="text-gray-600">Amount to pay</p>
              <p className="text-3xl font-bold text-green-600">₹{amount}</p>
              <p className="text-sm text-gray-500 mt-1">to {upiId}</p>
            </div>

            {/* UPI Apps Selection */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">Choose your UPI app:</p>
              
              {availableApps.map((app) => (
                <button
                  key={app}
                  onClick={() => handleAppSelect(app)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-800 capitalize">{app}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 After payment, return to this app. Your balance will be updated automatically.
              </p>
            </div>
          </>
        ) : paymentStatus === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">₹{amount} has been added to your account</p>
            <button
              onClick={onClose}
              className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Payment Failed</h3>
            <p className="text-gray-600">Please try again or contact support</p>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPIPaymentModal;
