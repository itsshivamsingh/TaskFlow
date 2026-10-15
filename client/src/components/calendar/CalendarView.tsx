import React, { useState } from 'react';
import { Task } from '../../types';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onCreateTaskForDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onSelectTask,
  onCreateTaskForDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-500';
      case 'high':
        return 'bg-amber-500';
      case 'medium':
        return 'bg-blue-500';
      case 'low':
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click on any date to schedule a new task
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Days Row */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div
            key={d}
            className="py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80 border-b border-slate-100 dark:border-slate-800">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dueDate), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onCreateTaskForDate(dateStr)}
              className={`min-h-[110px] md:min-h-[130px] p-2 transition-colors group relative cursor-pointer ${
                !isCurrentMonth
                  ? 'bg-slate-50/40 dark:bg-slate-950/40 text-slate-400 dark:text-slate-600'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50/80 dark:hover:bg-slate-850'
              } ${isDayToday ? 'ring-1 ring-inset ring-indigo-500/40 bg-indigo-50/10' : ''}`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isDayToday
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isCurrentMonth
                      ? 'text-slate-700 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateTaskForDate(dateStr);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  title="Add task on this day"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks preview in day cell */}
              <div className="space-y-1 overflow-hidden">
                {dayTasks.slice(0, 3).map((task) => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTask(task);
                      }}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium truncate flex items-center gap-1.5 border transition-all ${
                        isDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 line-through opacity-75'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-xs'
                      }`}
                      title={task.title}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getPriorityDot(
                          task.priority
                        )}`}
                      />
                      <span className="truncate">{task.title}</span>
                    </div>
                  );
                })}

                {dayTasks.length > 3 && (
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 px-1 pt-0.5">
                    +{dayTasks.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
