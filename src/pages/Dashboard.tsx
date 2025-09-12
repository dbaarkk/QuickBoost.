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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[#2A2A2A] px-4 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-[#00CFFF]" />
                <span className="text-sm text-[#A0A0A0]">Balance:</span>
                <span className="text-sm font-semibold text-[#00CFFF]">₹{profile?.balance?.toFixed(2) ?? 0}</span>
              </div>
            </div>
            <div className="flex items-center">
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
      </header>

      {/* The rest of the code remains unchanged from your original file */}
      {/* For brevity, I have not repeated it here, as only the header part has been updated. */}
    </div>
  );
};

export default Dashboard;
