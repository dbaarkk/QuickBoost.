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
  const { user, profile } = useAuth();
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
              <Link to="/add-funds" className="text-[#A0A0A0] hover:text-[#00CFFF] text-sm font-medium transition-colors">Add Funds</Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#A0A0A0]">Balance:</span>
                <span className="text-sm font-semibold text-[#00CFFF]">₹{profile?.balance?.toFixed(2) ?? 0}</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Welcome Section */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#E0E0E0] mb-1">Welcome back, {profile?.first_name ?? 'User'}!</h1>
          <p className="text-[#A0A0A0]">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A] p-4 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#A0A0A0]">Account Balance</p>
                <p className="text-xl font-bold text-[#E0E0E0]">₹{profile?.balance?.toFixed(2) ?? 0}</p>
              </div>
              <div className="bg-[#00CFFF]/20 rounded-lg p-2">
                <Wallet className="h-5 w-5 text-[#00CFFF]" />
              </div>
            </div>
            <div className="mt-2">
              <Link
                to="/add-funds"
                className="inline-flex items-center text-xs text-[#00CFFF] hover:text-[#0AC5FF] font-medium transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Funds
              </Link>
            </div>
          </div>

          <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A] p-4 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#A0A0A0]">Total Orders</p>
                <p className="text-xl font-bold text-[#E0E0E0]">{profile?.total_orders ?? 0}</p>
              </div>
              <div className="bg-[#7B61FF]/20 rounded-lg p-2">
                <ShoppingCart className="h-5 w-5 text-[#7B61FF]" />
              </div>
            </div>
          </div>

          <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A] p-4 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#A0A0A0]">Total Spent</p>
                <p className="text-xl font-bold text-[#E0E0E0]">₹{profile?.total_spent?.toFixed(2) ?? 0}</p>
              </div>
              <div className="bg-[#A085FF]/20 rounded-lg p-2">
                <BarChart3 className="h-5 w-5 text-[#A085FF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A] p-4 mb-6">
          <h2 className="text-lg font-semibold text-[#E0E0E0] mb-4">Quick Actions</h2>
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
        <div className="bg-[#2A2A2A] rounded-xl shadow-lg border border-[#2A2A2A]">
          <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#E0E0E0]">Recent Orders</h2>
          </div>

          {ordersLoading ? (
            <div className="p-4 text-center text-[#A0A0A0]">Loading orders...</div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#2A2A2A]">
                <thead className="bg-[#1E1E1E]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#2A2A2A] divide-y divide-[#2A2A2A]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#1E1E1E] transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-[#E0E0E0]">#{order.id.slice(0, 8)}</div>
                          <div className="text-sm text-[#A0A0A0]">{order.service?.name || 'Unknown Service'}</div>
                          <div className="text-xs text-[#A0A0A0]">{order.quantity.toLocaleString()} items</div>
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
                        <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                          <div
                            className="bg-[#00CFFF] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-[#A0A0A0] mt-1">{order.progress}%</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[#E0E0E0]">
                        ₹{order.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-10 w-10 text-[#A0A0A0] mx-auto mb-3" />
              <h3 className="text-base font-medium text-[#E0E0E0] mb-2">No orders yet</h3>
              <p className="text-[#A0A0A0] mb-4">Start by placing your first order</p>
              <Link
                to="/place-order"
                className="inline-flex items-center bg-gradient-to-r from-[#00CFFF] to-[#0AC5FF] hover:from-[#0AC5FF] hover:to-[#00CFFF] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
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
