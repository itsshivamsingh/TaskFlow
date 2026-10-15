import React from 'react';
import { StatusDistributionItem } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface StatusDistributionChartProps {
  data: StatusDistributionItem[];
  completionRate: number;
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  data,
  completionRate,
}) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Task Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Status distribution & overall completion
          </p>
        </div>

        <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
          {completionRate}% Complete
        </span>
      </div>

      <div className="relative h-52 w-full flex items-center justify-center my-2">
        {total === 0 ? (
          <div className="text-center text-xs text-slate-400">
            No tasks created yet
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as StatusDistributionItem;
                      const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-xl p-2.5 shadow-lg border border-slate-700">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-slate-300 mt-1">
                            {item.value} tasks ({percent}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                {total}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase mt-1">
                Tasks
              </span>
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-[11px] truncate">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
