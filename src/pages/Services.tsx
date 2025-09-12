import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  ArrowRight,
  ShoppingCart,
  Star,
  TrendingUp,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Users,
  Clock
} from 'lucide-react';

// Direct services data - no loading required
const servicesData = [
  // Instagram Services
  { id: 1, name: 'Instagram Followers - High Quality', platform: 'Instagram', category: 'Followers', price: 60.00, min_order: 100, max_order: 100000, description: 'Get high-quality Instagram followers from real accounts with profile pictures', delivery_time: '0-1 hours', rating: 4.8, is_active: true },
  { id: 2, name: 'Instagram Likes - Instant', platform: 'Instagram', category: 'Likes', price: 10.00, min_order: 50, max_order: 50000, description: 'Instant Instagram likes for your posts from active users', delivery_time: '0-30 minutes', rating: 4.9, is_active: true },
  { id: 3, name: 'Instagram Views - Real', platform: 'Instagram', category: 'Views', price: 5.00, min_order: 1000, max_order: 1000000, description: 'Real Instagram story/reel views from active users', delivery_time: '0-1 hours', rating: 4.8, is_active: true },
  { id: 4, name: 'Instagram Comments - Custom', platform: 'Instagram', category: 'Comments', price: 80.00, min_order: 10, max_order: 1000, description: 'Custom Instagram comments from real users', delivery_time: '1-6 hours', rating: 4.6, is_active: true },
  { id: 5, name: 'Instagram Story Views', platform: 'Instagram', category: 'Views', price: 1.00, min_order: 500, max_order: 500000, description: 'Instagram story views from real active users', delivery_time: '0-2 hours', rating: 4.7, is_active: true },
  { id: 6, name: 'Instagram Reel Views', platform: 'Instagram', category: 'Views', price: 4.00, min_order: 1000, max_order: 1000000, description: 'High-quality Instagram reel views for better reach', delivery_time: '0-1 hours', rating: 4.8, is_active: true },
  { id: 7, name: 'Instagram Auto Likes', platform: 'Instagram', category: 'Likes', price: 15.00, min_order: 100, max_order: 10000, description: 'Automatic likes for your future Instagram posts', delivery_time: 'Instant', rating: 4.5, is_active: true },
  { id: 8, name: 'Instagram Saves', platform: 'Instagram', category: 'Saves', price: 20.00, min_order: 50, max_order: 25000, description: 'Instagram post saves from real users', delivery_time: '0-2 hours', rating: 4.4, is_active: true },
  { id: 9, name: 'Instagram Shares', platform: 'Instagram', category: 'Shares', price: 25.00, min_order: 25, max_order: 10000, description: 'Instagram post shares to stories from real users', delivery_time: '0-3 hours', rating: 4.3, is_active: true },
  { id: 10, name: 'Instagram Live Video Views', platform: 'Instagram', category: 'Views', price: 8.00, min_order: 100, max_order: 50000, description: 'Live video views during your Instagram live sessions', delivery_time: 'Instant', rating: 4.6, is_active: true },

  // YouTube Services
  { id: 11, name: 'YouTube Views - Real', platform: 'YouTube', category: 'Views', price: 5.00, min_order: 1000, max_order: 1000000, description: 'Real YouTube views from active users worldwide', delivery_time: '1-6 hours', rating: 4.7, is_active: true },
  { id: 12, name: 'YouTube Subscribers', platform: 'YouTube', category: 'Subscribers', price: 50.00, min_order: 50, max_order: 10000, description: 'High-quality YouTube subscribers with profile pictures', delivery_time: '0-2 hours', rating: 4.6, is_active: true },
  { id: 13, name: 'YouTube Likes', platform: 'YouTube', category: 'Likes', price: 15.00, min_order: 100, max_order: 50000, description: 'YouTube video likes from real users', delivery_time: '0-2 hours', rating: 4.5, is_active: true },
  { id: 14, name: 'YouTube Comments', platform: 'YouTube', category: 'Comments', price: 100.00, min_order: 5, max_order: 500, description: 'Custom YouTube comments from real users', delivery_time: '2-12 hours', rating: 4.4, is_active: true },
  { id: 15, name: 'YouTube Watch Time', platform: 'YouTube', category: 'Watch Time', price: 12.00, min_order: 1000, max_order: 100000, description: 'Increase YouTube watch time for monetization', delivery_time: '1-3 hours', rating: 4.8, is_active: true },
  { id: 16, name: 'YouTube Shorts Views', platform: 'YouTube', category: 'Views', price: 3.00, min_order: 1000, max_order: 1000000, description: 'YouTube Shorts views from real users', delivery_time: '0-2 hours', rating: 4.7, is_active: true },
  { id: 17, name: 'YouTube Dislikes', platform: 'YouTube', category: 'Dislikes', price: 20.00, min_order: 50, max_order: 10000, description: 'YouTube video dislikes from real users', delivery_time: '0-3 hours', rating: 4.2, is_active: true },
  { id: 18, name: 'YouTube Shares', platform: 'YouTube', category: 'Shares', price: 30.00, min_order: 25, max_order: 5000, description: 'YouTube video shares from real users', delivery_time: '0-4 hours', rating: 4.3, is_active: true },

  // Facebook Services
  { id: 19, name: 'Facebook Page Likes', platform: 'Facebook', category: 'Likes', price: 10.00, min_order: 100, max_order: 50000, description: 'Facebook page likes from real users with active profiles', delivery_time: '1-3 hours', rating: 4.5, is_active: true },
  { id: 20, name: 'Facebook Followers', platform: 'Facebook', category: 'Followers', price: 30.00, min_order: 100, max_order: 25000, description: 'Facebook profile/page followers from real accounts', delivery_time: '1-4 hours', rating: 4.3, is_active: true },
  { id: 21, name: 'Facebook Post Likes', platform: 'Facebook', category: 'Likes', price: 8.00, min_order: 50, max_order: 25000, description: 'Facebook post likes from real active users', delivery_time: '0-2 hours', rating: 4.4, is_active: true },
  { id: 22, name: 'Facebook Comments', platform: 'Facebook', category: 'Comments', price: 60.00, min_order: 10, max_order: 1000, description: 'Custom Facebook comments from real users', delivery_time: '2-8 hours', rating: 4.2, is_active: true },
  { id: 23, name: 'Facebook Shares', platform: 'Facebook', category: 'Shares', price: 25.00, min_order: 25, max_order: 5000, description: 'Facebook post shares from real users', delivery_time: '1-4 hours', rating: 4.1, is_active: true },
  { id: 24, name: 'Facebook Video Views', platform: 'Facebook', category: 'Views', price: 6.00, min_order: 1000, max_order: 500000, description: 'Facebook video views from real users', delivery_time: '0-3 hours', rating: 4.5, is_active: true },

  // Twitter Services
  { id: 25, name: 'Twitter Followers', platform: 'Twitter', category: 'Followers', price: 40.00, min_order: 100, max_order: 25000, description: 'High-quality Twitter followers from real accounts', delivery_time: '0-2 hours', rating: 4.4, is_active: true },
  { id: 26, name: 'Twitter Likes', platform: 'Twitter', category: 'Likes', price: 20.00, min_order: 50, max_order: 10000, description: 'Twitter post likes from active users', delivery_time: '0-1 hours', rating: 4.5, is_active: true },
  { id: 27, name: 'Twitter Retweets', platform: 'Twitter', category: 'Retweets', price: 35.00, min_order: 25, max_order: 5000, description: 'Twitter retweets from real active accounts', delivery_time: '0-2 hours', rating: 4.3, is_active: true },
  { id: 28, name: 'Twitter Comments', platform: 'Twitter', category: 'Comments', price: 80.00, min_order: 10, max_order: 500, description: 'Custom Twitter replies from real users', delivery_time: '1-6 hours', rating: 4.2, is_active: true },
  { id: 29, name: 'Twitter Views', platform: 'Twitter', category: 'Views', price: 4.00, min_order: 1000, max_order: 1000000, description: 'Twitter post views from real users', delivery_time: '0-2 hours', rating: 4.6, is_active: true },
  { id: 30, name: 'Twitter Spaces Listeners', platform: 'Twitter', category: 'Listeners', price: 50.00, min_order: 50, max_order: 5000, description: 'Twitter Spaces live listeners', delivery_time: 'Instant', rating: 4.4, is_active: true },

  // Telegram Services
  { id: 31, name: 'Telegram Members', platform: 'Telegram', category: 'Members', price: 60.00, min_order: 100, max_order: 50000, description: 'Real Telegram channel/group members', delivery_time: '1-6 hours', rating: 4.6, is_active: true },
  { id: 32, name: 'Telegram Views', platform: 'Telegram', category: 'Views', price: 8.00, min_order: 500, max_order: 100000, description: 'Telegram post views from real users', delivery_time: '0-2 hours', rating: 4.7, is_active: true },
  { id: 33, name: 'Telegram Reactions', platform: 'Telegram', category: 'Reactions', price: 25.00, min_order: 50, max_order: 10000, description: 'Telegram post reactions from active users', delivery_time: '0-1 hours', rating: 4.5, is_active: true },
  { id: 34, name: 'Telegram Shares', platform: 'Telegram', category: 'Shares', price: 30.00, min_order: 25, max_order: 5000, description: 'Telegram post shares from real users', delivery_time: '0-3 hours', rating: 4.3, is_active: true },

  // LinkedIn Services
  { id: 35, name: 'LinkedIn Followers', platform: 'LinkedIn', category: 'Followers', price: 80.00, min_order: 50, max_order: 10000, description: 'Professional LinkedIn followers from real accounts', delivery_time: '2-6 hours', rating: 4.4, is_active: true },
  { id: 36, name: 'LinkedIn Likes', platform: 'LinkedIn', category: 'Likes', price: 40.00, min_order: 25, max_order: 5000, description: 'LinkedIn post likes from professional users', delivery_time: '1-3 hours', rating: 4.3, is_active: true },
  { id: 37, name: 'LinkedIn Connections', platform: 'LinkedIn', category: 'Connections', price: 100.00, min_order: 10, max_order: 2000, description: 'LinkedIn connection requests from real professionals', delivery_time: '6-24 hours', rating: 4.2, is_active: true },
  { id: 38, name: 'LinkedIn Views', platform: 'LinkedIn', category: 'Views', price: 15.00, min_order: 100, max_order: 25000, description: 'LinkedIn profile/post views from active users', delivery_time: '0-2 hours', rating: 4.5, is_active: true },
  { id: 39, name: 'LinkedIn Comments', platform: 'LinkedIn', category: 'Comments', price: 120.00, min_order: 5, max_order: 500, description: 'Professional LinkedIn comments from real users', delivery_time: '2-12 hours', rating: 4.1, is_active: true },
  { id: 40, name: 'LinkedIn Shares', platform: 'LinkedIn', category: 'Shares', price: 60.00, min_order: 10, max_order: 1000, description: 'LinkedIn post shares from professional users', delivery_time: '1-6 hours', rating: 4.2, is_active: true },

  // Google Services
  { id: 41, name: 'Google Reviews', platform: 'Google', category: 'Reviews', price: 300.00, min_order: 5, max_order: 100, description: 'High-quality Google business reviews from real users', delivery_time: '1-3 days', rating: 4.9, is_active: true },

  // Website Traffic Services
  { id: 42, name: 'Website Traffic from United States', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from United States users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 43, name: 'Website Traffic from United Kingdom', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from United Kingdom users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 44, name: 'Website Traffic from Canada', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from Canada users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 45, name: 'Website Traffic from Australia', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from Australia users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 46, name: 'Website Traffic from Germany', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from Germany users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 47, name: 'Website Traffic from France', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from France users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 48, name: 'Website Traffic from Japan', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from Japan users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 49, name: 'Website Traffic from Brazil', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from Brazil users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 50, name: 'Website Traffic from India', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from India users', delivery_time: '1-24 hours', rating: 4.7, is_active: true },
  { id: 51, name: 'Website Traffic from Netherlands', platform: 'Traffic', category: 'Traffic', price: 500.00, min_order: 1000, max_order: 100000, description: 'High-quality website traffic from Netherlands users', delivery_time: '1-24 hours', rating: 4.7, is_active: true }
];

const Services: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getServiceIcon = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return <Youtube className="h-5 w-5" />;
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
      case 'Traffic':
        return <Globe className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return 'text-pink-600 bg-pink-100';
      case 'YouTube':
        return 'text-red-600 bg-red-100';
      case 'Facebook':
        return 'text-blue-600 bg-blue-100';
      case 'Twitter':
        return 'text-sky-600 bg-sky-100';
      case 'Telegram':
        return 'text-cyan-600 bg-cyan-100';
      case 'LinkedIn':
        return 'text-blue-800 bg-blue-100';
      case 'Traffic':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get unique platforms and categories from services
  const platforms = ['all', ...Array.from(new Set(servicesData.map(service => service.platform)))];
  const categories = ['all', ...Array.from(new Set(servicesData.map(service => service.category)))];

  const filteredServices = servicesData.filter(service => {
    const platformMatch = selectedPlatform === 'all' || service.platform === selectedPlatform;
    const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
    return platformMatch && categoryMatch && service.is_active;
  });

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
              <Link to="/dashboard" className="text-[#A0A0A0] hover:text-[#00CFFF] text-sm font-medium transition-colors">Dashboard</Link>
              <Link to="/place-order" className="text-[#A0A0A0] hover:text-[#00CFFF] text-sm font-medium transition-colors">Place Order</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#E0E0E0] mb-4">Our Services</h1>
          <p className="text-xl text-[#A0A0A0] max-w-3xl mx-auto">
            Boost your social media presence with our premium services. Choose from a wide range of platforms and engagement types.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#2A2A2A] rounded-lg shadow-lg p-6 mb-8 border border-[#2A2A2A]">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-[#A0A0A0]" />
            <h3 className="text-lg font-semibold text-[#E0E0E0]">Filter Services</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2A2A2A] text-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00CFFF] focus:border-[#00CFFF] transition-all duration-300"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform === 'all' ? 'All Platforms' : platform}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2A2A2A] text-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00CFFF] focus:border-[#00CFFF] transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-[#2A2A2A] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-[#2A2A2A]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getPlatformColor(service.platform)}`}>
                    {getServiceIcon(service.platform)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#E0E0E0]">{service.name}</h3>
                    <p className="text-sm text-[#A0A0A0]">{service.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>
              </div>
              
              <p className="text-[#A0A0A0] text-sm mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0A0]">Price per 1000:</span>
                  <span className="font-medium text-[#E0E0E0]">₹{service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0A0]">Min Order:</span>
                  <span className="font-medium text-[#E0E0E0]">{service.min_order.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0A0]">Max Order:</span>
                  <span className="font-medium text-[#E0E0E0]">{service.max_order.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A0A0A0]">Delivery:</span>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-[#A0A0A0]" />
                    <span className="font-medium text-[#E0E0E0]">{service.delivery_time}</span>
                  </div>
                </div>
              </div>
              
              <Link
                to="/place-order"
                className="w-full btn-accent py-2 px-4 text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Order Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">No services found</h3>
            <p className="text-[#A0A0A0]">Try adjusting your filters to see more services.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
