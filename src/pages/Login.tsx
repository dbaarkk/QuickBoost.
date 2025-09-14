import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect immediately when user is authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Don't render if user is already authenticated
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signIn(email, password);
      // Immediate redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error.message);
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account.');
      } else if (error.message.includes('User not found')) {
        setError('Email not registered. Please sign up first.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen auth-background-animated flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-[#00CFFF]" />
            <span className="ml-2 text-2xl font-black text-white tracking-tight">QuickBoost</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-white/70 font-medium">Sign in to your QuickBoost account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-lg">
            <p className="text-[#FF5C5C] text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={false}
            className="w-full btn-primary btn-modern disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#00CFFF] hover:text-[#0AC5FF] font-bold transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;