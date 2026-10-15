import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService, ForgotPasswordResponse } from '../services/authService';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Sparkles, Mail, AlertCircle, Loader2, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ForgotPasswordResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());
      setResult(res);
      toast.success('Reset instructions generated.');
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
            TaskFlow
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Reset your password
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your email and we'll generate a secure, single-use reset token.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl border border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{result.message}</span>
              </div>

              {result.developmentToken && (
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                    <KeyRound className="w-4 h-4" />
                    <span>Development Environment Mode</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    SMTP is not configured in server/.env, so the secure single-use token was returned for local testing:
                  </p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all select-all border border-indigo-100 dark:border-indigo-900">
                    {result.developmentToken}
                  </div>
                  <Link
                    to={`/reset-password?token=${result.developmentToken}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                  >
                    <span>Click here to Reset Password Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Send Reset Instructions</span>
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
