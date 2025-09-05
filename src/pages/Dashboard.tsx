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
  XCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data - replace with real data from your API
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
      date: '2025-01-15'
    },
    {
      id: '1002',
      service: 'YouTube Views',
      quantity: 5000,
      status: 'In Progress',
      amount: 450,
      date: '2025-01-14'
    },
    {
      id: '1003',
      service: 'Facebook Likes',
      quantity: 500,
      status: 'Pending',
      amount: 150,
      date: '2025-01-14'
    },
    {
      id: '1004',
      service: 'Twitter Followers',
      quantity: 2000,
      status: 'Completed',
      amount: 380,
      date: '2025-01-13'
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
        return 'text-green-600 bg-green-100';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'Pending':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-red-600 bg-red-100';
    }
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
              <Link to="/dashboard" className="text-indigo-600 font-medium">Dashboard</Link>
              <Link to="/services" className="text-gray-700 hover:text-indigo-600">Services</Link>
              <Link to="/add-funds" className="text-gray-700 hover:text-indigo-600">Add Funds</Link>
              <button className="text-gray-700 hover:text-red-600">Logout</button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Account Balance</p>
                <p className="text-2xl font-bold text-gray-900">₹{userBalance.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/add-funds"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Funds
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/services"
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Order
            </Link>
            <Link
              to="/add-funds"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
