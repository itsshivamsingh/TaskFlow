import React from 'react';
import { Task } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Link } from 'react-router-dom';

interface UpcomingDeadlinesProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  tasks,
  onSelectTask,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Upcoming Deadlines
            </h3>
          </div>
          <Link
            to="/tasks?dueDateFilter=upcoming"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {tasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No upcoming deadlines pending 🎉
          </p>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => {
              const d = new Date(task.dueDate);
              const isOverdue = isPast(d) && !isToday(d) && task.status !== 'completed';
              const dueToday = isToday(d);

              return (
                <div
                  key={task._id}
                  onClick={() => onSelectTask(task)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[11px] font-medium flex items-center gap-1 ${
                          isOverdue
                            ? 'text-rose-600 dark:text-rose-400'
                            : dueToday
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {dueToday ? 'Today' : format(d, 'MMM d, yyyy')}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {task.category || 'General'}
                      </span>
                    </div>
                  </div>

                  <PriorityBadge priority={task.priority} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
