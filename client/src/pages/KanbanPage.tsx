import React, { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { Task, TaskStatus } from '../types';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { TaskDetailsModal } from '../components/tasks/TaskDetailsModal';
import { DeleteConfirmationDialog } from '../components/common/DeleteConfirmationDialog';
import { Plus, RefreshCw, Kanban } from 'lucide-react';
import { toast } from 'sonner';

export const KanbanPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      // Fetch all tasks for the board
      const res = await taskService.getTasks({ limit: 100 });
      setTasks(res.data);
    } catch {
      toast.error('Failed to load Kanban tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleQuickAdd = (status: TaskStatus) => {
    setDefaultStatus(status);
    setTaskToEdit(null);
    setIsFormOpen(true);
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
      toast.success('Task deleted successfully');
      setIsDeleteOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Kanban className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Kanban Board</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag and drop task cards to progress work from To Do to Completed.
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
            title="Refresh board"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd('todo')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Board Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              className="bg-slate-100 dark:bg-slate-900/40 rounded-2xl p-4 h-96 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <KanbanBoard
          tasks={tasks}
          onTasksChange={(updated) => setTasks(updated)}
          onViewTask={(task) => {
            setSelectedTask(task);
            setIsDetailsOpen(true);
          }}
          onEditTask={handleOpenEdit}
          onDeleteTask={handleOpenDelete}
          onQuickAddTask={handleQuickAdd}
        />
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
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
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
