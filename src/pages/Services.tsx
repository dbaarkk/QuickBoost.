import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

interface Service {
  id: number;
  name: string;
  platform: string;
  category: string;
  price: number;
  minOrder: number;
  maxOrder: number;
  description: string;
  deliveryTime: string;
  rating: number;
  popular?: boolean;
}

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services: Service[] = [
    {
      id: 1,
      name: 'Instagram Followers - High Quality',
      platform: 'Instagram',
      category: 'Followers',
      price: 25,
      minOrder: 100,
      maxOrder: 100000,
      description: 'Get high-quality Instagram followers from real accounts with profile pictures',
      deliveryTime: '0-1 hours',
      rating: 4.8,
      popular: true
    },
    {
      id: 2,
      name: 'Instagram Likes - Instant',
      platform: 'Instagram',
      category: 'Likes',
      price: 10,
      minOrder: 50,
      maxOrder: 50000,
      description: 'Instant Instagram likes for your posts from active users',
      deliveryTime: '0-30 minutes',
      rating: 4.9,
      popular: true
    },
    {
      id: 3,
      name: 'YouTube Views - Real',
      platform: 'YouTube',
      category: 'Views',
      price: 5,
      minOrder: 1000,
      maxOrder: 1000000,
      description: 'Real YouTube views from active users worldwide',
      deliveryTime: '1-6 hours',
      rating: 4.7
    },
    {
      id: 4,
      name: 'YouTube Subscribers',
      platform: 'YouTube',
      category: 'Subscribers',
      price: 50,
      minOrder: 50,
      maxOrder: 10000,
      description: 'High-quality YouTube subscribers with profile pictures',
      deliveryTime: '0-2 hours',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Facebook Page Likes',
      platform: 'Facebook',
      category: 'Likes',
      price: 10,
      minOrder: 100,
      maxOrder: 50000,
      description: 'Facebook page likes from real users with active profiles',
      deliveryTime: '1-3 hours',
      rating: 4.5
    },
    {
      id: 6,
      name: 'Twitter Followers',
      platform: 'Twitter',
      category: 'Followers',
      price: 40,
      minOrder: 100,
      maxOrder: 25000,
      description: 'High-quality Twitter followers from real accounts',
      deliveryTime: '0-2 hours',
      rating: 4.4
    }
  ];

  const platforms = ['all', 'Instagram', 'YouTube', 'Facebook', 'Twitter'];
  const categories = ['all', 'Followers', 'Likes', 'Views', 'Subscribers'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || service.platform === selectedPlatform;
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesPlatform && matchesCategory;
  });

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
                <span className="text-sm font-semibold text-green-600">₹{0}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all hover:scale-105 relative overflow-hidden">
              {service.popular && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Popular
                </div>
              )}
              
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
                      <span>Delivery: {service.deliveryTime}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Min: {service.minOrder.toLocaleString()}</span>
                    <span>Max: {service.maxOrder.toLocaleString()}</span>
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