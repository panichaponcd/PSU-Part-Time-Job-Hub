import { Search, X, RotateCcw } from 'lucide-react';
import { Select, SelectOption } from '../../ui/Select';

interface ApplicantsFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  facultyFilter: string;
  setFacultyFilter: (val: string) => void;
  availableFaculties: string[];
  onReset: () => void;
  isFiltered: boolean;
}

export function ApplicantsFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  facultyFilter,
  setFacultyFilter,
  availableFaculties,
  onReset,
  isFiltered,
}: ApplicantsFiltersProps) {
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const facultyOptions: SelectOption[] = [
    { value: 'all', label: 'All Faculties' },
    ...availableFaculties.map((f) => ({
      value: f,
      label: f,
    })),
  ];

  return (
    <div className="relative z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-psu-blue/30 focus:border-psu-blue dark:focus:border-psu-cyan transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="md:col-span-3">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Filter by Status"
          />
        </div>

        {/* Faculty Dropdown */}
        <div className="md:col-span-3">
          <Select
            value={facultyFilter}
            onChange={setFacultyFilter}
            options={facultyOptions}
            placeholder="Filter by Faculty"
          />
        </div>
      </div>

      {/* Reset Filter Action */}
      {isFiltered && (
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Filtering active applicants
          </span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-psu-blue hover:text-psu-navy dark:text-psu-cyan dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ApplicantsFilters;
