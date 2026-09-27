import { FC } from 'react';
import { Search, X } from 'lucide-react';

interface JobFilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  filter: 'all' | 'internal' | 'external';
  onFilterChange: (type: 'all' | 'internal' | 'external') => void;
}

export const JobFilterToolbar: FC<JobFilterToolbarProps> = ({
  search,
  onSearchChange,
  onClearSearch,
  filter,
  onFilterChange,
}) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-3">
      {/* Search Input Field */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by job title, location, or department..."
          aria-label="Search job title or keyword"
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-psu-blue dark:focus:ring-psu-light focus:border-transparent text-sm sm:text-base shadow-sm transition"
        />
        {search && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Pills Group */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shrink-0 self-start md:self-auto">
        {(['all', 'internal', 'external'] as const).map((type) => {
          const isActive = filter === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onFilterChange(type)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-psu-navy dark:bg-psu-blue text-white shadow-sm'
                  : 'bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JobFilterToolbar;
