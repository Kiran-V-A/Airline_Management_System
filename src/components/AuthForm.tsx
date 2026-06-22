'use client';
// ============================================
// AuthForm — Login / Signup Form Component
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string, fullName?: string) => Promise<void>;
  error?: string | null;
}

export default function AuthForm({ mode, onSubmit, error }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(email, password, mode === 'signup' ? fullName : undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card rounded-3xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl font-bold heading-font sky-text-gradient"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </motion.h1>
          <p className="text-sky-600/70 mt-2 text-sm">
            {mode === 'login'
              ? 'Sign in to access your flights'
              : 'Join us and start your journey'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name (Signup only) */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="flex items-center gap-1.5 text-sm font-medium text-sky-700 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="input-premium"
                required
              />
            </motion.div>
          )}

          {/* Email */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-sky-700 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-premium"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-sky-700 mb-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-premium pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="btn-gradient w-full flex items-center justify-center gap-2 !py-3.5 !text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </motion.button>
        </form>

        {/* Switch Mode Link */}
        <p className="text-center text-sm text-sky-600/70 mt-6">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-sky-600 hover:text-sky-700">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">
                Sign In
              </Link>
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}
