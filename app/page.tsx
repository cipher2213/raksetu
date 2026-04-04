'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Shield, TrendingUp, Zap, Bike, MapPin, DollarSign, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              Protecting Gig Worker Income
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-foreground text-balance leading-tight">
            Income Protection for <span className="gradient-text">Gig Workers</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Get protected from income loss due to weather, pollution, and external disruptions. Earn weekly protection as a delivery partner while building financial security.
          </p>
          <div className="flex gap-4 justify-center pt-6 flex-wrap">
            <Link href="/register">
              <Button size="lg" className="text-base btn-shimmer bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg">
                Protect My Income
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glassmorphism-dark card-hover border-white/10 hover:border-white/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20 w-fit">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Income Protection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Protect your weekly earnings from weather and external disruptions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism-dark card-hover border-white/10 hover:border-white/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20 w-fit">
                  <Zap className="h-8 w-8 text-teal-400" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Smart Risk Detection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI monitors weather and pollution to detect work disruptions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism-dark card-hover border-white/10 hover:border-white/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20 w-fit">
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Instant Payouts</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get compensated automatically when disruption thresholds are met
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism-dark card-hover border-white/10 hover:border-white/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20 w-fit">
                  <Bike className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Built for Gig Workers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Designed for delivery partners with simple weekly plans
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/10">
          <div className="text-center">
            <p className="text-4xl font-bold gradient-text mb-2">50K+</p>
            <p className="text-muted-foreground">Gig Workers Protected</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold gradient-text mb-2">₹125Cr+</p>
            <p className="text-muted-foreground">Total Coverage Disbursed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold gradient-text mb-2">₹850</p>
            <p className="text-muted-foreground">Avg Weekly Protection</p>
          </div>
        </div>
      </main>
    </div>
  );
}
