import { Calendar, Clock, Plus, Trash2, CalendarDays } from 'lucide-react';

export interface ScheduleItem {
  id?: number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface JobScheduleSectionProps {
  schedules: ScheduleItem[];
  onAddSchedule: () => void;
  onRemoveSchedule: (index: number) => void;
  onScheduleChange: (index: number, field: keyof ScheduleItem, value: string) => void;
}

export function JobScheduleSection({
  schedules,
  onAddSchedule,
  onRemoveSchedule,
  onScheduleChange,
}: JobScheduleSectionProps) {
  // Helper to calculate shift duration in hours
  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return '—';
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return '—';

    let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    // Handle shifts wrapping past midnight
    if (diffMinutes <= 0) {
      diffMinutes += 24 * 60;
    }
    const hours = diffMinutes / 60;
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hrs / Shift`;
  };

  return (
    <div className="space-y-4 pt-5 border-t border-slate-200/80 dark:border-slate-800">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
            <Calendar className="w-5 h-5 text-psu-blue dark:text-blue-400" />
            <span>Work Schedule Shifts</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Assign calendar dates and operational shifts for hourly/daily tracking
          </p>
        </div>

        <button
          type="button"
          onClick={onAddSchedule}
          className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-psu-blue hover:bg-psu-navy dark:hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-all self-start sm:self-auto shadow-2xs cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shift</span>
        </button>
      </div>

      {/* Shifts List Container */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
        {schedules.length === 0 ? (
          <div className="text-center py-8 px-4 flex flex-col items-center justify-center gap-2">
            <CalendarDays className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              No shifts scheduled yet. Click &quot;Add Shift&quot; to specify work shifts.
            </p>
          </div>
        ) : (
          schedules.map((sch, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              {/* Date Input */}
              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-psu-blue dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  value={sch.date}
                  onChange={(e) => onScheduleChange(idx, 'date', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-psu-blue focus:outline-none transition-all cursor-pointer"
                />
              </div>

              {/* Start & End Times */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <Clock className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    value={sch.start_time}
                    onChange={(e) => onScheduleChange(idx, 'start_time', e.target.value)}
                    className="h-9 pl-7 pr-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-psu-blue focus:outline-none transition-all"
                  />
                </div>
                <span className="text-xs font-bold text-slate-400">to</span>
                <div className="relative flex items-center">
                  <Clock className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    value={sch.end_time}
                    onChange={(e) => onScheduleChange(idx, 'end_time', e.target.value)}
                    className="h-9 pl-7 pr-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-psu-blue focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Real-time Duration Badge */}
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-[11px] font-bold select-none shrink-0">
                {calculateDuration(sch.start_time, sch.end_time)}
              </span>

              {/* Remove Shift Button */}
              <button
                type="button"
                onClick={() => onRemoveSchedule(idx)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 transition-all cursor-pointer shadow-2xs md:ml-auto shrink-0"
                title="Remove shift"
                aria-label="Remove shift"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobScheduleSection;
