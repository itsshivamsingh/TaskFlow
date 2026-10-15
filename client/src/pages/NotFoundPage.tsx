import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 shadow-md">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        The link you followed may be broken or the page may have been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
