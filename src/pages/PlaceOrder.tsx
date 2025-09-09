import React, { useEffect, useMemo, useState } from 'react';
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
  CheckCircle,
  AlertCircle,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Play,
  UserPlus,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getServices, createOrder } from '../lib/supabase';

/**
 * Local service shape used by this component (normalized)
 */
type LocalService = {
  id: number | string;
  name: string;
  platform: string;
  price: number; // price is "per 1000"
  minOrder: number;
  maxOrder: number;
  description?: string;
  delivery_time?: string;
  rating?: number;
  icon?: string;
};

const PlaceOrder: React.FC = () => {
  const { profile, refreshProfile } = useAuth();

  // initial hardcoded services (kept as defaults)
  const defaultServices: LocalService[] = [
    { id: 1, name: 'Instagram Followers', platform: 'Instagram', price: 0.5, minOrder: 100, maxOrder: 10000, description: 'High-quality Instagram followers', icon: 'Users', delivery_time: 'Instant', rating: 4.6 },
    { id: 2, name: 'Instagram Likes', platform: 'Instagram', price: 0.3, minOrder: 50, maxOrder: 5000, description: 'Real Instagram likes for your posts', icon: 'Heart', delivery_time: 'Minutes', rating: 4.4 },
    { id: 3, name: 'Instagram Comments', platform: 'Instagram', price: 1.2, minOrder: 10, maxOrder: 1000, description: 'Engaging comments on your posts', icon: 'MessageCircle', delivery_time: 'Minutes', rating: 4.5 },
    { id: 4, name: 'Instagram Views', platform: 'Instagram', price: 0.2, minOrder: 100, maxOrder: 50000, description: 'Boost your Instagram video views', icon: 'Eye', delivery_time: 'Minutes', rating: 4.2 },
    // ... (trimmed for brevity) keep the rest or add back as needed (use your original list)
    { id: 7, name: 'YouTube Subscribers', platform: 'YouTube', price: 2.5, minOrder: 50, maxOrder: 5000, description: 'Grow your YouTube channel', icon: 'UserPlus', delivery_time: 'Hours', rating: 4.5 },
    { id: 8, name: 'YouTube Views', platform: 'YouTube', price: 0.8, minOrder: 100, maxOrder: 100000, description: 'Increase video watch time', icon: 'Play', delivery_time: 'Minutes', rating: 4.1 },
    { id: 31, name: 'Spotify Followers', platform: 'Spotify', price: 2.8, minOrder: 100, maxOrder: 10000, description: 'Grow your music audience', icon: 'Users', delivery_time: 'Hours', rating: 4.3 },
    { id: 38, name: 'Website Traffic', platform: 'Website', price: 1.5, minOrder: 1000, maxOrder: 100000, description: 'Drive traffic to your website', icon: 'Eye', delivery_time: 'Hours', rating: 4.0 },
    { id: 40, name: 'Google Reviews', platform: 'Website', price: 8.0, minOrder: 5, maxOrder: 100, description: 'Positive Google reviews', icon: 'Star', delivery_time: 'Hours', rating: 4.7 },
  ];

  const [services, setServices] = useState<LocalService[]>(defaultServices);
  const [loading, setLoading] = useState<boolean>(false); // not blocking on mount
  const [selectedService, setSelectedService] = useState<LocalService | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Fetch services from backend if available and normalize structure
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await getServices();
        if (!error && Array.isArray(data) && data.length > 0) {
          // normalize whatever shape the backend returns to LocalService
          const normalized: LocalService[] = data.map((s: any) => ({
            id: s.id ?? s.service_id ?? Math.random(),
            name: s.name ?? s.title ?? 'Unnamed service',
            platform: s.platform ?? s.category ?? s.service_category ?? 'Other',
            price: Number(s.price ?? s.rate ?? 0),
            minOrder: Number(s.min_order ?? s.minOrder ?? s.min ?? 1),
            maxOrder: Number(s.max_order ?? s.maxOrder ?? s.max ?? 999999),
            description: s.description ?? '',
            delivery_time: s.delivery_time ?? s.delivery ?? 'Instant',
            rating: Number(s.rating ?? 4.5),
            icon: s.icon ?? 'Users'
          }));
          setServices(normalized);
        } else {
          // keep defaults (already set)
        }
      } catch (err) {
        // keep defaults and log
        // console.error('Failed to load services', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Derive platform list dynamically
  const platforms = useMemo(() => {
    const p = Array.from(new Set(services.map(s => s.platform))).filter(Boolean);
    return ['all', ...p];
  }, [services]);

  // Filtered and searched services list
  const filteredServices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return services.filter(s => {
      const matchesPlatform = selectedPlatform === 'all' || s.platform === selectedPlatform;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        s.platform.toLowerCase().includes(q);
      return matchesPlatform && matchesQuery;
    });
  }, [services, searchTerm, selectedPlatform]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
      case 'YouTube':
      case 'YouTube ':
        return <Youtube className="h-5 w-5" />;
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
      case 'Telegram':
        return <Users className="h-5 w-5" />;
      case 'Spotify':
        return <Zap className="h-5 w-5" />;
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
    if (qty < selectedService.minOrder || qty > selectedService.maxOrder) {
      setSubmitError(`Quantity must be between ${selectedService.minOrder.toLocaleString()} and ${selectedService.maxOrder.toLocaleString()}`);
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
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredServices.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">No services found.</div>
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
                                    <span>{service.delivery_time ?? 'Instant'}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                    <span>{service.rating ?? 4.5}</span>
                                  </div>
                                  <span>Min: {service.minOrder.toLocaleString()}</span>
                                  <span>Max: {service.maxOrder.toLocaleString()}</span>
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
                      <div>Min: {selectedService.minOrder.toLocaleString()} | Max: {selectedService.maxOrder.toLocaleString()}</div>
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
                      min={selectedService?.minOrder ?? 1}
                      max={selectedService?.maxOrder ?? 999999}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                    <Calculator className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {selectedService && (
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {selectedService.minOrder.toLocaleString()} | Max: {selectedService.maxOrder.toLocaleString()}
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
