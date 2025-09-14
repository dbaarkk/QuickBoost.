import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Package
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, Order } from '../lib/supabase';

const MyOrders: React.FC = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error } = await getUserOrders(user.id);
        if (error) {
          setError('Failed to load orders');
          setOrders([]);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        setError('Failed to load orders');
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
      case 'in_progress': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'pending': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Successful';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <nav className="flex items-center space-x-4">
              <Link to="/place-order" className="text-[#A0A0A0] hover:text-[#00CFFF] text-sm font-medium transition-colors">Place Order</Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#A0A0A0]">Balance:</span>
                <span className="text-sm font-semibold text-[#00CFFF]">₹{(profile?.balance ?? 0).toFixed(2)}</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/dashboard"
            className="flex items-center text-[#A0A0A0] hover:text-[#00CFFF] transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E0E0E0] mb-2 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3 text-[#00CFFF]" />
            My Orders
          </h1>
          <p className="text-[#A0A0A0]">Track and manage all your orders in one place</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-lg p-4 mb-6">
            <p className="text-[#FF5C5C]">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {!error && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-[#2A2A2A] rounded-2xl p-12 max-w-md mx-auto">
                  <ShoppingCart className="h-16 w-16 text-[#A0A0A0] mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-[#E0E0E0] mb-3">You don't have any orders</h3>
                  <p className="text-[#A0A0A0] mb-6">Start by placing your first order to boost your social media presence</p>
                  <Link
                    to="/place-order"
                    className="inline-flex items-center bg-gradient-to-r from-[#00CFFF] to-[#0AC5FF] hover:from-[#0AC5FF] hover:to-[#00CFFF] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-[#00CFFF]/25"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Place Your First Order
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A] p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div className="bg-[#00CFFF]/20 p-3 rounded-xl">
                          <Package className="h-6 w-6 text-[#00CFFF]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#E0E0E0]">
                            {order.service?.name || 'Unknown Service'}
                          </h3>
                          <p className="text-sm text-[#A0A0A0]">Order #{order.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#E0E0E0]">₹{order.amount.toFixed(2)}</div>
                          <div className="text-sm text-[#A0A0A0]">{order.quantity.toLocaleString()} items</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-[#1E1E1E] p-3 rounded-lg">
                        <div className="text-sm text-[#A0A0A0] mb-1">Platform</div>
                        <div className="font-medium text-[#E0E0E0]">{order.service?.platform || 'N/A'}</div>
                      </div>
                      <div className="bg-[#1E1E1E] p-3 rounded-lg">
                        <div className="text-sm text-[#A0A0A0] mb-1">Category</div>
                        <div className="font-medium text-[#E0E0E0]">{order.service?.category || 'N/A'}</div>
                      </div>
                      <div className="bg-[#1E1E1E] p-3 rounded-lg">
                        <div className="text-sm text-[#A0A0A0] mb-1">Progress</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-[#2A2A2A] rounded-full h-2">
                            <div
                              className="bg-[#00CFFF] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-[#E0E0E0]">{order.progress}%</span>
                        </div>
                      </div>
                      <div className="bg-[#1E1E1E] p-3 rounded-lg">
                        <div className="text-sm text-[#A0A0A0] mb-1 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Order Date
                        </div>
                        <div className="font-medium text-[#E0E0E0] text-sm">{formatDate(order.created_at)}</div>
                      </div>
                    </div>

                    {order.link && (
                      <div className="bg-[#1E1E1E] p-3 rounded-lg">
                        <div className="text-sm text-[#A0A0A0] mb-2">Target Link</div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-[#E0E0E0] break-all">{order.link}</span>
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00CFFF] hover:text-[#0AC5FF] transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;