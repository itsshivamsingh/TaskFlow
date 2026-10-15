import React from 'react';
import { Task } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface RecentTasksProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const RecentTasks: React.FC<RecentTasksProps> = ({ tasks, onSelectTask }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recently Updated
            </h3>
          </div>
          <Link
            to="/tasks"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No tasks recorded yet.</p>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => onSelectTask(task)}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Updated {format(new Date(task.updatedAt), 'MMM d, h:mm a')}
                  </p>
                </div>

                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
