import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const PSU_NAVY = '#0a2540';
const DONUT_COLORS = [PSU_NAVY, '#38bdf8'];

export interface JobDistributionItem {
  name: string;
  value: number;
  percentage: number;
}

export interface JobDistributionChartProps {
  data: JobDistributionItem[];
  totalJobs: number;
}

export function JobDistributionChart({ data, totalJobs }: JobDistributionChartProps) {
  const hasData = data.some((p) => p.value > 0);

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-xl border border-white/60 dark:border-slate-800 flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-psu-blue" />
          <span>Job Distribution</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
          Internal university positions vs external partner listings
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
            No Job Postings
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Try adjusting your filter selection
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 flex-1">
          {/* Donut graphic */}
          <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as JobDistributionItem;
                      return (
                        <div className="bg-slate-900 text-white rounded-xl shadow-xl px-3 py-2 text-xs border border-slate-700">
                          <p className="font-bold">{item.name}</p>
                          <p className="text-slate-200 mt-0.5">
                            {item.value} listings ({item.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Center Count */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
                {totalJobs}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Total Jobs
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#0a2540] dark:bg-blue-400 shrink-0 shadow-xs" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Internal Positions
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {data[0]?.percentage || 0}% ({data[0]?.value || 0} listings)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#38bdf8] shrink-0 shadow-xs" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  External Companies
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {data[1]?.percentage || 0}% ({data[1]?.value || 0} listings)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Campus & Corporate Partners</span>
        <span className="font-semibold text-psu-blue">Real-time stats</span>
      </div>
    </div>
  );
}

export default JobDistributionChart;
