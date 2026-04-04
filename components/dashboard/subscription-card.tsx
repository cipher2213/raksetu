'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: number;
  coverage: string;
}

interface SubscriptionData {
  availablePlans: Plan[];
  currentPlan: Plan | null;
}

export const SubscriptionCard: React.FC = () => {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/subscription/plans');
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        toast.error('Failed to load subscription plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (isLoading) {
    return (
      <Card className="glassmorphism-dark border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            Protection Plans
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
            <Package className="h-5 w-5 text-blue-400" />
          </div>
          Protection Plans
        </CardTitle>
        <CardDescription>
          {data?.currentPlan ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Active: {data.currentPlan.name}
            </span>
          ) : (
            'No active plan - Choose one to get protected'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data?.currentPlan && (
          <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-green-600 mb-1 uppercase tracking-wide">Current Plan</p>
                <p className="text-2xl font-bold text-foreground">{data.currentPlan.name}</p>
                <p className="text-sm text-muted-foreground mt-2">{data.currentPlan.coverage}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold gradient-text">₹{data.currentPlan.price}</p>
                <p className="text-xs text-muted-foreground mt-1">per week</p>
              </div>
            </div>
          </div>
        )}

        {data && data.availablePlans.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-foreground uppercase tracking-wide">Other Plans</p>
            <div className="grid grid-cols-1 gap-2">
              {data.availablePlans.map((plan) => (
                <div key={plan.id} className="border border-white/10 rounded-xl p-4 hover:border-white/20 smooth-fade hover:bg-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-sm text-foreground">{plan.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{plan.coverage}</p>
                    </div>
                    <p className="text-xl font-bold gradient-text">₹{plan.price}</p>
                  </div>
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 mt-2">
                    Select Plan
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
