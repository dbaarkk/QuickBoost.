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
  BarChart3,
  Star,
  Award,
  Shield,
  Users,
  Zap,
  Bell,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Target,
  Trophy,
  Gift,
  Send,
  TrendingDown,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, Order } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Fetch recent orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

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
    };

    fetchOrders();
  }, [user]);

  const quickActions = [
    {
      title: 'Place New Order',
      description: 'Browse services and place orders',
      icon: <ShoppingCart className="h-6 w-6" />,
      link: '/place-order',
      color: 'from-[#00CFFF] to-[#0AC5FF]',
      hoverColor: 'hover:shadow-[#00CFFF]/25'
    },
    {
      title: 'Add Funds',
      description: 'Add money to your account',
      icon: <Plus className="h-6 w-6" />,
      link: '/add-funds',
      color: 'from-[#7B61FF] to-[#A085FF]',
      hoverColor: 'hover:shadow-[#7B61FF]/25'
    },
    {
      title: 'View Services',
      description: 'Browse all available services',
      icon: <Eye className="h-6 w-6" />,
      link: '/services',
      color: 'from-[#A085FF] to-[#7B61FF]',
      hoverColor: 'hover:shadow-[#A085FF]/25'
    }
  ];

  const topServices = [
    {
      name: 'Instagram Followers',
      platform: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      price: '₹25',
      rating: 4.8,
      popular: true,
      color: 'text-pink-500'
    },
    {
      name: 'YouTube Views',
      platform: 'YouTube',
      icon: <Youtube className="h-5 w-5" />,
      price: '₹5',
      rating: 4.7,
      popular: true,
      color: 'text-red-500'
    },
    {
      name: 'Google Reviews',
      platform: 'Google',
      icon: <Star className="h-5 w-5" />,
      price: '₹300',
      rating: 4.9,
      popular: true,
      color: 'text-yellow-500'
    },
    {
      name: 'Twitter Followers',
      platform: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      price: '₹40',
      rating: 4.4,
      popular: false,
      color: 'text-sky-500'
    }
  ];

  const achievements = [
    {
      title: 'Welcome Aboard!',
      description: 'Account created successfully',
      icon: <Gift className="h-5 w-5" />,
      completed: true,
      color: 'text-green-400',
      progress: 100
    },
    {
      title: 'First Order',
      description: 'Place your first order',
      icon: <Target className="h-5 w-5" />,
      completed: (profile?.total_orders ?? 0) > 0,
      color: 'text-blue-400',
      progress: (profile?.total_orders ?? 0) > 0 ? 100 : 0
    },
    {
      title: 'Big Spender',
      description: 'Spend over ₹1000',
      icon: <Trophy className="h-5 w-5" />,
      completed: (profile?.total_spent ?? 0) >= 1000,
      color: 'text-yellow-400',
      progress: Math.min(((profile?.total_spent ?? 0) / 1000) * 100, 100)
    }
  ];

  const announcements = [
    {
      title: '🎉 New Year Special!',
      message: 'Get 20% extra credits on all deposits above ₹500',
      type: 'offer',
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
    },
    {
      title: '⚡ Lightning Fast Delivery',
      message: 'All Instagram services now deliver within 30 minutes',
      type: 'update',
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
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
      <header className="bg-[#1E1E1E] shadow-lg border-b border-[#2A2A2A] sticky top-0 z-50">AddFunds<Link>
      </Link> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-[#00CFFF]" />
              <span className="text-xl font-bold text-[#E0E0E0]">QuickBoost</span>
            </Link>
            <nav className="flex items-center space-x-6">
              className="text-[#A0A0A0] hover:text-[#00CFFF] text-sm font-medium transition-colors">
               className="text-[#A0A0A0] hover:text-[#00CFFF] text-sm font-medium transition-colors">
              <div className="flex items-center space-x-2 bg-[#2A2A2A] px-4 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-[#00CFFF]" />
                <span className="text-sm text-[#A0A0A0]">Balance:</span>
                <span className="text-sm font-semibold text-[#00CFFF]">₹{profile?.balance?.toFixed(2) ?? 0}</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-[#00CFFF]/10 to-[#7B61FF]/10 rounded-2xl shadow-lg border border-[#2A2A2A] p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00CFFF]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between relative z-10">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-[#E0E0E0] mb-2">
                Welcome back {profile?.first_name ?? 'to QuickBoost'} 👋
              </h1>
              <p className="text-[#A0A0A0] text-lg mb-4">Ready to boost your social media presence today?</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-[#A0A0A0]">Secure & Trusted by 50,000+ users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-[#A0A0A0]">Encrypted payments</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center bg-[#1E1E1E]/50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-[#00CFFF] mb-1">₹{profile?.balance?.toFixed(2) ?? 0}</div>
                <div className="text-sm text-[#A0A0A0]">Current Balance</div>
              </div>
              <div className="text-center bg-[#1E1E1E]/50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-[#7B61FF] mb-1">{profile?.total_orders ?? 0}</div>
                <div className="text-sm text-[#A0A0A0]">Total Orders</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Quick Actions */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-6 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-[#00CFFF]" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${action.hoverColor} group`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      {action.icon}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-lg font-semibold mb-1">{action.title}</div>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Activity Panel */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-6 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-[#7B61FF]" />
                Activity Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#1E1E1E] rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#00CFFF]/20 rounded-full mx-auto mb-3">
                    <Wallet className="h-6 w-6 text-[#00CFFF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#E0E0E0] mb-1">₹{profile?.balance?.toFixed(2) ?? 0}</div>
                  <div className="text-sm text-[#A0A0A0]">Account Balance</div>
                  <div className="w-full bg-[#2A2A2A] rounded-full h-2 mt-3">
                    <div className="bg-[#00CFFF] h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-[#1E1E1E] rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#7B61FF]/20 rounded-full mx-auto mb-3">
                    <ShoppingCart className="h-6 w-6 text-[#7B61FF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#E0E0E0] mb-1">{profile?.total_orders ?? 0}</div>
                  <div className="text-sm text-[#A0A0A0]">Total Orders</div>
                  <div className="w-full bg-[#2A2A2A] rounded-full h-2 mt-3">
                    <div className="bg-[#7B61FF] h-2 rounded-full" style={{ width: `${Math.min((profile?.total_orders ?? 0) * 10, 100)}%` }}></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-[#1E1E1E] rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#A085FF]/20 rounded-full mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-[#A085FF]" />
                  </div>
                  <div className="text-2xl font-bold text-[#E0E0E0] mb-1">₹{profile?.total_spent?.toFixed(2) ?? 0}</div>
                  <div className="text-sm text-[#A0A0A0]">Total Spent</div>
                  <div className="w-full bg-[#2A2A2A] rounded-full h-2 mt-3">
                    <div className="bg-[#A085FF] h-2 rounded-full" style={{ width: `${Math.min(((profile?.total_spent ?? 0) / 1000) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Services */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h2 className="text-xl font-semibold text-[#E0E0E0] mb-6 flex items-center">
                <Star className="h-5 w-5 mr-2 text-[#00CFFF]" />
                Top Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topServices.map((service, index) => (
                  <Link
                    key={index}
                    to="/place-order"
                    className="bg-[#1E1E1E] p-4 rounded-xl hover:bg-[#1E1E1E]/80 transition-all duration-300 hover:scale-105 group border border-[#2A2A2A]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-[#2A2A2A] ${service.color}`}>
                        {service.icon}
                      </div>
                      {service.popular && (
                        <span className="bg-gradient-to-r from-[#00CFFF] to-[#0AC5FF] text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#E0E0E0] mb-1">{service.name}</h3>
                    <p className="text-sm text-[#A0A0A0] mb-2">{service.platform}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#00CFFF]">{service.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-[#A0A0A0]">{service.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A]">
              <div className="px-6 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#E0E0E0] flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-[#7B61FF]" />
                  Recent Orders
                </h2>
                <Link to="/place-order" className="text-[#00CFFF] hover:text-[#0AC5FF] text-sm font-medium transition-colors">
                  View All
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#2A2A2A]">
                    <thead className="bg-[#1E1E1E]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                          Order Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#2A2A2A] divide-y divide-[#2A2A2A]">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#1E1E1E] transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-[#E0E0E0]">#{order.id.slice(0, 8)}</div>
                              <div className="text-sm text-[#A0A0A0]">{order.service?.name || 'Unknown Service'}</div>
                              <div className="text-xs text-[#A0A0A0]">{order.quantity.toLocaleString()} items</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {getStatusIcon(order.status)}
                              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full bg-[#1E1E1E] rounded-full h-2">
                              <div
                                className="bg-[#00CFFF] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${order.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-[#A0A0A0] mt-1">{order.progress}%</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[#E0E0E0]">
                            ₹{order.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-[#A0A0A0] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">No orders yet</h3>
                  <p className="text-[#A0A0A0] mb-6">Start by placing your first order</p>
                  <Link
                    to="/place-order"
                    className="inline-flex items-center bg-gradient-to-r from-[#00CFFF] to-[#0AC5FF] hover:from-[#0AC5FF] hover:to-[#00CFFF] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-[#00CFFF]/25"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Place First Order
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Notifications */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-[#00CFFF]" />
                Announcements
              </h3>
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl bg-gradient-to-r ${announcement.color} border transition-all duration-300 hover:scale-105`}
                  >
                    <h4 className="font-semibold text-[#E0E0E0] mb-2">{announcement.title}</h4>
                    <p className="text-sm text-[#A0A0A0]">{announcement.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#7B61FF]" />
                Achievements
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-[#1E1E1E] rounded-xl">
                    <div className={`p-2 rounded-lg ${achievement.completed ? 'bg-green-500/20' : 'bg-[#2A2A2A]'}`}>
                      <div className={achievement.color}>
                        {achievement.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#E0E0E0] text-sm">{achievement.title}</h4>
                      <p className="text-xs text-[#A0A0A0]">{achievement.description}</p>
                      <div className="w-full bg-[#2A2A2A] rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${achievement.completed ? 'bg-green-400' : 'bg-[#00CFFF]'}`}
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-[#00CFFF]" />
                Need Help?
              </h3>
              <p className="text-sm text-[#A0A0A0] mb-4">
                Get instant support from our team. We're here to help you 24/7.
              </p>
              <a
                href="https://t.me/quickboostsupport"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/25 hover:scale-105"
              >
                <Send className="h-5 w-5 mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
