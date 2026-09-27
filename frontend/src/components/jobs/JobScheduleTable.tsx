import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { WorkSchedule } from '../../types/job';

export interface JobScheduleTableProps {
  schedules?: WorkSchedule[];
  jobStatus?: string;
}

export function JobScheduleTable({ schedules }: JobScheduleTableProps) {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">No specific work schedule shifts listed.</p>
      </div>
    );
  }

  // Helper to format date cleanly
  const formatShiftDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper to format time (e.g., "08:00:00" -> "08:00")
  const formatShiftTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  // Determine shift timeline status based on real-time date
  const getShiftStatus = (dateStr: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const shiftDate = new Date(dateStr);
      shiftDate.setHours(0, 0, 0, 0);

      if (shiftDate.getTime() < today.getTime()) {
        return 'completed';
      } else if (shiftDate.getTime() === today.getTime()) {
        return 'today';
      }
      return 'upcoming';
    } catch {
      return 'upcoming';
    }
  };

  return (
    <div className="space-y-2.5">
      {schedules.map((item, idx) => {
        const status = getShiftStatus(item.date);
        const startTime = formatShiftTime(item.start_time);
        const endTime = formatShiftTime(item.end_time);

        return (
          <div
            key={item.id || idx}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors text-xs sm:text-sm ${
              status === 'today'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-psu-blue/40 text-psu-navy dark:text-blue-200 ring-1 ring-psu-blue/30'
                : status === 'completed'
                ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300'
                : 'bg-white/70 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/70 text-slate-700 dark:text-slate-200'
            }`}
          >
            {/* Left: Date & Time */}
            <div className="flex items-center gap-3">
              {status === 'completed' ? (
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : status === 'today' ? (
                <div className="w-6 h-6 rounded-full bg-psu-blue text-white flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 text-slate-400 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
              )}

              <div>
                <span
                  className={`font-bold ${
                    status === 'completed' ? 'text-slate-700 dark:text-slate-300' : ''
                  }`}
                >
                  {formatShiftDate(item.date)}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 ml-2 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {startTime} - {endTime}
                </span>
              </div>
            </div>

            {/* Right: Badge */}
            <div>
              {status === 'completed' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Completed
                </span>
              )}
              {status === 'today' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-psu-blue text-white shadow-sm">
                  Today
                </span>
              )}
              {status === 'upcoming' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                  Upcoming
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default JobScheduleTable;
