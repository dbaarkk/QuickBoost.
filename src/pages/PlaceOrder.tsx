import React, { useState } from 'react';
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
}

const PlaceOrder: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // Mock services data
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
      rating: 4.8
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
      rating: 4.9
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

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || service.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const calculateTotal = () => {
    if (!selectedService || !quantity) return 0;
    const qty = parseInt(quantity);
    return (qty / 1000) * selectedService.price;
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !quantity || !link) return;
    
    console.log('Order submitted:', {
      service: selectedService,
      quantity: parseInt(quantity),
      link,
      total: calculateTotal()
    });
    
    // Here you would typically send the order to your backend
    alert('Order placed successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">QuickBoost</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">Dashboard</Link>
              <Link to="/services" className="text-gray-700 hover:text-indigo-600 font-medium">Services</Link>
              <Link to="/place-order" className="text-indigo-600 font-medium">Place Order</Link>
              <Link to="/add-funds" className="text-gray-700 hover:text-indigo-600 font-medium">Add Funds</Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Balance:</span>
                <span className="text-sm font-semibold text-green-600">₹0.00</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Place New Order</h1>
          <p className="text-gray-600">Select a service and place your order instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Service</h2>
                
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <div className="p-6">
                <div className="space-y-4">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
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
                                <span>{service.deliveryTime}</span>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                                <span>{service.rating}</span>
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
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-8">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Selected Service */}
                {selectedService ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Please select a service from the list</p>
                  </div>
                )}

                {/* Link Input */}
                <div className="mb-6">
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      min={selectedService?.minOrder || 1}
                      max={selectedService?.maxOrder || 999999}
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
                  <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
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
                  disabled={!selectedService || !quantity || !link}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Place Order
                </button>

                {/* Order Info */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
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