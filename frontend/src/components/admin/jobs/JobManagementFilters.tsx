import { Search, RotateCcw, Filter } from 'lucide-react';
import { Select, SelectOption } from '../../ui/Select';

export interface JobManagementFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  yearFilter: string;
  setYearFilter: (val: string) => void;
  termFilter: string;
  setTermFilter: (val: string) => void;
  uniqueYears: number[];
  onReset: () => void;
  isFiltered: boolean;
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'internal', label: 'Internal' },
  { value: 'external', label: 'External' },
];

const TERM_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Terms' },
  { value: '1', label: 'Term 1' },
  { value: '2', label: 'Term 2' },
  { value: '3', label: 'Summer' },
];

export function JobManagementFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  yearFilter,
  setYearFilter,
  termFilter,
  setTermFilter,
  uniqueYears,
  onReset,
  isFiltered,
}: JobManagementFiltersProps) {
  const yearOptions: SelectOption[] = [
    { value: 'all', label: 'All Years' },
    ...uniqueYears.map((yr) => ({
      value: String(yr),
      label: `Year ${yr}`,
    })),
  ];

  return (
    <div className="relative z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-lg border border-white/60 dark:border-slate-800 flex flex-col xl:flex-row items-stretch xl:items-center gap-3.5">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search title, keywords or organizer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 focus:outline-none transition-all"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mr-0.5 select-none hidden sm:flex">
          <Filter className="w-3.5 h-3.5" />
        </div>

        <div className="flex-1 sm:flex-initial min-w-[140px]">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            ariaLabel="Status Filter"
          />
        </div>

        <div className="flex-1 sm:flex-initial min-w-[130px]">
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            options={TYPE_OPTIONS}
            ariaLabel="Job Type Filter"
          />
        </div>

        <div className="flex-1 sm:flex-initial min-w-[130px]">
          <Select
            value={yearFilter}
            onChange={setYearFilter}
            options={yearOptions}
            ariaLabel="Academic Year Filter"
          />
        </div>

        <div className="flex-1 sm:flex-initial min-w-[130px]">
          <Select
            value={termFilter}
            onChange={setTermFilter}
            options={TERM_OPTIONS}
            ariaLabel="Academic Term Filter"
          />
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default JobManagementFilters;
