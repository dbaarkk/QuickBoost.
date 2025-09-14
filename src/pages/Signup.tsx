import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, TrendingUp, Sparkles, Shield, Zap, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect immediately when user is authenticated
  useEffect(() => {
    if (user && !loading) {
      console.log('✅ User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Client-side validation
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      console.log('📝 Attempting signup for:', formData.email);
      await signUp(formData.email, formData.password, {
        first_name: firstName,
        last_name: lastName,
        phone: ''
      });
      
      // Success - auth context will handle redirect via useEffect
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      if (error.message?.includes('already registered')) {
        setError('Email already registered. Please sign in instead.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if user is already authenticated
  if (user && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-80 h-80 bg-gradient-to-r from-[#7B61FF]/20 to-[#A085FF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-gradient-to-r from-[#00CFFF]/20 to-[#7B61FF]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-[#A085FF]/10 to-[#00CFFF]/10 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div className="bg-[#1E1E1E]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#2A2A2A]/50 p-8 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF]/5 to-[#00CFFF]/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center justify-center mb-6 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#00CFFF] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-[#121212] p-3 rounded-2xl border border-[#2A2A2A]">
                      <TrendingUp className="h-8 w-8 text-[#7B61FF]" />
                    </div>
                  </div>
                  <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#00CFFF] bg-clip-text text-transparent">
                    QuickBoost
                  </span>
                </Link>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-[#E0E0E0]">Join QuickBoost</h1>
                  <p className="text-[#A0A0A0]">Create your account and start growing today</p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <div className="flex items-center bg-[#7B61FF]/10 text-[#7B61FF] px-3 py-1 rounded-full text-xs border border-[#7B61FF]/20">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </div>
                  <div className="flex items-center bg-[#00CFFF]/10 text-[#00CFFF] px-3 py-1 rounded-full text-xs border border-[#00CFFF]/20">
                    <Shield className="h-3 w-3 mr-1" />
                    Trusted
                  </div>
                  <div className="flex items-center bg-[#A085FF]/10 text-[#A085FF] px-3 py-1 rounded-full text-xs border border-[#A085FF]/20">
                    <Zap className="h-3 w-3 mr-1" />
                    Fast
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-xl backdrop-blur-sm">
                  <p className="text-[#FF5C5C] text-sm text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#E0E0E0]">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF]/20 to-[#00CFFF]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5 transition-colors group-focus-within:text-[#7B61FF]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-[#2A2A2A]/50 backdrop-blur-sm border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:ring-2 focus:ring-[#7B61FF]/50 focus:border-[#7B61FF] transition-all duration-300 hover:bg-[#2A2A2A]/70"
                        placeholder="Enter your full name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#E0E0E0]">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF]/20 to-[#00CFFF]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5 transition-colors group-focus-within:text-[#7B61FF]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-[#2A2A2A]/50 backdrop-blur-sm border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:ring-2 focus:ring-[#7B61FF]/50 focus:border-[#7B61FF] transition-all duration-300 hover:bg-[#2A2A2A]/70"
                        placeholder="Enter your email address"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#E0E0E0]">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF]/20 to-[#00CFFF]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5 transition-colors group-focus-within:text-[#7B61FF]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-14 py-4 bg-[#2A2A2A]/50 backdrop-blur-sm border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:ring-2 focus:ring-[#7B61FF]/50 focus:border-[#7B61FF] transition-all duration-300 hover:bg-[#2A2A2A]/70"
                        placeholder="Create a password"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] hover:text-[#7B61FF] transition-colors p-1 rounded-lg hover:bg-[#2A2A2A]/50"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#E0E0E0]">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF]/20 to-[#00CFFF]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5 transition-colors group-focus-within:text-[#7B61FF]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-12 pr-14 py-4 bg-[#2A2A2A]/50 backdrop-blur-sm border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:ring-2 focus:ring-[#7B61FF]/50 focus:border-[#7B61FF] transition-all duration-300 hover:bg-[#2A2A2A]/70"
                        placeholder="Confirm your password"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] hover:text-[#7B61FF] transition-colors p-1 rounded-lg hover:bg-[#2A2A2A]/50"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group overflow-hidden rounded-2xl p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#00CFFF] rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF] to-[#00CFFF] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-[#7B61FF] to-[#00CFFF] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 group-hover:scale-[0.98] flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Create Account
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-[#A0A0A0]">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-[#7B61FF] hover:text-[#A085FF] font-medium transition-colors hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-[#1E1E1E]/60 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A2A]/50 text-center">
              <div className="text-[#7B61FF] font-bold text-lg">Free</div>
              <div className="text-[#A0A0A0] text-sm">Account Setup</div>
            </div>
            <div className="bg-[#1E1E1E]/60 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A2A]/50 text-center">
              <div className="text-[#00CFFF] font-bold text-lg">24/7</div>
              <div className="text-[#A0A0A0] text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;