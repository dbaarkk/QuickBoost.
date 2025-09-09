import React, { useState, useEffect } from 'react';
import {
  Filter,
  ArrowRight,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  UserPlus,
  Zap,
  Star,
  Instagram,
  Youtube,
  Twitter,
  Facebook
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getServices, Service } from '../lib/supabase';

const Services: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (serviceName: string) => {
    switch(serviceName) {
      case 'YouTube':
        return <Youtube className="h-5 w-5" />;
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const platforms = ['all', 'Instagram', 'YouTube', 'TikTok', 'Facebook', 'Twitter', 'LinkedIn', 'Telegram', 'Spotify', 'Discord', 'Twitch', 'Website'];
  const categories = ['all', 'Followers', 'Likes', 'Views', 'Comments', 'Shares', 'Subscribers', 'Members'];

  const filteredServices = services.filter(service => {
    const platformMatch = selectedPlatform === 'all' || service.platform === selectedPlatform;
    const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
    return platformMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Boost your social media presence with our premium services. Choose from a wide range of platforms and engagement types.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Services</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform === 'all' ? 'All Platforms' : platform}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div key={service.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getServiceIcon(service.platform)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price per 1000:</span>
                  <span className="font-medium">₹{service.price_per_1000}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Min Order:</span>
                  <span className="font-medium">{service.min_order}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Max Order:</span>
                  <span className="font-medium">{service.max_order}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery:</span>
                  <span className="font-medium">{service.delivery_time}</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Order Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more services.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;