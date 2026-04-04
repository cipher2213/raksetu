import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, TrendingUp, Activity, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SupabaseClient } from '@supabase/supabase-js';

interface DashboardProps {
  supabase: SupabaseClient;
}

interface WorkerData {
  id: string;
  name: string;
  email: string;
  weekly_earnings: number;
  work_type: 'Food Delivery' | 'Grocery Delivery' | 'E-commerce Delivery' | null;
  hours_per_day: number | null;
  vehicle_type: 'Bike' | 'Bicycle' | 'EV' | null;
}

interface DisruptionResult {
  score: number;
  status: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface PayoutResult {
  score: number;
  baseAmount: number;
  amount: number;
  percentage: number;
  multipliers: {
    workType: number;
    hoursPerDay: number;
    vehicleType: number;
    total: number;
  };
  explanation: string;
}

interface Claim {
  id: string;
  disruption_score: number;
  payout_amount: number;
  fraud_flagged: boolean;
  claim_status?: string;
  created_at: string;
}

export default function Dashboard({ supabase }: DashboardProps) {
  const navigate = useNavigate();
  const [workerData, setWorkerData] = useState<WorkerData | null>(null);
  const [disruption, setDisruption] = useState<DisruptionResult | null>(null);
  const [payout, setPayout] = useState<PayoutResult | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState({
    disruption: false,
    payout: false,
    claim: false,
  });
  const [error, setError] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState('');

  useEffect(() => {
    fetchWorkerData();
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const fetchWorkerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('gig_workers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/onboarding', { replace: true });
        return;
      }

      setWorkerData(data);
    } catch (err) {
      const error = err as Error | { message: string };
      setError('message' in error ? error.message : 'Failed to fetch worker data');
    }
  };

