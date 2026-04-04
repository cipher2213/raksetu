'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

interface EarningsData {
  weeklyEarnings: number;
  totalEarnings: number;
}

export const EarningsCard: React.FC = () => {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await api.get('/earnings');
        setEarnings(response.data.data);
      } catch (error) {
        console.error('Failed to fetch earnings:', error);
        toast.error('Failed to load earnings data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (isLoading) {
    return (
      <Card className="glassmorphism-dark border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20">
              <TrendingUp className="h-5 w-5 text-teal-400" />
            </div>
            Weekly Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <Spinner className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism-dark border-white/10 card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20">
            <TrendingUp className="h-5 w-5 text-teal-400" />
          </div>
          Weekly Income
        </CardTitle>
        <CardDescription>Track your weekly and total earnings from deliveries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-xl p-4 border border-white/10">
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">This Week</p>
            <p className="text-3xl font-bold gradient-text">₹{earnings?.weeklyEarnings.toFixed(0)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-xl p-4 border border-white/10">
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Total</p>
            <p className="text-3xl font-bold gradient-text">₹{earnings?.totalEarnings.toFixed(0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
