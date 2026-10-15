import React from 'react';
import { TaskPriority } from '../../types';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50 ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>Urgent</span>
        </span>
      );
    case 'high':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50 ${className}`}
        >
          <ArrowUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>High</span>
        </span>
      );
    case 'medium':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50 ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span>Medium</span>
        </span>
      );
    case 'low':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 ${className}`}
        >
          <ArrowDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          <span>Low</span>
        </span>
      );
  }
};
