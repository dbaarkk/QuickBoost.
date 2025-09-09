import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  ShoppingCart, 
  Calculator,
  Info,
  Star,
  Clock,
  Users,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  ArrowRight,
  CheckCircle
import { ShoppingCart, AlertCircle, CheckCircle, Users, Heart, MessageCircle, Share2, Eye, Play, UserPlus, Zap, Star, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getServices, createOrder, Service } from '../lib/supabase';

const PlaceOrder: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await getServices();
      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    };

    // Services are now hardcoded, no need to fetch
  }, []);

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
      case 'Telegram':
        return <Users className="h-5 w-5" />;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !quantity || !link || !profile) return;

    const orderAmount = calculateTotal();
    
    // Validate balance
    if (profile.balance < orderAmount) {
      setSubmitError('Insufficient balance. Please add funds to your account.');
      return;
    }

    // Validate quantity
    const qty = parseInt(quantity);
    if (qty < selectedService.min_order || qty > selectedService.max_order) {
      setSubmitError(`Quantity must be between ${selectedService.min_order} and ${selectedService.max_order}`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    createOrder({
      service_id: selectedService.id,
      quantity: qty,
      link,
      amount: orderAmount
    }).then(({ data, error }) => {
      if (error) {
        setSubmitError(error.message);
      } else {
        setSubmitSuccess(true);
        setQuantity('');
        setLink('');
        setSelectedService(null);
        refreshProfile(); // Refresh user profile to update balance
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
      setIsSubmitting(false);
    });
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
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Place New Order</h1>
          <p className="text-gray-600">Select a service and place your order instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Service</h2>
                
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platform === 'all' ? 'All Platforms' : platform}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Services Grid */}
              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedService?.id === service.id
                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${getPlatformColor(service.platform)}`}>
                              {getPlatformIcon(service.platform)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{service.delivery_time}</span>
                                </div>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                                  <span>{service.rating}</span>
                                </div>
                                <span>Min: {service.min_order.toLocaleString()}</span>
                                <span>Max: {service.max_order.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">₹{service.price}</div>
                            <div className="text-sm text-gray-500">per 1000</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border sticky top-4">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                {/* Success Message */}
                {submitSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-800 font-medium">Order placed successfully!</span>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{submitError}</p>
                  </div>
                )}

                {/* Selected Service */}
                {selectedService ? (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1 rounded ${getPlatformColor(selectedService.platform)}`}>
                        {getPlatformIcon(selectedService.platform)}
                      </div>
                      <span className="font-medium text-gray-900">{selectedService.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Price: ₹{selectedService.price} per 1000</div>
                      <div>Min: {selectedService.min_order.toLocaleString()} | Max: {selectedService.max_order.toLocaleString()}</div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                    <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Please select a service from the list</p>
                  </div>
                )}

                {/* Link Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter your profile/post URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the complete URL of your profile or post
                  </p>
                </div>

                {/* Quantity Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      min={selectedService?.min_order || 1}
                      max={selectedService?.max_order || 999999}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                    <Calculator className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {selectedService && (
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {selectedService.min_order.toLocaleString()} | Max: {selectedService.max_order.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Price Calculation */}
                {selectedService && quantity && (
                  <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <span className="font-medium">{parseInt(quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="font-medium">₹{selectedService.price} per 1000</span>
                    </div>
                    <div className="border-t border-indigo-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-indigo-600">₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedService || !quantity || !link || isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </button>

                {/* Order Info */}
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-yellow-600" />
                    Order Information
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Orders are processed automatically</li>
                    <li>• Delivery starts within the specified time</li>
                    <li>• Refill guarantee available</li>
                    <li>• 24/7 customer support</li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;