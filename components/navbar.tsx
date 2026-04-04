'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="border-b border-white/10 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl gradient-text">
            <div className="p-1 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            RakSetu
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user && (
              <>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground smooth-fade">
                  Dashboard
                </Link>
                <a href="#plans" className="text-sm text-muted-foreground hover:text-foreground smooth-fade">
                  Plans
                </a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground smooth-fade">
                  How it Works
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user.email}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
