import { useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface AuthPageProps {
  supabase: SupabaseClient;
}

export default function AuthPage({ supabase }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    weeklyEarnings: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          const { error: insertError } = await supabase
            .from('gig_workers')
            .insert({
              user_id: data.user.id,
              name: formData.name,
              email: formData.email,
              weekly_earnings: parseFloat(formData.weeklyEarnings) || 0,
            });

          if (insertError) throw insertError;
        }
      }
    } catch (err) {
      const error = err as Error | { message: string };
      setError('message' in error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card border-2 border-teal-500/20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Activity className="w-8 h-8 text-teal-500" />
            <h1 className="text-3xl font-bold text-gray-50">RakSetu</h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-50 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-950/50 border border-red-500/50 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="input-field"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />

            {!isLogin && (
              <input
                type="number"
                name="weeklyEarnings"
                placeholder="Weekly Earnings (₹)"
                value={formData.weeklyEarnings}
                onChange={handleChange}
                required={!isLogin}
                className="input-field"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '', weeklyEarnings: '' });
                }}
                className="ml-2 text-teal-500 hover:text-teal-400 font-medium transition"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          AI-powered parametric insurance for gig workers
        </p>
      </div>
    </div>
  );
}
