import React from 'react';
import { Task } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Calendar, Tag, MoreHorizontal, Check, Edit2, Trash2, Eye } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete?: (task: Task) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onView,
  onEdit,
  onDelete,
  onToggleComplete,
  isDragging = false,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const dueDateObj = new Date(task.dueDate);
  const isOverdue = isPast(dueDateObj) && !isToday(dueDateObj) && task.status !== 'completed';
  const dueToday = isToday(dueDateObj) && task.status !== 'completed';

  return (
    <div
      className={`glass-card p-4 rounded-xl border transition-all duration-200 select-none group relative ${
        isDragging
          ? 'shadow-xl rotate-1 scale-102 border-indigo-400 bg-white/95 dark:bg-slate-900/95 ring-2 ring-indigo-500/20'
          : 'bg-white dark:bg-slate-900 hover:shadow-md border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Top Header: Priority, Category, Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {task.category || 'General'}
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-30 animate-scale-up">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onView(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Details</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Title & Quick Status Checkbox */}
      <div className="flex items-start gap-2.5 mb-2">
        {onToggleComplete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task);
            }}
            className={`mt-0.5 w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
              task.status === 'completed'
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
            }`}
            title={task.status === 'completed' ? 'Mark incomplete' : 'Mark completed'}
          >
            {task.status === 'completed' && <Check className="w-3 h-3 stroke-[3]" />}
          </button>
        )}

        <div className="flex-1 min-w-0" onClick={() => onView(task)}>
          <h3
            className={`text-sm font-semibold cursor-pointer line-clamp-2 transition-colors ${
              task.status === 'completed'
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Tags Preview */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-slate-400">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Bottom Footer: Due Date & Status Badge */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div
          className={`flex items-center gap-1 font-medium ${
            isOverdue
              ? 'text-rose-600 dark:text-rose-400'
              : dueToday
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
          title={`Due date: ${format(dueDateObj, 'PPP')}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {dueToday ? 'Due Today' : isOverdue ? 'Overdue' : format(dueDateObj, 'MMM d')}
          </span>
        </div>

        <StatusBadge status={task.status} showIcon={false} />
      </div>
    </div>
  );
};
