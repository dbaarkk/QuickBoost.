import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
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
  Globe,
  Bot
} from 'lucide-react';

const Dashboard: React.FC = () => {
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
      completed: false,
      color: 'text-blue-400',
      progress: 0
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#1E1E1E] shadow-lg border-b border-[#2A2A2A] sticky top-0 z-50">
        <div className="bg-[#121212] border-b border-[#2A2A2A] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <Link to="/dashboard" className="flex items-center space-x-4 py-2">
                <TrendingUp className="h-8 w-8 text-[#00CFFF]" />
                <span className="text-xl font-black text-[#E0E0E0] tracking-tight">QuickBoost</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[#2A2A2A] px-4 py-2 rounded-lg">
                <Wallet className="h-4 w-4 text-[#00CFFF]" />
                <span className="text-sm text-[#A0A0A0]">Balance:</span>
                <span className="text-sm font-semibold text-[#00CFFF]">₹1000.00</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/support"
                className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors text-sm"
                data-testid="link-support"
              >
                Support
              </Link>
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
                Welcome back to QuickBoost 👋
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
                <div className="text-2xl font-bold text-[#00CFFF] mb-1">₹1000.00</div>
                <div className="text-sm text-[#A0A0A0]">Current Balance</div>
              </div>
              <div className="text-center bg-[#1E1E1E]/50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-[#7B61FF] mb-1">0</div>
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
                  data-testid="link-add-funds"
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
                    data-testid={`link-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#00CFFF]" />
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

            {/* Support Section - WITH ALL THREE OPTIONS */}
            <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-[#E0E0E0] mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-[#00CFFF]" />
                Need Help?
              </h3>
              <p className="text-[#A0A0A0] text-sm mb-4">
                Our support team is here to help you 24/7
              </p>
              <div className="space-y-3">
                <a
                  href="https://t.me/quickboostsupport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 p-3 rounded-lg transition-colors group"
                  data-testid="link-telegram-support"
                >
                  <div className="flex items-center space-x-3">
                    <Send className="h-4 w-4 text-[#00CFFF]" />
                    <span className="text-sm text-[#E0E0E0]">Telegram Support</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#A0A0A0] group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="mailto:quickboostbusiness@gmail.com"
                  className="flex items-center justify-between w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 p-3 rounded-lg transition-colors group"
                  data-testid="link-email-support"
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-[#7B61FF]" />
                    <span className="text-sm text-[#E0E0E0]">Email Support</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#A0A0A0] group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/quicksupport"
                  className="flex items-center justify-between w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 p-3 rounded-lg transition-colors group"
                  data-testid="link-quicksupport-ai"
                >
                  <div className="flex items-center space-x-3">
                    <Bot className="h-4 w-4 text-[#A085FF]" />
                    <span className="text-sm text-[#E0E0E0]">QuickSupport AI</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#A0A0A0] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
