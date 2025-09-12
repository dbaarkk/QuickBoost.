import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  ShoppingCart, 
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
  Activity,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, Order } from '../lib/supabase';
import StaggeredMenu from '../components/StaggeredMenu';

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
      title: 'View Services',
      description: 'Browse all available services',
      icon: <Eye className="h-6 w-6" />,
      link: '/services',
      color: 'from-[#A085FF] to-[#7B61FF]',
      hoverColor: 'hover:shadow-[#A085FF]/25'
    },
    {
      title: 'Place New Order',
      description: 'Browse services and place orders',
      icon: <ShoppingCart className="h-6 w-6" />,
      link: '/place-order',
      color: 'from-[#00CFFF] to-[#0AC5FF]',
      hoverColor: 'hover:shadow-[#00CFFF]/25'
    }
  ];

  const topServices = [
    {
      name: 'Instagram Followers',
      platform: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      price: '₹60',
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
      name: 'Website Traffic (US)',
      platform: 'Traffic',
      icon: <Globe className="h-5 w-5" />,
      price: '₹500',
      rating: 4.9,
      popular: true,
      color: 'text-blue-500'
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

  const menuItems = [
    { label: 'Dashboard', ariaLabel: 'Go to dashboard', link: '/dashboard' },
    { label: 'Place Order', ariaLabel: 'Place new order', link: '/place-order' },
    { label: 'Services', ariaLabel: 'View services', link: '/services' },
    { label: 'Add Funds', ariaLabel: 'Add funds to account', link: '/add-funds' },
    { label: 'Recent Orders', ariaLabel: 'View recent orders', link: '/dashboard' },
    { label: 'Recent Deposits', ariaLabel: 'View recent deposits', link: '/add-funds' },
    { label: 'Achievements', ariaLabel: 'View achievements', link: '/dashboard' },
    { label: 'Announcements', ariaLabel: 'View announcements', link: '/dashboard' },
    { label: 'Contact Us', ariaLabel: 'Contact support', link: '#' }
  ];

  const socialItems = [
    { label: 'Telegram', link: 'https://t.me/quickboostsupport' },
    { label: 'Email', link: 'mailto:quickboostbusiness@gmail.com' }
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
      <header className="bg-[#1E1E1E] shadow-lg border-b border-[#2A2A2A] sticky top-0 z-50">
        {/* Logo at the very top center */}
        <div className="bg-[#121212] border-b border-[#2A2A2A] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <Link to="/" className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-[#00CFFF]" />
                <span className="text-xl font-black text-[#E0E0E0] tracking-tight">QuickBoost</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Balance and Menu positioned correctly */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Balance on the left */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[#2A2A2A] px-4 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-[#00CFFF]" />
                <span className="text-sm text-[#A0A0A0]">Balance:</span>
                <span className="text-sm font-semibold text-[#00CFFF]">₹{profile?.balance?.toFixed(2) ?? 0}</span>
              </div>
            </div>
            
            {/* Menu on the right - wrapped in container to match balance height */}
            <div className="flex items-center">
              <div className="bg-[#2A2A2A] px-2 py-2 rounded-lg">
                <StaggeredMenu
                  position="right"
                  items={[
                    { label: 'Dashboard', ariaLabel: 'Go to dashboard', link: '/dashboard' },
                    { label: 'Place Order', ariaLabel: 'Place new order', link: '/place-order' },
                    { label: 'Services', ariaLabel: 'View services', link: '/services' },
                    { label: 'Add Funds', ariaLabel: 'Add funds to account', link: '/add-funds' },
                    { label: 'Contact Us', ariaLabel: 'Contact support', link: '#' }
                  ]}
                  socialItems={socialItems}
                  displaySocials={true}
                  displayItemNumbering={true}
                  menuButtonColor="#2A2A2A"
                  openMenuButtonColor="#fff"
                  changeMenuColorOnOpen={true}
                  colors={['#B19EEF', '#5227FF']}
                  accentColor="#00CFFF"
                />
              </div>
            </div>
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
                <Link
                  to="/add-funds"
                  className="bg-gradient-to-r from-[#00CFFF] to-[#0AC5FF] text-white p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00CFFF]/25 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Wallet className="h-6 w-6" />
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-lg font-semibold mb-1">Add Funds</div>
                  <p className="text-sm opacity-90">Add money to your account</p>
                </Link>
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
                Your Activity
              </h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#1E1E1E] p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingCart className="h-5 w-5 text-[#00CFFF]" />
                    <span className="text-xs text-green-400">+5%</span>
                  </div>
                  <div className="text-2xl font-bold text-[#E0E0E0] mb-1">{profile?.total_orders ?? 0}</div>
                  <div className="text-sm text-[#A0A0A0]">Total Orders</div>
                </div>
                
                <div className="bg-[#1E1E1E] p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Wallet className="h-5 w-5 text-[#7B61FF]" />
                    <span className="text-xs text-green-400">+12%</span>
                  </div>
                  <div className="text-2xl font-bold text-[#E0E0E0] mb-1">₹{profile?.total_spent?.toFixed(0) ?? 0}</div>
                  <div className="text-sm text-[#A0A0A0]">Total Spent</div>
                </div>
                
                <div className="bg-[#1E1E1E] p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-[#00CFFF]" />
                    <span className="text-xs text-green-400">+18%</span>
                  </div>
                  <div className="text-2xl font-bold text-[#E0E0E0] mb-1">12.5K</div>
                  <div className="text-sm text-[#A0A0A0]">Followers Gained</div>
                </div>
                
                <div className="bg-[#1E1E1E] p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="text-xs text-blue-400">Member</span>
                  </div>
                  <div className="text-2xl font-bold text-[#E0E0E0] mb-1">Level 2</div>
                  <div className="text-sm text-[#A0A0A0]">Account Tier</div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-[#1E1E1E] rounded-xl p-4">
                <h3 className="text-lg font-medium text-[#E0E0E0] mb-4 flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-[#00CFFF]" />
                  Recent Orders
                </h3>
                {recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <div className="text-sm font-medium text-[#E0E0E0]">#{order.id.slice(0, 8)}</div>
                            <div className="text-xs text-[#A0A0A0]">{order.service?.name || 'Unknown Service'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-[#00CFFF]">₹{order.amount.toFixed(2)}</div>
                          <div className="text-xs text-[#A0A0A0]">{order.progress}% complete</div>
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/orders"
                      className="block text-center text-sm text-[#00CFFF] hover:text-[#7B61FF] mt-3 py-2"
                    >
                      View all orders →
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-10 w-10 text-[#A0A0A0] mx-auto mb-3" />
                    <h3 className="text-base font-medium text-[#E0E0E0] mb-2">No orders yet</h3>
                    <p className="text-[#A0A0A0] mb-4">Start by placing your first order</p>
                    <Link
                      to="/place-order"
                      className="inline-flex items-center bg-[#00CFFF] hover:bg-[#0AC5FF] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Place First Order
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Top Services */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                Popular Services
              </h3>
              <div className="space-y-3">
                {topServices.map((service, index) => (
                  <div key={index} className="bg-[#1E1E1E] p-3 rounded-xl group hover:bg-[#2A2A2A] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={service.color}>
                          {service.icon}
                        </div>
                        <span className="text-sm font-medium text-[#E0E0E0]">{service.name}</span>
                        {service.popular && (
                          <span className="bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] text-white text-xs px-2 py-1 rounded-full">
                            Hot
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-[#A0A0A0]">{service.rating}</span>
                      </div>
                      <span className="text-sm font-bold text-[#00CFFF]">{service.price}</span>
                    </div>
                  </div>
                ))}
                <Link
                  to="/services"
                  className="block text-center text-sm text-[#00CFFF] hover:text-[#7B61FF] mt-3 py-2"
                >
                  View all services →
                </Link>
              </div>
            </div>

            {/* Achievements */}
          <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-[#1E1E1E] p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={achievement.color}>
                          {achievement.icon}
                        </div>
                        <span className="text-sm font-medium text-[#E0E0E0]">{achievement.title}</span>
                      </div>
                      {achievement.completed && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-[#A0A0A0] mb-2">{achievement.description}</p>
                    <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] h-2 rounded-full transition-all duration-300"
                        style={{ width: ${achievement.progress}% }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Announcements */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <Bell className="h-4 w-4 mr-2 text-[#00CFFF]" />
                Announcements
              </h3>
              <div className="space-y-3">
                {announcements.map((announcement, index) => (
                  <div key={index} className={bg-gradient-to-r ${announcement.color} p-4 rounded-xl border}>
                    <h4 className="text-sm font-medium text-[#E0E0E0] mb-1">{announcement.title}</h4>
                    <p className="text-xs text-[#A0A0A0]">{announcement.message}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Contact */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-[#00CFFF]" />
                Need Help?
              </h3>
              <div className="space-y-3">
                <a
                  href="https://t.me/quickboostsupport"
                  className="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-xl hover:bg-[#2A2A2A] transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Send className="h-4 w-4 text-[#00CFFF]" />
                    <span className="text-sm text-[#E0E0E0]">Telegram Support</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#A0A0A0] group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="mailto:quickboostbusiness@gmail.com"
                  className="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-xl hover:bg-[#2A2A2A] transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-[#7B61FF]" />
                    <span className="text-sm text-[#E0E0E0]">Email Support</span></div>
                  <ArrowRight className="h-4 w-4 text-[#A0A0A0] group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
