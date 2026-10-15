import React, { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Task } from '../types';
import { CalendarView } from '../components/calendar/CalendarView';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';
import { DeleteConfirmationDialog } from '../components/common/DeleteConfirmationDialog';
import { Plus, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

export const CalendarPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialDueDate, setInitialDueDate] = useState<string>('');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await taskService.getTasks({ limit: 100 });
      setTasks(res.data);
    } catch {
      toast.error('Failed to load calendar tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateForDate = (dateStr: string) => {
    setInitialDueDate(dateStr);
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete._id);
      toast.success('Task deleted');
      setIsDeleteOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Task Calendar</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Plan deadlines and inspect your monthly workflow schedule.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchTasks();
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-xs"
            title="Refresh schedule"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setInitialDueDate(new Date().toISOString().split('T')[0]);
              setTaskToEdit(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 h-96 border border-slate-200 dark:border-slate-800 animate-pulse" />
      ) : (
        <CalendarView
          tasks={tasks}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsDetailsOpen(true);
          }}
          onCreateTaskForDate={handleCreateForDate}
        />
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={isFormOpen}
        initialDueDate={initialDueDate}
        taskToEdit={taskToEdit}
        onClose={() => setIsFormOpen(false)}
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
        onToggleStatus={async (task) => {
          const next = task.status === 'completed' ? 'todo' : 'completed';
          await taskService.updateTaskStatus(task._id, next);
          toast.success(next === 'completed' ? 'Task completed' : 'Task reopened');
          setIsDetailsOpen(false);
          fetchTasks();
        }}
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
