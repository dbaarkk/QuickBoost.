import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  ShoppingCart, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  BarChart3 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, Order } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch recent orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      setOrdersLoading(true);

      const { data, error } = await getUserOrders(user.id);
      if (error) {
        console.error("Error fetching orders:", error);
        setRecentOrders([]);
      } else if (data) {
        const sorted = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecentOrders(sorted.slice(0, 5));
      } else {
        setRecentOrders([]);
      }

      setOrdersLoading(false);
    };

    fetchOrders();
  }, [user]);

  const quickActions = [
    {
      title: 'Place New Order',
      description: 'Browse services and place orders',
      icon: <ShoppingCart className="h-6 w-6" />,
      link: '/place-order',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      title: 'Add Funds',
      description: 'Add money to your account',
      icon: <Plus className="h-6 w-6" />,
      link: '/add-funds',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'View Services',
      description: 'Browse all available services',
      icon: <Eye className="h-6 w-6" />,
      link: '/services',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending': return <Eye className="h-5 w-5 text-blue-500" />;
      default: return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'in_progress': return 'text-yellow-700 bg-yellow-100';
      case 'pending': return 'text-blue-700 bg-blue-100';
      default: return 'text-red-700 bg-red-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Show loading if auth or profile is still loading
  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
              <Link to="/add-funds" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Add Funds</Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="text-sm font-semibold text-green-600">₹{profile?.balance?.toFixed(2) ?? 0}</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Welcome Section */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {profile?.first_name ?? 'User'}!</h1>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Account Balance</p>
                <p className="text-xl font-bold text-gray-900">₹{profile?.balance?.toFixed(2) ?? 0}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-2">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <Link
                to="/add-funds"
                className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-500 font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Funds
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{profile?.total_orders ?? 0}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">₹{profile?.total_spent?.toFixed(2) ?? 0}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} text-white p-4 rounded-lg transition-all hover:scale-105 hover:shadow-lg group`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      {action.icon}
                      <span className="ml-2 text-sm font-semibold">{action.title}</span>
                    </div>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-indigo-600 hover:text-indigo-500 text-xs font-medium">
              View All
            </Link>
          </div>

          {ordersLoading ? (
            <div className="p-4 text-center">Loading orders...</div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</div>
                          <div className="text-sm text-gray-600">{order.service?.name || 'Unknown Service'}</div>
                          <div className="text-xs text-gray-500">{order.quantity.toLocaleString()} items</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{order.progress}%</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ₹{order.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start by placing your first order</p>
              <Link
                to="/place-order"
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Place First Order
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
