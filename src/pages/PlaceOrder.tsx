import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Search,
  ShoppingCart,
  Calculator,
  Info,
  Star,
  Clock,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Users,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../lib/supabase';

// Direct services data - no loading required
const servicesData = [
  // Instagram Services
  { id: 1, name: 'Instagram Followers - High Quality', platform: 'Instagram', category: 'Followers', price: 25.00, min_order: 100, max_order: 100000, description: 'Get high-quality Instagram followers from real accounts with profile pictures', delivery_time: '0-1 hours', rating: 4.8, is_active: true },
  { id: 2, name: 'Instagram Likes - Instant', platform: 'Instagram', category: 'Likes', price: 10.00, min_order: 50, max_order: 50000, description: 'Instant Instagram likes for your posts from active users', delivery_time: '0-30 minutes', rating: 4.9, is_active: true },
  { id: 3, name: 'Instagram Views - Real', platform: 'Instagram', category: 'Views', price: 5.00, min_order: 1000, max_order: 1000000, description: 'Real Instagram story/reel views from active users', delivery_time: '0-1 hours', rating: 4.8, is_active: true },
  { id: 4, name: 'Instagram Comments - Custom', platform: 'Instagram', category: 'Comments', price: 80.00, min_order: 10, max_order: 1000, description: 'Custom Instagram comments from real users', delivery_time: '1-6 hours', rating: 4.6, is_active: true },
  { id: 5, name: 'Instagram Story Views', platform: 'Instagram', category: 'Views', price: 3.00, min_order: 500, max_order: 500000, description: 'Instagram story views from real active users', delivery_time: '0-2 hours', rating: 4.7, is_active: true },
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
  { id: 40, name: 'LinkedIn Shares', platform: 'LinkedIn', category: 'Shares', price: 60.00, min_order: 10, max_order: 1000, description: 'LinkedIn post shares from professional users', delivery_time: '1-6 hours', rating: 4.2, is_active: true }
];

interface Service {
  id: number;
  name: string;
  platform: string;
  category: string;
  price: number;
  min_order: number;
  max_order: number;
  description: string;
  delivery_time: string;
  rating: number;
  is_active: boolean;
}

const PlaceOrder: React.FC = () => {
  const { profile, refreshProfile } = useAuth();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Derive platform list dynamically
  const platforms = useMemo(() => {
    const p = Array.from(new Set(servicesData.map(s => s.platform))).filter(Boolean);
    return ['all', ...p];
  }, []);

  // Filtered and searched services list
  const filteredServices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return servicesData.filter(s => {
      const matchesPlatform = selectedPlatform === 'all' || s.platform === selectedPlatform;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        s.platform.toLowerCase().includes(q);
      return matchesPlatform && matchesQuery && s.is_active;
    });
  }, [searchTerm, selectedPlatform]);

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

  // calculate total based on price-per-1000 convention
  const calculateTotal = (): number => {
    const qty = parseInt(quantity || '0', 10) || 0;
    if (!selectedService || qty <= 0) return 0;
    // price is "per 1000"
    const total = (qty / 1000) * selectedService.price;
    return Number(total || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!selectedService) {
      setSubmitError('Please select a service.');
      return;
    }
    const qty = parseInt(quantity || '0', 10);
    if (!qty || qty <= 0) {
      setSubmitError('Please enter a valid quantity.');
      return;
    }

    // Validate quantity range
    if (qty < selectedService.min_order || qty > selectedService.max_order) {
      setSubmitError(`Quantity must be between ${selectedService.min_order.toLocaleString()} and ${selectedService.max_order.toLocaleString()}`);
      return;
    }

    // Validate link
    if (!link || link.trim().length === 0) {
      setSubmitError('Please provide a valid link (profile/post URL).');
      return;
    }

    const orderAmount = calculateTotal();

    // Validate balance
    if ((profile?.balance ?? 0) < orderAmount) {
      setSubmitError('Insufficient balance. Please add funds to your account.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await createOrder({
        service_id: selectedService.id,
        quantity: qty,
        link: link.trim(),
        amount: orderAmount
      });

      if (error) {
        setSubmitError(error.message || 'Failed to place order');
      } else {
        setSubmitSuccess(true);
        setQuantity('');
        setLink('');
        setSelectedService(null);
        // refresh profile (update balance) if available
        if (refreshProfile) {
          try { await refreshProfile(); } catch (_) {}
        }
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred while placing the order.');
    } finally {
      setIsSubmitting(false);
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
                <span className="text-sm font-semibold text-green-600">₹{(profile?.balance ?? 0).toFixed(2)}</span>
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
                <div className="space-y-3">
                  {filteredServices.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No services found. Try adjusting your filters.
                    </div>
                  ) : (
                    filteredServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedService?.id === service.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
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
                                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
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
                    ))
                  )}
                </div>
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
                {submitSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-green-800 font-medium">Order placed successfully!</span>
                  </div>
                )}

                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{submitError}</p>
                  </div>
                )}

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
                  <p className="text-xs text-gray-500 mt-1">Enter the complete URL of your profile or post</p>
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
                      min={selectedService?.min_order ?? 1}
                      max={selectedService?.max_order ?? 999999}
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
                      <span className="font-medium">{parseInt(quantity || '0', 10).toLocaleString()}</span>
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </button>

                {/* Info */}
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