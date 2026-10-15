import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-indigo-50 dark:bg-indigo-950/50',
  iconTextColor = 'text-indigo-600 dark:text-indigo-400',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl ${iconBgColor} ${iconTextColor} flex items-center justify-center flex-shrink-0 shadow-xs`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">{subtitle}</p>
      )}
    </div>
  );
};
