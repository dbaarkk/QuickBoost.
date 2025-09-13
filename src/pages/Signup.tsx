import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, TrendingUp } from 'lucide-react';
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
  
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect immediately when user is authenticated
  useEffect(() => {
    if (user && !loading) {
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await signUp(formData.email, formData.password, {
        first_name: firstName,
        last_name: lastName,
        phone: ''
      });
      
      // Redirect happens via useEffect when user state updates
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    }
  };

  // Don't render if user is already authenticated
  if (user && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen auth-background-animated flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-[#00CFFF]" />
            <span className="ml-2 text-2xl font-black text-white tracking-tight">QuickBoost</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-white/70 font-medium">Join QuickBoost and grow your social media</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-lg">
            <p className="text-[#FF5C5C] text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300 backdrop-blur-sm"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300 backdrop-blur-sm"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary btn-modern disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00CFFF] hover:text-[#0AC5FF] font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;