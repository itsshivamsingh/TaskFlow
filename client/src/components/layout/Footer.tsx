import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">TaskFlow</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Plan Better. Work Smarter. Achieve More. A modern, production-grade task management system designed to streamline your workflow and supercharge productivity.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Task List
                </Link>
              </li>
              <li>
                <Link to="/kanban" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Kanban Board
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Calendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Authentication
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with MERN Stack & TypeScript <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
