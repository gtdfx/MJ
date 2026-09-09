import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    // Small delay to simulate authentication request
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(result.error);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-charcoal relative overflow-hidden flex items-center justify-center px-4">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/3 right-10 w-24 h-24 border border-gold/20 rotate-45 hidden md:block" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/images/logo-white.png" alt="Etho-Can Gemstones logo" className="w-16 h-16 object-contain mx-auto mb-4" />
          <div className="inline-flex flex-col mx-auto">
            <h1 className="font-playfair text-3xl text-white tracking-[3px] uppercase">Etho-Can</h1>
            <span aria-hidden="true" className="flex justify-between uppercase text-[10px] text-gold-light mt-1.5">
              {'Gemstones'.split('').map((ch, i) => <span key={i}>{ch}</span>)}
            </span>
          </div>
          <p className="text-white/50 text-xs tracking-[3px] uppercase mt-3">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={18} className="text-gold" />
            <h2 className="font-playfair text-xl text-charcoal">Sign In</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="mesfin@mj.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-dark text-charcoal font-medium py-3 rounded-lg text-sm tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-[11px] text-gray-400 text-center mt-5">
            Authorized personnel only. Access is monitored.
          </p>
        </div>

        {/* Back to Store */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-sm transition-colors">
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </div>
      </motion.div>
    </div>
  );
}