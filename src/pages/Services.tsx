import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Users, Heart, MessageCircle, Share2, Eye, Play, UserPlus, Zap, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
  TrendingUp, 
  Instagram, 
  Youtube, 
  Facebook, 
  Twitter, 
  Search,
  ShoppingCart,
  Star,
  Clock,
  Users,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getServices, Service } from '../lib/supabase';

const Services: React.FC = () => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([
    // Instagram Services
    { id: 1, name: 'Instagram Followers', category: 'Instagram', price: 0.50, minOrder: 100, maxOrder: 10000, description: 'High-quality Instagram followers', icon: 'Users' },
    { id: 2, name: 'Instagram Likes', category: 'Instagram', price: 0.30, minOrder: 50, maxOrder: 5000, description: 'Real Instagram likes for your posts', icon: 'Heart' },
    { id: 3, name: 'Instagram Comments', category: 'Instagram', price: 1.20, minOrder: 10, maxOrder: 1000, description: 'Engaging comments on your posts', icon: 'MessageCircle' },
    { id: 4, name: 'Instagram Views', category: 'Instagram', price: 0.20, minOrder: 100, maxOrder: 50000, description: 'Boost your Instagram video views', icon: 'Eye' },
    { id: 5, name: 'Instagram Story Views', category: 'Instagram', price: 0.40, minOrder: 50, maxOrder: 10000, description: 'Increase your story visibility', icon: 'Eye' },
    { id: 6, name: 'Instagram Shares', category: 'Instagram', price: 0.80, minOrder: 25, maxOrder: 2000, description: 'Share your content widely', icon: 'Share2' },
    
    // YouTube Services
    { id: 7, name: 'YouTube Subscribers', category: 'YouTube', price: 2.50, minOrder: 50, maxOrder: 5000, description: 'Grow your YouTube channel', icon: 'UserPlus' },
    { id: 8, name: 'YouTube Views', category: 'YouTube', price: 0.80, minOrder: 100, maxOrder: 100000, description: 'Increase video watch time', icon: 'Play' },
    { id: 9, name: 'YouTube Likes', category: 'YouTube', price: 1.50, minOrder: 25, maxOrder: 2000, description: 'Get more likes on videos', icon: 'Heart' },
    { id: 10, name: 'YouTube Comments', category: 'YouTube', price: 3.00, minOrder: 5, maxOrder: 500, description: 'Engaging video comments', icon: 'MessageCircle' },
    { id: 11, name: 'YouTube Watch Time', category: 'YouTube', price: 5.00, minOrder: 100, maxOrder: 10000, description: 'Boost your watch hours', icon: 'Play' },
    
    // TikTok Services
    { id: 12, name: 'TikTok Followers', category: 'TikTok', price: 1.80, minOrder: 100, maxOrder: 10000, description: 'Grow your TikTok audience', icon: 'Users' },
    { id: 13, name: 'TikTok Likes', category: 'TikTok', price: 0.60, minOrder: 50, maxOrder: 10000, description: 'Get more likes on TikTok', icon: 'Heart' },
    { id: 14, name: 'TikTok Views', category: 'TikTok', price: 0.40, minOrder: 100, maxOrder: 100000, description: 'Increase video visibility', icon: 'Eye' },
    { id: 15, name: 'TikTok Shares', category: 'TikTok', price: 1.20, minOrder: 25, maxOrder: 5000, description: 'Viral content sharing', icon: 'Share2' },
    { id: 16, name: 'TikTok Comments', category: 'TikTok', price: 2.50, minOrder: 10, maxOrder: 1000, description: 'Engaging TikTok comments', icon: 'MessageCircle' },
    
    // Facebook Services
    { id: 17, name: 'Facebook Page Likes', category: 'Facebook', price: 1.20, minOrder: 100, maxOrder: 10000, description: 'Grow your Facebook page', icon: 'Heart' },
    { id: 18, name: 'Facebook Post Likes', category: 'Facebook', price: 0.80, minOrder: 50, maxOrder: 5000, description: 'Boost post engagement', icon: 'Heart' },
    { id: 19, name: 'Facebook Followers', category: 'Facebook', price: 1.50, minOrder: 100, maxOrder: 10000, description: 'Increase page followers', icon: 'Users' },
    { id: 20, name: 'Facebook Comments', category: 'Facebook', price: 2.00, minOrder: 10, maxOrder: 1000, description: 'Quality post comments', icon: 'MessageCircle' },
    { id: 21, name: 'Facebook Shares', category: 'Facebook', price: 1.80, minOrder: 25, maxOrder: 2000, description: 'Expand your reach', icon: 'Share2' },
    
    // Twitter Services
    { id: 22, name: 'Twitter Followers', category: 'Twitter', price: 2.20, minOrder: 100, maxOrder: 10000, description: 'Build your Twitter audience', icon: 'Users' },
    { id: 23, name: 'Twitter Likes', category: 'Twitter', price: 1.00, minOrder: 50, maxOrder: 5000, description: 'Get more tweet likes', icon: 'Heart' },
    { id: 24, name: 'Twitter Retweets', category: 'Twitter', price: 1.50, minOrder: 25, maxOrder: 2000, description: 'Amplify your tweets', icon: 'Share2' },
    { id: 25, name: 'Twitter Comments', category: 'Twitter', price: 3.50, minOrder: 10, maxOrder: 500, description: 'Engaging tweet replies', icon: 'MessageCircle' },
    
    // LinkedIn Services
    { id: 26, name: 'LinkedIn Followers', category: 'LinkedIn', price: 3.00, minOrder: 50, maxOrder: 5000, description: 'Professional network growth', icon: 'Users' },
    { id: 27, name: 'LinkedIn Post Likes', category: 'LinkedIn', price: 2.50, minOrder: 25, maxOrder: 1000, description: 'Professional engagement', icon: 'Heart' },
    { id: 28, name: 'LinkedIn Connections', category: 'LinkedIn', price: 4.00, minOrder: 25, maxOrder: 2000, description: 'Expand your network', icon: 'UserPlus' },
    
    // Telegram Services
    { id: 29, name: 'Telegram Members', category: 'Telegram', price: 1.80, minOrder: 100, maxOrder: 10000, description: 'Grow your Telegram channel', icon: 'Users' },
    { id: 30, name: 'Telegram Views', category: 'Telegram', price: 0.60, minOrder: 100, maxOrder: 50000, description: 'Increase post visibility', icon: 'Eye' },
    
    // Spotify Services
    { id: 31, name: 'Spotify Followers', category: 'Spotify', price: 2.80, minOrder: 100, maxOrder: 10000, description: 'Grow your music audience', icon: 'Users' },
    { id: 32, name: 'Spotify Plays', category: 'Spotify', price: 1.20, minOrder: 100, maxOrder: 100000, description: 'Boost your track plays', icon: 'Play' },
    { id: 33, name: 'Spotify Monthly Listeners', category: 'Spotify', price: 4.50, minOrder: 50, maxOrder: 5000, description: 'Increase monthly listeners', icon: 'Users' },
    
    // Discord Services
    { id: 34, name: 'Discord Members', category: 'Discord', price: 2.00, minOrder: 50, maxOrder: 5000, description: 'Grow your Discord server', icon: 'Users' },
    { id: 35, name: 'Discord Online Members', category: 'Discord', price: 3.50, minOrder: 25, maxOrder: 1000, description: 'Active server members', icon: 'Zap' },
    
    // Twitch Services
    { id: 36, name: 'Twitch Followers', category: 'Twitch', price: 3.20, minOrder: 50, maxOrder: 5000, description: 'Build your streaming audience', icon: 'Users' },
    { id: 37, name: 'Twitch Views', category: 'Twitch', price: 2.50, minOrder: 100, maxOrder: 10000, description: 'Boost stream viewership', icon: 'Eye' },
    
    // Website Traffic
    { id: 38, name: 'Website Traffic', category: 'Website', price: 1.50, minOrder: 1000, maxOrder: 100000, description: 'Drive traffic to your website', icon: 'Eye' },
    { id: 39, name: 'SEO Backlinks', category: 'Website', price: 5.00, minOrder: 10, maxOrder: 1000, description: 'High-quality backlinks', icon: 'Zap' },
    { id: 40, name: 'Google Reviews', category: 'Website', price: 8.00, minOrder: 5, maxOrder: 100, description: 'Positive Google reviews', icon: 'Star' }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await getServices();
      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    };

    setLoading(false);
  }, []);

      case 'YouTube':
        return <Youtube className="h-5 w-5" />;
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
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
      default:
        return 'text-gray-600 bg-gray-100';
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
                <span className="text-sm font-semibold text-green-600">₹{profile?.balance.toFixed(2) || '0.00'}</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Our Services</h1>
          <p className="text-gray-600">Choose from our wide range of social media marketing services</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="font-medium text-gray-900">Filter Services</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Platform Filter */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'All Platforms' : platform}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all hover:scale-105 relative overflow-hidden">
                <div className="p-6">
                  {/* Service Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-xl ${getPlatformColor(service.platform)}`}>
                        {getPlatformIcon(service.platform)}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {service.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Delivery: {service.delivery_time}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Min: {service.min_order.toLocaleString()}</span>
                      <span>Max: {service.max_order.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{service.price}</span>
                      <span className="text-gray-600 text-sm ml-1">per 1000</span>
                    </div>
                    <Link
                      to="/place-order"
                      className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;