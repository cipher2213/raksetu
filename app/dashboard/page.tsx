'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/lib/auth-context';
import { EarningsCard } from '@/components/dashboard/earnings-card';
import { SubscriptionCard } from '@/components/dashboard/subscription-card';
import { DisruptionCard } from '@/components/dashboard/disruption-card';
import { PayoutCard } from '@/components/dashboard/payout-card';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Income Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back, <span className="font-semibold text-foreground">{user.email}</span></p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2 animate-slide-in">
            <EarningsCard />
          </div>
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <SubscriptionCard />
          </div>
          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <DisruptionCard />
          </div>
        </div>

        {/* Compensation Section */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <PayoutCard />
        </div>
      </main>
    </div>
  );
}
