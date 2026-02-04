"use client"
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingDown, PieChart, Lock, Zap, BarChart3 } from 'lucide-react'

export const metadata = {
  title: 'ExpenseFlow - Smart Expense Tracking',
  description: 'Take control of your finances with intelligent expense tracking and beautiful insights',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Announcement Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/30 px-4 py-2 text-sm text-secondary-foreground border border-secondary/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              New: Budget alerts and spending goals
            </div>
          </div>

          {/* Main Headline */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Take control of your <span className="text-primary">money</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance mb-8">
              Track expenses effortlessly, understand your spending patterns, and achieve your financial goals with intelligent insights and beautiful dashboards.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="gap-2 px-8">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              View Demo
            </Button>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Smart Categorization</h3>
              <p className="text-muted-foreground">Automatically categorize expenses and see exactly where your money goes.</p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Visual Insights</h3>
              <p className="text-muted-foreground">Beautiful charts and graphs that make your spending patterns crystal clear.</p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Bank-Level Security</h3>
              <p className="text-muted-foreground">Your financial data is encrypted and secured with industry-standard protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful features designed for you</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to take control of your finances in one beautiful, intuitive platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Real-Time Analytics</h3>
                <p className="text-muted-foreground">Get instant insights into your spending with real-time transaction tracking and automated categorization.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Budget Goals</h3>
                <p className="text-muted-foreground">Set spending limits and get smart alerts when you're approaching your budget thresholds.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Spending Trends</h3>
                <p className="text-muted-foreground">Understand your spending habits over time with detailed trend analysis and monthly comparisons.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Account Support</h3>
                <p className="text-muted-foreground">Sync and manage expenses from multiple accounts and payment methods in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">$2.5B</div>
              <p className="text-muted-foreground">Tracked Expenses</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">4.8/5</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Start taking control today</h2>
          <p className="text-lg text-muted-foreground mb-8">Join thousands of people who have transformed their financial lives with ExpenseFlow.</p>
          <Button size="lg" className="gap-2 px-8 mb-4">
            Create Your Free Account
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-sm text-muted-foreground">No credit card required. Cancel anytime.</p>
        </div>
      </section>
    </div>
  )
}