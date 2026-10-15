import React from 'react';

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
      <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
    </div>
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16 mb-2"></div>
    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-32"></div>
  </div>
);

export const TaskCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-14"></div>
    </div>
    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-5/6"></div>
    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="border-b border-slate-100 dark:border-slate-800/60 animate-pulse">
    <td className="py-4 px-4">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
    </td>
    <td className="py-4 px-4">
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
    </td>
    <td className="py-4 px-4 text-right">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16 ml-auto"></div>
    </td>
  </tr>
);
