import React from 'react';
import { WeeklyProductivityDay } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface WeeklyProductivityChartProps {
  data: WeeklyProductivityDay[];
}

export const WeeklyProductivityChart: React.FC<WeeklyProductivityChartProps> = ({ data }) => {
  const totalCompletedInWeek = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Weekly Productivity</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tasks completed over the past 7 days
          </p>
        </div>

        <div className="text-right">
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            {totalCompletedInWeek}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">done</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.4} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const day = payload[0].payload as WeeklyProductivityDay;
                  return (
                    <div className="bg-slate-900 text-white text-xs rounded-xl p-2.5 shadow-lg border border-slate-700">
                      <p className="font-semibold">{day.label} ({day.dateStr})</p>
                      <p className="text-indigo-300 mt-1">
                        Completed: <span className="font-bold text-white">{day.count}</span> tasks
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
