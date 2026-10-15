import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import { Task, TaskQueryParams, PaginationMeta, Category } from '../types';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { Pagination } from '../components/common/Pagination';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';
import { DeleteConfirmationDialog } from '../components/common/DeleteConfirmationDialog';
import { EmptyState } from '../components/common/EmptyState';
import { TableRowSkeleton } from '../components/common/LoadingSkeleton';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Check,
  Calendar,
  Layers,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { toast } from 'sonner';

export const TasksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState<TaskQueryParams>({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'all',
    priority: searchParams.get('priority') || 'all',
    category: searchParams.get('category') || 'all',
    dueDateFilter: searchParams.get('dueDateFilter') || 'all',
    sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 15,
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskService.getTasks(filters);
      setTasks(res.data);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res: { data: Category[] }) => {
        if (res.data) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (newFilters: Partial<TaskQueryParams>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      // Sync to URL params
      const params: Record<string, string> = {};
      if (updated.search) params.search = updated.search;
      if (updated.status && updated.status !== 'all') params.status = updated.status;
      if (updated.priority && updated.priority !== 'all') params.priority = updated.priority;
      if (updated.category && updated.category !== 'all') params.category = updated.category;
      if (updated.dueDateFilter && updated.dueDateFilter !== 'all')
        params.dueDateFilter = updated.dueDateFilter;
      if (updated.sortBy) params.sortBy = updated.sortBy;
      if (updated.sortOrder) params.sortOrder = updated.sortOrder;
      if (updated.page && updated.page > 1) params.page = updated.page.toString();
      setSearchParams(params);
      return updated;
    });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      dueDateFilter: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 15,
    });
  };

  const handleToggleComplete = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      await taskService.updateTaskStatus(task._id, nextStatus);
      toast.success(nextStatus === 'completed' ? 'Task completed' : 'Task reopened');
      fetchTasks();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete._id);
      toast.success('Task deleted successfully');
      setIsDeleteOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.status && filters.status !== 'all') ||
      (filters.priority && filters.priority !== 'all') ||
      (filters.category && filters.category !== 'all') ||
      (filters.dueDateFilter && filters.dueDateFilter !== 'all')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Task Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, filter, and organize your tasks in one unified view.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Card grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setTaskToEdit(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <TaskFilterBar
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Tasks Content */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left">
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No matching tasks found' : 'No tasks created yet'}
          description={
            hasActiveFilters
              ? 'Try modifying or clearing your filters to see more results.'
              : 'Add your first task to start organizing your work.'
          }
          actionText={hasActiveFilters ? 'Reset Filters' : 'Create Task'}
          onAction={
            hasActiveFilters
              ? handleClearFilters
              : () => {
                  setTaskToEdit(null);
                  setIsFormOpen(true);
                }
          }
        />
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-4">Task</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tasks.map((task) => {
                  const dueDateObj = new Date(task.dueDate);
                  const isOverdue =
                    isPast(dueDateObj) && !isToday(dueDateObj) && task.status !== 'completed';
                  const dueToday = isToday(dueDateObj) && task.status !== 'completed';

                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Checkbox status toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(task)}
                          className={`w-5 h-5 rounded-md mx-auto flex items-center justify-center border transition-all ${
                            task.status === 'completed'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                          }`}
                          title={task.status === 'completed' ? 'Reopen task' : 'Mark completed'}
                        >
                          {task.status === 'completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td
                        className="py-3.5 px-4 cursor-pointer max-w-xs md:max-w-md"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <p
                          className={`font-semibold line-clamp-1 transition-colors ${
                            task.status === 'completed'
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {task.category || 'General'}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={task.priority} />
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div
                          className={`flex items-center gap-1.5 text-xs font-medium ${
                            isOverdue
                              ? 'text-rose-600 dark:text-rose-400'
                              : dueToday
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {dueToday ? 'Today' : isOverdue ? 'Overdue' : format(dueDateObj, 'MMM d, yyyy')}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsDetailsOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTaskToEdit(task);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTaskToDelete(task);
                              setIsDeleteOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            meta={pagination}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </div>
      ) : (
        /* Card Grid View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => {
                  setSelectedTask(task);
                  setIsDetailsOpen(true);
                }}
                className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {task.category || 'General'}
                    </span>
                  </div>
                  <h3
                    className={`font-semibold text-sm line-clamp-2 ${
                      task.status === 'completed'
                        ? 'line-through text-slate-400'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(task.dueDate), 'MMM d')}
                  </span>
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>

          <Pagination
            meta={pagination}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </div>
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        taskToEdit={taskToEdit}
        onSuccess={() => fetchTasks()}
      />

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        task={selectedTask}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={(task) => {
          setIsDetailsOpen(false);
          setTaskToEdit(task);
          setIsFormOpen(true);
        }}
        onDelete={(task) => {
          setIsDetailsOpen(false);
          setTaskToDelete(task);
          setIsDeleteOpen(true);
        }}
        onToggleStatus={handleToggleComplete}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        onCancel={() => {
          setIsDeleteOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
