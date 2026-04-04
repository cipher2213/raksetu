import { useEffect, useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';

interface OnboardingProps {
  supabase: SupabaseClient;
}

export default function Onboarding({ supabase }: OnboardingProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [weeklyEarnings, setWeeklyEarnings] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkExistingProfile = async () => {
      setChecking(true);
      setError('');

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          navigate('/login', { replace: true });
          return;
        }

        const { data, error: profileError } = await supabase
          .from('gig_workers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (data) {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        const appError = err as Error | { message?: string };
        setError('message' in appError ? appError.message || 'Failed to verify profile' : 'Failed to verify profile');
      } finally {
        setChecking(false);
      }
    };

    void checkExistingProfile();
  }, [navigate, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      const earningsValue = parseFloat(weeklyEarnings);
      if (Number.isNaN(earningsValue) || earningsValue < 0) {
        setError('Please enter a valid weekly earnings value.');
        return;
      }

      const { data: existingProfile, error: checkError } = await supabase
        .from('gig_workers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingProfile) {
        navigate('/dashboard', { replace: true });
        return;
      }

      const { error: insertError } = await supabase.from('gig_workers').insert({
        id: user.id,
        user_id: user.id,
        name: name.trim(),
        email: user.email ?? '',
        weekly_earnings: earningsValue,
      });

      if (insertError) {
        throw insertError;
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const appError = err as Error | { message?: string };
      setError('message' in appError ? appError.message || 'Failed to save profile' : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Activity className="w-10 h-10 text-teal-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Checking profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md card border-2 border-teal-500/20">
        <h2 className="text-2xl font-semibold text-gray-50 text-center mb-6">Set Up Your Profile</h2>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-950/50 border border-red-500/50 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />

          <input
            type="number"
            placeholder="Weekly Earnings"
            value={weeklyEarnings}
            onChange={(e) => setWeeklyEarnings(e.target.value)}
            min="0"
            step="0.01"
            required
            className="input-field"
          />

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
