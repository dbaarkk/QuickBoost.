// components/OrderForm.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { placeOrder } from '../lib/orders';
import { detectPlatform, PLATFORMS } from '../lib/socialUtils';

const OrderForm = ({ service }) => {
  const { user, profile, refreshProfile } = useAuth();
  const [profileUrl, setProfileUrl] = useState('');
  const [quantity, setQuantity] = useState(service.min_amount || 100);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculateAmount = () => {
    return (quantity * service.rate_per_1000) / 1000;
  };

  const handlePlaceOrder = async () => {
    setError('');
    setSuccess('');

    if (!profileUrl) {
      setError('Please enter a profile URL');
      return;
    }

    if (!user) {
      setError('Please login to place an order');
      return;
    }

    const amount = calculateAmount();
    if (profile.balance < amount) {
      setError('Insufficient balance');
      return;
    }

    const { data, error: orderError } = await placeOrder({
      user_id: user.id,
      service_id: service.id,
      profile_url: profileUrl,
      quantity: quantity,
      amount: amount,
      platform: service.platform
    });

    if (orderError) {
      setError(orderError);
    } else {
      setSuccess(`Order placed successfully! Order ID: ${data.id}`);
      setProfileUrl('');
      setQuantity(service.min_amount || 100);
      refreshProfile();
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Place Order for {service.name}</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            {PLATFORMS[service.platform]?.name || 'Profile'} URL
          </label>
          <input
            type="text"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder={PLATFORMS[service.platform]?.example || 'Enter profile URL'}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Quantity (Min: {service.min_amount || 100})
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={service.min_amount || 100}
            max={service.max_amount || 100000}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="bg-white p-3 rounded">
          <p className="text-sm">
            Amount: ${calculateAmount().toFixed(2)} 
            (${service.rate_per_1000} per 1000)
          </p>
          <p className="text-sm">Your Balance: ${profile?.balance.toFixed(2)}</p>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}

        <button
          onClick={handlePlaceOrder}
          disabled={!profileUrl || profile?.balance < calculateAmount()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
        >
          Place Order - ${calculateAmount().toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
