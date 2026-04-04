import { useEffect, useState } from 'react';
import { Activity, LogOut } from 'lucide-react';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { createClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-teal-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      {session ? (
        <>
          <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-teal-500" />
                <h1 className="text-2xl font-bold text-gray-50">RakSetu</h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </nav>
          <Dashboard supabase={supabase} />
        </>
      ) : (
        <AuthPage supabase={supabase} />
      )}
    </div>
  );
}

export default App;
