import React from 'react';
import { TaskStatus } from '../../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true,
}) => {
  switch (status) {
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50 ${className}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
          <span>Completed</span>
        </span>
      );
    case 'in_progress':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/50 ${className}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />}
          <span>In Progress</span>
        </span>
      );
    case 'todo':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${className}`}
        >
          {showIcon && <Circle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
          <span>To Do</span>
        </span>
      );
  }
};
