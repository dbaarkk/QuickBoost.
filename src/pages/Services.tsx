import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
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
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  UserPlus,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getServices, Service } from '../lib/supabase';

const Services: React.FC = () => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([
    // Instagram Services
    { id: 1, name: 'Instagram Followers', platform: 'Instagram', category: 'Followers', price: 0.50, min_order: 100, max_order: 10000, description: 'High-quality Instagram followers', delivery_time: 'Instant', rating: 4.8, is_active: true, created_at: '' },
    { id: 2, name: 'Instagram Likes', platform: 'Instagram', category: 'Likes', price: 0.30, min_order: 50, max_order: 5000, description: 'Real Instagram likes for your posts', delivery_time: 'Minutes', rating: 4.9, is_active: true, created_at: '' },
    { id: 3, name: 'Instagram Comments', platform: 'Instagram', category: 'Comments', price: 1.20, min_order: 10, max_order: 1000, description: 'Engaging comments on your posts', delivery_time: 'Minutes', rating: 4.5, is_active: true, created_at: '' },
    { id: 4, name: 'Instagram Views', platform: 'Instagram', category: 'Views', price: 0.20, min_order: 100, max_order: 50000, description: 'Boost your Instagram video views', delivery_time: 'Minutes', rating: 4.2, is_active: true, created_at: '' },
    { id: 5, name: 'Instagram Story Views', platform: 'Instagram', category: 'Views', price: 0.40, min_order: 50, max_order: 10000, description: 'Increase your story visibility', delivery_time: 'Minutes', rating: 4.3, is_active: true, created_at: '' },
    { id: 6, name: 'Instagram Shares', platform: 'Instagram', category: 'Shares', price: 0.80, min_order: 25, max_order: 2000, description: 'Share your content widely', delivery_time: 'Minutes', rating: 4.1, is_active: true, created_at: '' },
    
    // YouTube Services
    { id: 7, name: 'YouTube Subscribers', platform: 'YouTube', category: 'Subscribers', price: 2.50, min_order: 50, max_order: 5000, description: 'Grow your YouTube channel', delivery_time: 'Hours', rating: 4.5, is_active: true, created_at: '' },
    { id: 8, name: 'YouTube Views', platform: 'YouTube', category: 'Views', price: 0.80, min_order: 100, max_order: 100000, description: 'Increase video watch time', delivery_time: 'Minutes', rating: 4.1, is_active: true, created_at: '' },
    { id: 9, name: 'YouTube Likes', platform: 'YouTube', category: 'Likes', price: 1.50, min_order: 25, max_order: 2000, description: 'Get more likes on videos', delivery_time: 'Minutes', rating: 4.4, is_active: true, created_at: '' },
    { id: 10, name: 'YouTube Comments', platform: 'YouTube', category: 'Comments', price: 3.00, min_order: 5, max_order: 500, description: 'Engaging video comments', delivery_time: 'Hours', rating: 4.2, is_active: true, created_at: '' },
    { id: 11, name: 'YouTube Watch Time', platform: 'YouTube', category: 'Watch Time', price: 5.00, min_order: 100, max_order: 10000, description: 'Boost your watch hours', delivery_time: 'Hours', rating: 4.0, is_active: true, created_at: '' },
    
    // TikTok Services
    { id: 12, name: 'TikTok Followers', platform: 'TikTok', category: 'Followers', price: 1.80, min_order: 100, max_order: 10000, description: 'Grow your TikTok audience', delivery_time: 'Hours', rating: 4.6, is_active: true, created_at: '' },
    { id: 13, name: 'TikTok Likes', platform: 'TikTok', category: 'Likes', price: 0.60, min_order: 50, max_order: 10000, description: 'Get more likes on TikTok', delivery_time: 'Minutes', rating: 4.7, is_active: true, created_at: '' },
    { id: 14, name: 'TikTok Views', platform: 'TikTok', category: 'Views', price: 0.40, min_order: 100, max_order: 100000, description: 'Increase video visibility', delivery_time: 'Minutes', rating: 4.5, is_active: true, created_at: '' },
    { id: 15, name: 'TikTok Shares', platform: 'TikTok', category: 'Shares', price: 1.20, min_order: 25, max_order: 5000, description: 'Viral content sharing', delivery_time: 'Minutes', rating: 4.3, is_active: true, created_at: '' },
    { id: 16, name: 'TikTok Comments', platform: 'TikTok', category: 'Comments', price: 2.50, min_order: 10, max_order: 1000, description: 'Engaging TikTok comments', delivery_time: 'Hours', rating: 4.4, is_active: true, created_at: '' },
    
    // Facebook Services
    { id: 17, name: 'Facebook Page Likes', platform: 'Facebook', category: 'Likes', price: 1.20, min_order: 100, max_order: 10000, description: 'Grow your Facebook page', delivery_time: 'Hours', rating: 4.5, is_active: true, created_at: '' },
    { id: 18, name: 'Facebook Post Likes', platform: 'Facebook', category: 'Likes', price: 0.80, min_order: 50, max_order: 5000, description: 'Boost post engagement', delivery_time: 'Minutes', rating: 4.6, is_active: true, created_at: '' },
    { id: 19, name: 'Facebook Followers', platform: 'Facebook', category: 'Followers', price: 1.50, min_order: 100, max_order: 10000, description: 'Increase page followers', delivery_time: 'Hours', rating: 4.3, is_active: true, created_at: '' },
    { id: 20, name: 'Facebook Comments', platform: 'Facebook', category: 'Comments', price: 2.00, min_order: 10, max_order: 1000, description: 'Quality post comments', delivery_time: 'Hours', rating: 4.4, is_active: true, created_at: '' },
    { id: 21, name: 'Facebook Shares', platform: 'Facebook', category: 'Shares', price: 1.80, min_order: 25, max_order: 2000, description: 'Expand your reach', delivery_time: 'Hours', rating: 4.2, is_active: true, created_at: '' },
    
    // Twitter Services
    { id: 22, name: 'Twitter Followers', platform: 'Twitter', category: 'Followers', price: 2.20, min_order: 100, max_order: 10000, description: 'Build your Twitter audience', delivery_time: 'Hours', rating: 4.4, is_active: true, created_at: '' },
    { id: 23, name: 'Twitter Likes', platform: 'Twitter', category: 'Likes', price: 1.00, min_order: 50, max_order: 5000, description: 'Get more tweet likes', delivery_time: 'Minutes', rating: 4.5, is_active: true, created_at: '' },
    { id: 24, name: 'Twitter Retweets', platform: 'Twitter', category: 'Retweets', price: 1.50, min_order: 25, max_order: 2000, description: 'Amplify your tweets', delivery_time: 'Minutes', rating: 4.3, is_active: true, created_at: '' },
    { id: 25, name: 'Twitter Comments', platform: 'Twitter', category: 'Comments', price: 3.50, min_order: 10, max_order: 500, description: 'Engaging tweet replies', delivery_time: 'Hours', rating: 4.2, is_active: true, created_at: '' },
    
    // LinkedIn Services
    { id: 26, name: 'LinkedIn Followers', platform: 'LinkedIn', category: 'Followers', price: 3.00, min_order: 50, max_order: 5000, description: 'Professional network growth', delivery_time: 'Hours', rating: 4.4, is_active: true, created_at: '' },
    { id: 27, name: 'LinkedIn Post Likes', platform: 'LinkedIn', category: 'Likes', price: 2.50, min_order: 25, max_order: 1000, description: 'Professional engagement', delivery_time: 'Hours', rating: 4.3, is_active: true, created_at: '' },
    { id: 28, name: 'LinkedIn Connections', platform: 'LinkedIn', category: 'Connections', price: 4.00, min_order: 25, max_order: 2000, description: 'Expand your network', delivery_time: 'Hours', rating: 4.2, is_active: true, created_at: '' },
    
    // Telegram Services
    { id: 29, name: 'Telegram Members', platform: 'Telegram', category: 'Members', price: 1.80, min_order: 100, max_order: 10000, description: 'Grow your Telegram channel', delivery_time: 'Hours', rating: 4.6, is_active: true, created_at: '' },
    { id: 30, name: 'Telegram Views', platform: 'Telegram', category: 'Views', price: 0.60, min_order: 100, max_order: 50000, description: 'Increase post visibility', delivery_time: 'Minutes', rating: 4.7, is_active: true, created_at: '' },
    
    // Spotify Services
    { id: 31, name: 'Spotify Followers', platform: 'Spotify', category: 'Followers', price: 2.80, min_order: 100, max_order: 10000, description: 'Grow your music audience', delivery_time: 'Hours', rating: 4.3, is_active: true, created_at: '' },
    { id: 32, name: 'Spotify Plays', platform: 'Spotify', category: 'Plays', price: 1.20, min_order: 100, max_order: 100000, description: 'Boost your track plays', delivery_time: 'Hours', rating: 4.5, is_active: true, created_at: '' },
    { id: 33, name: 'Spotify Monthly Listeners', platform: 'Spotify', category: 'Listeners', price: 4.50, min_order: 50, max_order: 5000, description: 'Increase monthly listeners', delivery_time: 'Hours', rating: 4.1, is_active: true, created_at: '' },
    
    // Discord Services
    { id: 34, name: 'Discord Members', platform: 'Discord', category: 'Members', price: 2.00, min_order: 50, max_order: 5000, description: 'Grow your Discord server', delivery_time: 'Hours', rating: 4.4, is_active: true, created_at: '' },
    { id: 35, name: 'Discord Online Members', platform: 'Discord', category: 'Members', price: 3.50, min_order: 25, max_order: 1000, description: 'Active server members', delivery_time: 'Hours', rating: 4.2, is_active: true, created_at: '' },
    
    // Twitch Services
    { id: 36, name: 'Twitch Followers', platform: 'Twitch', category: 'Followers', price: 3.20, min_order: 50, max_order: 5000, description: 'Build your streaming audience', delivery_time: 'Hours', rating: 4.3, is_active: true, created_at: '' },
    { id: 37, name: 'Twitch Views', platform: 'Twitch', category: 'Views', price: 2.50, min_order: 100, max_order: 10000, description: 'Boost stream viewership', delivery_time: 'Hours', rating: 4.1, is_active: true, created_at: '' },
    
    // Website Services
    { id: 38, name: 'Website Traffic', platform: 'Website', category: 'Traffic', price: 1.50, min_order: 1000, max_order: 100000, description: 'Drive traffic to your website', delivery_time: 'Hours', rating: 4.0, is_active: true, created_at: '' },
    { id: 39, name: 'SEO Backlinks', platform: 'Website', category: 'SEO', price: 5.00, min_order: 10, max_order: 1000, description: 'High-quality backlinks', delivery_time: 'Days', rating: 4.2, is_active: true, created_at: '' },
    { id: 40, name: 'Google Reviews', platform: 'Website', category: 'Reviews', price: 8.00, min_order: 5, max_order: 100, description: 'Positive Google reviews', delivery_time: 'Days', rating: 4.7, is_active: true, created_at: '' }
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

  const platforms = useMemo(() => {
    const p = Array.from(new Set(services.map(s => s.platform))).filter(Boolean);
    return ['all', ...p];
  }, [services]);

  const categories = useMemo(() => {
    const c = Array.from(new Set(services.map(s => s.category))).filter(Boolean);
    return ['all', ...c];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = selectedPlatform === 'all' || service.platform === selectedPlatform;
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesSearch && matchesPlatform && matchesCategory;
    });
  }, [services, searchTerm, selectedPlatform, selectedCategory]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
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