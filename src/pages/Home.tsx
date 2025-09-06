import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Star, 
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  Smartphone
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Instant Delivery',
      description: 'Get your orders started within minutes of payment',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: '100% Safe',
      description: 'All our services are completely safe and secure',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Real Users',
      description: 'Get engagement from real and active users',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'Best Prices',
      description: 'Most competitive prices in the Indian market',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '1M+', label: 'Orders Completed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Content Creator',
      content: 'QuickBoost helped me grow my Instagram from 500 to 50K followers. Amazing service!',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: 'Business Owner',
      content: 'Best SMM panel in India. Fast delivery and excellent customer support.',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      role: 'YouTuber',
      content: 'Increased my YouTube views significantly. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">QuickBoost</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Dashboard</Link>
              <Link to="/services" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Services</Link>
              <Link to="/place-order" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Place Order</Link>
              <Link to="/add-funds" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Add Funds</Link>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 text-sm font-medium">Login</Link>
              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4 mr-2" />
              #1 SMM Panel in India
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Boost Your Social Media
              <span className="block text-indigo-600">Presence Today</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              Get real followers, likes, views, and engagement at the most competitive prices. 
              Trusted by 50,000+ customers across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Start Now - It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors border border-gray-300"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose QuickBoost?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best SMM services with guaranteed results and unmatched quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`${feature.color} rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who trust QuickBoost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Boost Your Social Media?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and start growing your social media presence today
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center bg-white hover:bg-gray-100 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-2xl font-bold">QuickBoost</span>
              </div>
              <p className="text-gray-400 mb-4">
                India's most trusted SMM panel providing high-quality social media marketing services.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Trusted by 50,000+ customers</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Instagram Services</li>
                <li>YouTube Services</li>
                <li>Facebook Services</li>
                <li>Twitter Services</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>24/7 Customer Support</li>
                <li>FAQ</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 QuickBoost. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;