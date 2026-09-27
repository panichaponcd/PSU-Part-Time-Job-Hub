import { Filter, RotateCcw } from 'lucide-react';
import { Select, SelectOption } from '../../ui/Select';

export interface DashboardFiltersProps {
  yearFilter: string;
  setYearFilter: (val: string) => void;
  termFilter: string;
  setTermFilter: (val: string) => void;
  jobTypeFilter: string;
  setJobTypeFilter: (val: string) => void;
  onReset: () => void;
  isFiltered: boolean;
}

const YEAR_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Academic Years' },
  { value: '2026', label: 'Academic Year 2026 (2569)' },
  { value: '2025', label: 'Academic Year 2025 (2568)' },
  { value: '2024', label: 'Academic Year 2024 (2567)' },
];

const TERM_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Terms' },
  { value: '1', label: 'Term 1' },
  { value: '2', label: 'Term 2' },
  { value: '3', label: 'Summer Term' },
];

const JOB_TYPE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Job Types' },
  { value: 'internal', label: 'Internal (PSU Depts)' },
  { value: 'external', label: 'External (Industry Partners)' },
];

export function DashboardFilters({
  yearFilter,
  setYearFilter,
  termFilter,
  setTermFilter,
  jobTypeFilter,
  setJobTypeFilter,
  onReset,
  isFiltered,
}: DashboardFiltersProps) {
  return (
    <div className="relative z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-lg border border-white/60 dark:border-slate-800 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 select-none">
        <Filter className="w-3.5 h-3.5" />
        <span>Filters:</span>
      </div>

      {/* Academic Year Custom Dropdown */}
      <div className="flex-1 sm:flex-initial min-w-[200px]">
        <Select
          value={yearFilter}
          onChange={setYearFilter}
          options={YEAR_OPTIONS}
          ariaLabel="Academic Year filter"
        />
      </div>

      {/* Academic Term Custom Dropdown */}
      <div className="flex-1 sm:flex-initial min-w-[150px]">
        <Select
          value={termFilter}
          onChange={setTermFilter}
          options={TERM_OPTIONS}
          ariaLabel="Academic Term filter"
        />
      </div>

      {/* Job Type Custom Dropdown */}
      <div className="flex-1 sm:flex-initial min-w-[210px]">
        <Select
          value={jobTypeFilter}
          onChange={setJobTypeFilter}
          options={JOB_TYPE_OPTIONS}
          ariaLabel="Job Type filter"
        />
      </div>

      {/* Reset Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}

export default DashboardFilters;
