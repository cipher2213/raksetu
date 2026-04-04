'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface DisruptionStatus {
  score: number;
  status: 'safe' | 'warning' | 'critical';
  lastChecked: string;
}

export const DisruptionCard: React.FC = () => {
  const [status, setStatus] = useState<DisruptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckDisruption = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/disruption/check');
      setStatus(response.data.data);
      toast.success('Disruption check completed');
    } catch (error) {
      console.error('Failed to check disruption:', error);
      toast.error('Failed to check disruption status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'safe':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="glassmorphism-dark border-white/10 card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20">
            <AlertCircle className="h-5 w-5 text-cyan-400" />
          </div>
          Work Disruption Risk
        </CardTitle>
        <CardDescription>Real-time weather & pollution monitoring for your work area</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 border ${getStatusColor(status.status)} backdrop-blur-sm`}>
              <p className="text-xs font-bold mb-2 uppercase tracking-wide">Status</p>
              <p className="text-3xl font-bold mb-2">{status.status.toUpperCase()}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm">Risk Score: <span className="font-bold">{status.score.toFixed(1)}/100</span></p>
                <p className="text-xs">Last: {new Date(status.lastChecked).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleCheckDisruption}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 btn-shimmer"
        >
          {isLoading ? 'Checking...' : 'Check Risk Status'}
        </Button>
      </CardContent>
    </Card>
  );
};
