import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectOption } from '../../ui/Select';

export interface JobsPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS: SelectOption[] = [
  { value: '10', label: '10 / page' },
  { value: '25', label: '25 / page' },
  { value: '50', label: '50 / page' },
];

export function JobsPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: JobsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="relative z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/60 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Summary text & Rows per page */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div>
          Showing <span className="font-extrabold text-slate-900 dark:text-white">{startIndex}</span>{' '}
          to <span className="font-extrabold text-slate-900 dark:text-white">{endIndex}</span> of{' '}
          <span className="font-extrabold text-slate-900 dark:text-white">{totalItems}</span> job
          listings
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Rows:</span>
          <div className="w-36 min-w-[136px]">
            <Select
              value={String(pageSize)}
              onChange={(val) => onPageSizeChange(Number(val))}
              options={PAGE_SIZE_OPTIONS}
              placement="top"
              ariaLabel="Rows per page selector"
            />
          </div>
        </div>
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Previous Page"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3.5 py-1.5 rounded-xl bg-psu-navy dark:bg-psu-blue text-white text-xs font-extrabold shadow-sm select-none">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Next Page"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default JobsPagination;
