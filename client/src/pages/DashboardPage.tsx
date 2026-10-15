import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { taskService } from '../services/taskService';
import { DashboardData, WeeklyProductivityDay, Task } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { WeeklyProductivityChart } from '../components/dashboard/WeeklyProductivityChart';
import { StatusDistributionChart } from '../components/dashboard/StatusDistributionChart';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { RecentTasks } from '../components/dashboard/RecentTasks';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';
import { DeleteConfirmationDialog } from '../components/common/DeleteConfirmationDialog';
import { EmptyState } from '../components/common/EmptyState';
import { StatCardSkeleton } from '../components/common/LoadingSkeleton';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [productivity, setProductivity] = useState<WeeklyProductivityDay[]>([]);

  // Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, prodRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getProductivity(),
      ]);
      setData(statsRes.data);
      setProductivity(prodRes.data);
    } catch (err: any) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Listen for global custom refresh events
    const handleGlobalRefresh = () => fetchDashboardData();
    window.addEventListener('taskflow:refresh', handleGlobalRefresh);
    return () => window.removeEventListener('taskflow:refresh', handleGlobalRefresh);
  }, [fetchDashboardData]);

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setIsDetailsOpen(false);
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (task: Task) => {
    setIsDetailsOpen(false);
    setTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete._id);
      toast.success('Task deleted');
      setIsDeleteOpen(false);
      setTaskToDelete(null);
      fetchDashboardData();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      await taskService.updateTaskStatus(task._id, newStatus);
      toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened');
      setIsDetailsOpen(false);
      fetchDashboardData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const summary = data?.summary;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your daily task overview and productivity performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchDashboardData();
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-xs"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
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

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <StatCard
            title="Total Tasks"
            value={summary.total}
            subtitle="All logged items"
            icon={CheckSquare}
            iconBgColor="bg-slate-100 dark:bg-slate-800"
            iconTextColor="text-slate-700 dark:text-slate-300"
          />
          <StatCard
            title="Completed"
            value={summary.completed}
            subtitle={`${summary.completionRate}% completion`}
            icon={CheckCircle2}
            iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
            iconTextColor="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            title="Pending (Todo)"
            value={summary.todo}
            subtitle="Awaiting action"
            icon={Clock}
            iconBgColor="bg-slate-100 dark:bg-slate-800"
            iconTextColor="text-slate-500 dark:text-slate-400"
          />
          <StatCard
            title="In Progress"
            value={summary.inProgress}
            subtitle="Currently active"
            icon={Sparkles}
            iconBgColor="bg-indigo-50 dark:bg-indigo-950/50"
            iconTextColor="text-indigo-600 dark:text-indigo-400"
          />
          <StatCard
            title="Due Today"
            value={summary.dueToday}
            subtitle="Targeted for today"
            icon={Calendar}
            iconBgColor="bg-blue-50 dark:bg-blue-950/50"
            iconTextColor="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Overdue"
            value={summary.overdue}
            subtitle="Requires attention"
            icon={AlertTriangle}
            iconBgColor="bg-rose-50 dark:bg-rose-950/50"
            iconTextColor="text-rose-600 dark:text-rose-400"
          />
        </div>
      ) : null}

      {/* Main Charts Row */}
      {!loading && summary && summary.total === 0 ? (
        <EmptyState
          title="No tasks in your workspace yet"
          description="Create your first task to unlock live productivity analytics, Kanban boards, and deadline tracking."
          actionText="Create Your First Task"
          onAction={() => {
            setTaskToEdit(null);
            setIsFormOpen(true);
          }}
          className="my-8"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeeklyProductivityChart data={productivity} />
            </div>
            <div>
              <StatusDistributionChart
                data={data?.statusDistribution || []}
                completionRate={summary?.completionRate || 0}
              />
            </div>
          </div>

          {/* Lower Widgets: Upcoming Deadlines & Recently Updated */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UpcomingDeadlines
              tasks={data?.upcomingDeadlines || []}
              onSelectTask={handleOpenDetails}
            />
            <RecentTasks
              tasks={data?.recentTasks || []}
              onSelectTask={handleOpenDetails}
            />
          </div>
        </>
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        taskToEdit={taskToEdit}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        task={selectedTask}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onToggleStatus={handleToggleStatus}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${taskToDelete?.title}"? This action cannot be undone.`}
        onCancel={() => {
          setIsDeleteOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
