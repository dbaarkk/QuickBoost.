import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { signIn, user } = useAuth();
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

    try {
      await signIn(email, password);
      // Redirect happens via useEffect when user state updates
    } catch (error: any) {
      setError(error.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2A2A2A] rounded-2xl shadow-2xl p-8 border border-[#2A2A2A]">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-[#00CFFF]" />
            <span className="ml-2 text-2xl font-bold text-[#E0E0E0]">QuickBoost</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#E0E0E0] mb-2">Welcome Back</h1>
          <p className="text-[#A0A0A0]">Sign in to your QuickBoost account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-lg">
            <p className="text-[#FF5C5C] text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-lg focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-[#1E1E1E] border border-[#2A2A2A] text-[#E0E0E0] placeholder-[#A0A0A0] rounded-lg focus:ring-2 focus:ring-[#00CFFF]/50 focus:border-[#00CFFF] transition-all duration-300"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00CFFF] to-[#0AC5FF] hover:from-[#0AC5FF] hover:to-[#00CFFF] text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-glow-cyan font-medium"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#A0A0A0]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#00CFFF] hover:text-[#0AC5FF] font-medium transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
