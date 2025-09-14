import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, TrendingUp, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect immediately when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('✅ User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Client-side validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🔐 Attempting login for:', email);
      await signIn(email, password);
      // Success - auth context will handle redirect via useEffect
    } catch (error: any) {
      console.error('❌ Login error:', error);
      // Only show error for actual auth failures
      if (error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#00CFFF]/20 to-[#7B61FF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#7B61FF]/20 to-[#A085FF]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00CFFF]/10 to-[#7B61FF]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div className="bg-[#1E1E1E]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#2A2A2A]/50 p-8 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00CFFF]/5 to-[#7B61FF]/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-[#00CFFF] mr-3" />
                  <span className="text-2xl font-bold text-[#E0E0E0]">QuickBoost</span>
                </Link>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-[#E0E0E0]">Welcome Back</h1>
                  <p className="text-[#A0A0A0]">Sign in to boost your social media presence</p>
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <div className="flex items-center bg-[#00CFFF]/10 text-[#00CFFF] px-3 py-1 rounded-full text-xs border border-[#00CFFF]/20">
                    <Shield className="h-3 w-3 mr-1" />
                    Secure
                  </div>
                  <div className="flex items-center bg-[#7B61FF]/10 text-[#7B61FF] px-3 py-1 rounded-full text-xs border border-[#7B61FF]/20">
                    <Zap className="h-3 w-3 mr-1" />
                    Instant
                  </div>
                  <div className="flex items-center bg-[#A085FF]/10 text-[#A085FF] px-3 py-1 rounded-full text-xs border border-[#A085FF]/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-xl backdrop-blur-sm">
                  <p className="text-[#FF5C5C] text-sm text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#E0E0E0]">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00CFFF]/20 to-[#7B61FF]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5 transition-colors group-focus-within:text-[#00CFFF]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#2A2A2A]/50 backdrop-blur-sm border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300 hover:bg-[#2A2A2A]/70"
                        placeholder="Enter your email"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00CFFF]/20 to-[#7B61FF]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5 transition-colors group-focus-within:text-[#00CFFF]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-14 py-4 bg-[#2A2A2A]/50 backdrop-blur-sm border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-xl focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300 hover:bg-[#2A2A2A]/70"
                        placeholder="Enter your password"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] hover:text-[#00CFFF] transition-colors p-1 rounded-lg hover:bg-[#2A2A2A]/50"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 group-hover:scale-[0.98] flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-[#A0A0A0]">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-[#00CFFF] hover:text-[#0AC5FF] font-medium transition-colors hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-[#1E1E1E]/60 backdrop-blur-sm rounded-xl p-3 border border-[#2A2A2A]/50">
              <div className="text-[#00CFFF] font-bold text-lg">50K+</div>
              <div className="text-[#A0A0A0] text-xs">Users</div>
            </div>
            <div className="bg-[#1E1E1E]/60 backdrop-blur-sm rounded-xl p-3 border border-[#2A2A2A]/50">
              <div className="text-[#7B61FF] font-bold text-lg">1M+</div>
              <div className="text-[#A0A0A0] text-xs">Orders</div>
            </div>
            <div className="bg-[#1E1E1E]/60 backdrop-blur-sm rounded-xl p-3 border border-[#2A2A2A]/50">
              <div className="text-[#A085FF] font-bold text-lg">99.9%</div>
              <div className="text-[#A0A0A0] text-xs">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;