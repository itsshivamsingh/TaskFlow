import React from 'react';
import { TaskQueryParams, Category } from '../../types';
import { Search, Filter, RotateCcw, ArrowUpDown, X } from 'lucide-react';

interface TaskFilterBarProps {
  filters: TaskQueryParams;
  categories: Category[];
  onFilterChange: (newFilters: Partial<TaskQueryParams>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  categories,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const defaultCategories = ['Work', 'Personal', 'Study', 'Projects', 'Other'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 mb-6 transition-colors">
      {/* Search and Top Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-900"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '', page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {/* Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Priority
          </label>
          <select
            value={filters.priority || 'all'}
            onChange={(e) => onFilterChange({ priority: e.target.value, page: 1 })}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Category
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {defaultCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            {categories
              .filter((c) => !defaultCategories.includes(c.name))
              .map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {/* Due Date Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Timeline
          </label>
          <select
            value={filters.dueDateFilter || 'all'}
            onChange={(e) => onFilterChange({ dueDateFilter: e.target.value, page: 1 })}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Due Dates</option>
            <option value="today">Due Today</option>
            <option value="this_week">Due This Week</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Sort By
          </label>
          <div className="flex items-center gap-1">
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any, page: 1 })}
              className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                  page: 1,
                })
              }
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
              title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
