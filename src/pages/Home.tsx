import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Star, 
  CheckCircle,
  Award
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#1E1E1E] shadow-lg border-b border-[#2A2A2A] sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-[#00CFFF]" />
              <span className="ml-2 text-xl font-bold text-[#E0E0E0]">QuickBoost</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Login button removed */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E1E1E] via-[#121212] to-[#1E1E1E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-[#00CFFF]/20 to-[#7B61FF]/20 text-[#00CFFF] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#00CFFF]/30">
              <Award className="h-4 w-4 mr-2 text-[#00CFFF]" />
              #1 SMM Panel in India
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#E0E0E0] mb-6">
              Boost Your Social Media
              <span className="block">with <span className="bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] bg-clip-text text-transparent">QuickBoost</span></span>
            </h1>
            <p className="text-lg text-[#A0A0A0] mb-6 max-w-3xl mx-auto leading-relaxed">
              Get real followers, likes, views, and engagement at the most competitive prices. 
              Trusted by 50,000+ customers across India.
            </p>
            {/* Buttons moved slightly down by adding margin-top */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="modern-btn-primary text-lg px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
              >
                {user ? "Continue" : "Start Now - It's Free"}
                {/* Arrow removed */}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-[#1E1E1E] border-y border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#00CFFF] mb-2">{stat.number}</div>
                <div className="text-[#A0A0A0]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E0E0E0] mb-4">
              Why Choose QuickBoost?
            </h2>
            <p className="text-xl text-[#A0A0A0] max-w-2xl mx-auto">
              We provide the best SMM services with guaranteed results and unmatched quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group p-6 bg-[#2A2A2A] rounded-xl hover:bg-[#2A2A2A]/80 transition-all duration-300">
                <div className={`${feature.color} rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#E0E0E0] mb-2">{feature.title}</h3>
                <p className="text-[#A0A0A0]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E0E0E0] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-[#A0A0A0]">
              Join thousands of satisfied customers who trust QuickBoost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#2A2A2A] p-6 rounded-xl shadow-lg border border-[#2A2A2A] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[#A0A0A0] mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-[#E0E0E0]">{testimonial.name}</div>
                  <div className="text-sm text-[#A0A0A0]">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-[#00CFFF] to-[#7B61FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Boost Your Social Media?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and start growing your social media presence today
          </p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="btn-primary btn-modern text-lg"
          >
            {user ? "Continue" : "Get Started Today"}
            {/* Arrow removed */}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] text-[#E0E0E0] py-8 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-[#00CFFF]" />
                <span className="ml-2 text-2xl font-bold">QuickBoost</span>
              </div>
              <p className="text-[#A0A0A0] mb-4">
                India's most trusted SMM panel providing high-quality social media marketing services.
              </p>
              <div className="flex items-center space-x-2 text-sm text-[#A0A0A0]">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Trusted by 50,000+ customers</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-[#A0A0A0]">
                <li>Instagram Services</li>
                <li>YouTube Services</li>
                <li>Facebook Services</li>
                <li>Twitter Services</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-[#A0A0A0]">
                <li>24/7 Customer Support</li>
                <li>FAQ</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#2A2A2A] mt-8 pt-8 text-center text-[#A0A0A0]">
            <p>&copy; 2025 QuickBoost. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
