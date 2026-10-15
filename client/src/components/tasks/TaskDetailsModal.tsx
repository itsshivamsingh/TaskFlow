import React from 'react';
import { Task } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  X,
  Calendar,
  Clock,
  Tag,
  Folder,
  Edit,
  Trash2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (!isOpen || !task) return null;

  const dueDateObj = new Date(task.dueDate);
  const isOverdue = isPast(dueDateObj) && !isToday(dueDateObj) && task.status !== 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-scale-up"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {task.title}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <Folder className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {task.category || 'General'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Description
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
              {task.description || (
                <span className="italic text-slate-400">No detailed description provided.</span>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Due Date */}
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-slate-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Due Date
              </span>
              <span
                className={`font-semibold ${
                  isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {format(dueDateObj, 'PPP')} {isOverdue && '(Overdue)'}
              </span>
            </div>

            {/* Start Date */}
            {task.startDate && (
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Start Date
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {format(new Date(task.startDate), 'PPP')}
                </span>
              </div>
            )}

            {/* Created Timestamp */}
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-slate-400 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Created
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {format(new Date(task.createdAt), 'PPP p')}
              </span>
            </div>

            {/* Completed At Timestamp */}
            {task.completedAt && (
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                <span className="text-emerald-600 dark:text-emerald-400 block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed On
                </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {format(new Date(task.completedAt), 'PPP p')}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onToggleStatus(task)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs ${
              task.status === 'completed'
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {task.status === 'completed' ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Task</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
