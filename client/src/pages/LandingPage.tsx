import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Footer } from '../components/layout/Footer';
import {
  Sparkles,
  CheckCircle2,
  Kanban,
  Calendar,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Zap,
  Target,
  Layers,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Public Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              TaskFlow
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 flex justify-center">
          <div className="w-[700px] h-[400px] bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full blur-[140px] transform -translate-y-1/2"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Full-Stack MERN Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Plan Better. Work Smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
              Achieve More.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The high-performance task management workspace built for individuals and teams. Streamline workflows, eliminate missed deadlines, and visualize your progress with real-time analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
            >
              <span>{isAuthenticated ? 'Go to Your Workspace' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all shadow-xs"
            >
              <span>Explore Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights & Features Grid */}
      <section className="py-16 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Engineered for Modern Productivity
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Everything you need to plan your week, collaborate effortlessly, and hit every deadline without friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Interactive Kanban Board
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Drag and drop tasks smoothly between columns. Instant state updates backed by automated MongoDB synchronization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Calendar Timeline
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                View due dates at a glance on an interactive monthly grid. Click any day to quickly schedule a task.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Analytics & Weekly Trends
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Track completion percentage, overdue tasks, and daily productivity charts powered by live MongoDB calculations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Categories & Custom Tags
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Organize by Work, Personal, Study, or Projects. Add custom tags and filter quickly by any criterion.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Priorities & Deadlines
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Mark tasks as Urgent, High, Medium, or Low. Never miss a critical deadline with automated overdue indicators.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Enterprise-Grade Security
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                HttpOnly cookies, bcrypt hashing, Helmet security headers, CORS origin verification, and strict user ownership isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              How TaskFlow Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Three simple steps to transform your daily workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create Your Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sign up in seconds. Your secure MongoDB workspace is provisioned instantly.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Organize & Prioritize
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Add tasks, assign categories and due dates, and arrange cards on your Kanban board.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Conquer & Measure
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete tasks, celebrate milestones, and watch your weekly productivity chart climb.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-700 text-white p-8 md:p-12 text-center shadow-xl space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Ready to take control of your time?
            </h2>
            <p className="text-sm md:text-base text-indigo-100 max-w-xl mx-auto">
              Join TaskFlow now and experience a modern, stress-free way to manage tasks and achieve your goals.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
