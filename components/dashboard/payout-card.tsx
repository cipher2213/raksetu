'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

interface PayoutData {
  amount: number;
  claimable: boolean;
}

export const PayoutCard: React.FC = () => {
  const [payout, setPayout] = useState<PayoutData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleCalculatePayout = async () => {
    setIsCalculating(true);
    try {
      const response = await api.post('/payout/calculate');
      setPayout(response.data.data);
      toast.success('Payout calculated');
    } catch (error) {
      console.error('Failed to calculate payout:', error);
      toast.error('Failed to calculate payout');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClaimPayout = async () => {
    setIsClaiming(true);
    try {
      await api.post('/payout/claim');
      setPayout(null);
      toast.success('Payout claimed successfully');
    } catch (error) {
      console.error('Failed to claim payout:', error);
      toast.error('Failed to claim payout');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Card className="glassmorphism-dark border-white/10 card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20">
            <Wallet className="h-5 w-5 text-green-400" />
          </div>
          Compensation
        </CardTitle>
        <CardDescription>Calculate and claim your disruption compensation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payout ? (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl p-4 border border-green-500/20">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Compensation Available</p>
              <p className="text-4xl font-bold gradient-text mb-3">₹{payout.amount.toFixed(0)}</p>
              {!payout.claimable && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-500/10 rounded-lg p-2 border border-yellow-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <span>Minimum threshold of ₹500 not yet reached</span>
                </div>
              )}
            </div>

            {payout.claimable && (
              <Button
                onClick={handleClaimPayout}
                disabled={isClaiming}
                className="w-full bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 btn-shimmer"
              >
                {isClaiming ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  'Claim Compensation'
                )}
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={handleCalculatePayout}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 btn-shimmer"
          >
            {isCalculating ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Calculating...
              </>
            ) : (
              'Calculate Compensation'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
