import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

export interface FacultyDataItem {
  name: string;
  fullName: string;
  count: number;
}

export interface FacultyChartProps {
  data: FacultyDataItem[];
}

export function FacultyChart({ data }: FacultyChartProps) {
  const hasData = data.some((f) => f.count > 0);

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-xl border border-white/60 dark:border-slate-800 flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-psu-blue" />
          <span>Applications by Faculty</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
          Candidate concentration by academic unit
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <BarChart3 className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
            No Faculty Data
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Try adjusting your filter selection
          </p>
        </div>
      ) : (
        <div className="w-full pt-4">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={500}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 99, 152, 0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as FacultyDataItem;
                    return (
                      <div className="bg-slate-900 text-white rounded-xl shadow-xl px-3.5 py-2.5 text-xs border border-slate-700">
                        <p className="font-bold text-blue-300">{item.fullName}</p>
                        <p className="text-slate-200 mt-0.5">
                          Applicants: <span className="font-extrabold text-white">{item.count}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#006398" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>CoC · FHT · FIS · FTE</span>
        <span className="font-semibold text-psu-blue">Live sync</span>
      </div>
    </div>
  );
}

export default FacultyChart;