  const fetchClaims = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (err) {
      const error = err as Error | { message: string };
      setError('message' in error ? error.message : 'Failed to fetch claims');
    }
  };

  const handleCheckDisruption = async () => {
    setClaimSubmitted(false);
    setClaimSuccessMessage('');
    setLoading({ ...loading, disruption: true });
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const score = Math.floor(Math.random() * 101);
      let status: 'LOW' | 'MEDIUM' | 'HIGH';

      if (score < 40) {
        status = 'LOW';
      } else if (score < 70) {
        status = 'MEDIUM';
      } else {
        status = 'HIGH';
      }

      const { error: insertError } = await supabase
        .from('disruption_checks')
        .insert({
          user_id: user.id,
          disruption_score: score,
          status: status,
        });

      if (insertError) throw insertError;

      setDisruption({ score, status });
    } catch (err) {
      const error = err as Error | { message: string };
      setError('message' in error ? error.message : 'Failed to check disruption');
    } finally {
      setLoading({ ...loading, disruption: false });
    }
  };

  const handleCalculatePayout = () => {
    if (!disruption) {
      setError('Please check disruption first');
      return;
    }

    if (!workerData) {
      setError('Worker profile not available');
      return;
    }

    setClaimSubmitted(false);
    setClaimSuccessMessage('');

    const score = disruption.score;
    let baseAmount = 0;
    let percentage = 0;

    if (score < 40) {
      percentage = 0;
    } else if (score < 70) {
      percentage = 30;
    } else {
      percentage = 60;
    }

    baseAmount = (workerData.weekly_earnings * percentage) / 100;

    const getWorkTypeMultiplier = (workType: WorkerData['work_type']) => {
      if (workType === 'Food Delivery') return 1.2;
      if (workType === 'Grocery Delivery') return 1.1;
      return 1.0;
    };

    const getHoursMultiplier = (hours: WorkerData['hours_per_day']) => {
      if (!hours && hours !== 0) return 1.0;
      if (hours > 8) return 1.2;
      if (hours >= 5) return 1.0;
      return 0.8;
    };

    const getVehicleMultiplier = (vehicle: WorkerData['vehicle_type']) => {
      if (vehicle === 'Bike') return 1.2;
      if (vehicle === 'EV') return 0.9;
      return 1.0;
    };

    const workTypeMultiplier = getWorkTypeMultiplier(workerData.work_type);
    const hoursMultiplier = getHoursMultiplier(workerData.hours_per_day);
    const vehicleMultiplier = getVehicleMultiplier(workerData.vehicle_type);
    const totalMultiplier = workTypeMultiplier * hoursMultiplier * vehicleMultiplier;
    const finalAmount = baseAmount * totalMultiplier;

    const generatePayoutExplanation = () => {
      const hours = workerData.hours_per_day ?? 0;
      const workType = workerData.work_type ?? 'E-commerce Delivery';
      const vehicleType = workerData.vehicle_type ?? 'Bicycle';

      if (score < 40) {
        return 'Low disruption detected, so no payout was triggered. Profile risk signals were evaluated, but base coverage remains inactive at this score.';
      }

      if (score >= 70) {
        if (vehicleType === 'Bike' && hours > 8) {
          return 'High disruption detected. As a bike-based delivery worker with long working hours, your risk exposure is higher, resulting in increased payout.';
        }
        return `High disruption detected. Your ${workType.toLowerCase()} profile and current work pattern increased risk weighting, so compensation was adjusted upward.`;
      }

      if (hours > 8 || workType === 'Food Delivery') {
        return 'Moderate disruption detected. Based on your working hours and delivery type, your compensation has been adjusted accordingly.';
      }

      return `Moderate disruption detected. Your ${vehicleType.toLowerCase()} usage and work profile were factored in to personalize the payout amount.`;
    };

    setPayout({
      score,
      baseAmount,
      amount: finalAmount,
      percentage,
      multipliers: {
        workType: workTypeMultiplier,
        hoursPerDay: hoursMultiplier,
        vehicleType: vehicleMultiplier,
        total: totalMultiplier,
      },
      explanation: generatePayoutExplanation(),
    });
  };

  const handleClaimPayout = async () => {
    if (!payout || !disruption) {
      setError('Please calculate payout first');
      return;
    }

    if (claimSubmitted) {
      return;
    }

    setClaimSuccessMessage('');
    setLoading({ ...loading, claim: true });
    setError('');

    try {
      // Demo-only claim simulation (no backend dependency).
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const formattedAmount = payout.amount.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      });

      setClaimSubmitted(true);
      setClaimSuccessMessage(
        `Payout initiated successfully. Based on your disruption profile, ₹${formattedAmount} will be credited within 24 hours.`
      );
    } catch {
      setError('Unable to submit claim right now. Please try again.');
    } finally {
      setLoading({ ...loading, claim: false });
    }
  };

  const getClaimStatus = (claim: Claim) => {
    if (claim.claim_status) {
      return claim.claim_status;
    }

    return claim.fraud_flagged ? 'REJECTED' : 'APPROVED';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LOW':
        return 'text-green-400';
      case 'MEDIUM':
        return 'text-yellow-400';
      case 'HIGH':
        return 'text-red-400';
      case 'APPROVED':
        return 'text-green-400';
      case 'REJECTED':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'LOW':
        return 'bg-green-950/50 border-green-500/20';
      case 'MEDIUM':
        return 'bg-yellow-950/50 border-yellow-500/20';
      case 'HIGH':
        return 'bg-red-950/50 border-red-500/20';
      case 'APPROVED':
        return 'bg-green-950/50 border-green-500/20';
      case 'REJECTED':
        return 'bg-red-950/50 border-red-500/20';
      default:
        return 'bg-gray-800/50 border-gray-500/20';
    }
  };

  if (!workerData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Activity className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-500/50 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="stat-box border-2 border-teal-500/20">
          <p className="text-gray-400 text-sm font-medium mb-2">Worker Name</p>
          <p className="text-2xl font-bold text-gray-50">{workerData.name}</p>
          <p className="text-gray-500 text-sm mt-2">{workerData.email}</p>
        </div>

        <div className="stat-box border-2 border-teal-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Weekly Income</p>
              <p className="text-2xl font-bold text-teal-400">₹{workerData.weekly_earnings.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`card border-2 ${disruption ? 'border-teal-500/20' : 'border-gray-700'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-50">Disruption Score</h3>
            <Zap className="w-5 h-5 text-teal-500" />
          </div>

          {disruption ? (
            <div>
              <p className={`text-3xl font-bold mb-2 ${getStatusColor(disruption.status)}`}>
                {disruption.score}
              </p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(disruption.status)}`}>
                {disruption.status}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-4">No disruption check yet</p>
          )}

          <button
            onClick={handleCheckDisruption}
            disabled={loading.disruption}
            className="btn-primary mt-4"
          >
            {loading.disruption ? 'Checking...' : 'Check Disruption'}
          </button>
        </div>

        <div className={`card border-2 ${payout ? 'border-teal-500/20' : 'border-gray-700'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-50">Payout Eligible</h3>
            <AlertTriangle className="w-5 h-5 text-teal-500" />
          </div>

          {payout ? (
            <div>
              <p className="text-3xl font-bold text-teal-400 mb-2">
                ₹{payout.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Base: {payout.percentage}% (₹{payout.baseAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })})
              </p>
              <p className="text-gray-400 text-xs mb-4">
                Multipliers: Work {payout.multipliers.workType} x Hours {payout.multipliers.hoursPerDay} x Vehicle {payout.multipliers.vehicleType} = {payout.multipliers.total.toFixed(2)}x
              </p>

              <div className="p-3 rounded-lg bg-gray-950/60 border border-gray-800">
                <p className="text-teal-400 text-xs font-semibold mb-1">AI Insight</p>
                <p className="text-gray-300 text-sm leading-relaxed">{payout.explanation}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-4">Calculate based on disruption</p>
          )}

          <button
            onClick={handleCalculatePayout}
            disabled={!disruption}
            className="btn-primary"
          >
            Calculate Payout
          </button>
        </div>

        <div className={`card border-2 ${payout ? 'border-teal-500/20' : 'border-gray-700'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-50">Claim Insurance</h3>
            <CheckCircle className="w-5 h-5 text-teal-500" />
          </div>

          {payout ? (
            <p className="text-gray-400 text-sm mb-4">
              Ready to claim ₹{payout.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          ) : (
            <p className="text-gray-400 text-sm mb-4">Calculate payout to claim</p>
          )}

          <button
            onClick={handleClaimPayout}
            disabled={!payout || loading.claim || claimSubmitted}
            className="btn-primary"
          >
            {claimSubmitted ? 'Claim Submitted' : loading.claim ? 'Submitting Claim...' : 'Claim Payout'}
          </button>

          {claimSubmitted && payout && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
              <p className="text-emerald-300 font-medium">Claim Submitted</p>
              <p className="text-gray-200 text-sm mt-1">
                ₹{payout.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} is being processed
              </p>
              <p className="text-emerald-200 text-xs mt-1">Expected Credit: Within 24 hours</p>
              <p className="text-gray-300 text-xs mt-2">{claimSuccessMessage}</p>
            </div>
          )}
        </div>
      </div>

      {claims.length > 0 && (
        <div className="card border-2 border-gray-700">
          <h3 className="text-lg font-semibold text-gray-50 mb-4">Claim History</h3>
          <div className="space-y-3">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className={`p-4 rounded-lg border ${getStatusBg(getClaimStatus(claim))}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-gray-50 font-medium">
                      ₹{claim.payout_amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-gray-400 text-sm">Disruption: {claim.disruption_score}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getStatusColor(getClaimStatus(claim))}`}>
                      {getClaimStatus(claim)}
                    </p>
                    {claim.fraud_flagged && (
                      <p className="text-red-400 text-xs mt-1">Fraud Detected</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-500 text-xs">
                  {new Date(claim.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
