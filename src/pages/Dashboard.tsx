import React from 'react';
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
  BarChart3,
  Users,
  Star
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const userBalance = 0;
  const totalOrders = 0;
  const pendingOrders = 0;
  const completedOrders = 0;

  const recentOrders = [
    {
      id: '1001',
      service: 'Instagram Followers',
      quantity: 1000,
      status: 'Completed',
      amount: 299,
      date: '2025-01-15',
      progress: 100
    },
    {
      id: '1002',
      service: 'YouTube Views',
      quantity: 5000,
      status: 'In Progress',
      amount: 450,
      date: '2025-01-14',
      progress: 65
    },
    {
      id: '1003',
      service: 'Facebook Likes',
      quantity: 500,
      status: 'Pending',
      amount: 150,
      date: '2025-01-14',
      progress: 0
    }
  ];

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
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Pending':
        return <Eye className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-700 bg-green-100';
      case 'In Progress':
        return 'text-yellow-700 bg-yellow-100';
      case 'Pending':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-red-700 bg-red-100';
    }
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
              <Link to="/add-funds" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Add Funds</Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="text-sm font-semibold text-green-600">₹{userBalance.toFixed(2)}</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Welcome Section */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Account Balance</p>
                <p className="text-xl font-bold text-gray-900">₹{userBalance.toFixed(2)}</p>
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
                <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-xl font-bold text-gray-900">{completedOrders}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
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
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/orders" className="text-indigo-600 hover:text-indigo-500 text-xs font-medium">
                View All
              </Link>
            </div>
          </div>
          
          {recentOrders.length > 0 ? (
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
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          <div className="text-sm text-gray-600">{order.service}</div>
                          <div className="text-xs text-gray-500">{order.quantity.toLocaleString()} items</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
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
                        ₹{order.amount}
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