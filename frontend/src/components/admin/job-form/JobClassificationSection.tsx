import { ChangeEvent } from 'react';
import { Users } from 'lucide-react';
import { Select, SelectOption } from '../../ui/Select';

export interface JobClassificationSectionProps {
  jobType: string;
  onJobTypeChange: (val: string) => void;
  compensationAmount: string | number;
  requiredAmount: string | number;
  status: string;
  onStatusChange: (val: string) => void;
  academicTerm: number | string;
  onTermChange: (val: string) => void;
  academicYear: number | string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const JOB_TYPE_OPTIONS: SelectOption[] = [
  { value: 'EXTERNAL', label: 'External' },
  { value: 'INTERNAL', label: 'Internal' },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const TERM_OPTIONS: SelectOption[] = [
  { value: '1', label: 'Term 1' },
  { value: '2', label: 'Term 2' },
  { value: '3', label: 'Summer' },
];

export function JobClassificationSection({
  jobType,
  onJobTypeChange,
  compensationAmount,
  requiredAmount,
  status,
  onStatusChange,
  academicTerm,
  onTermChange,
  academicYear,
  onChange,
}: JobClassificationSectionProps) {
  return (
    <div className="space-y-4">
      {/* 4-column responsive grid: Job Type, Pay Rate, Vacancies, Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Job Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none">
            Job Type
          </label>
          <Select
            value={jobType.toUpperCase()}
            onChange={onJobTypeChange}
            options={JOB_TYPE_OPTIONS}
            ariaLabel="Job Type"
          />
        </div>

        {/* Pay Rate (THB) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="compensationAmount"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none"
          >
            Pay Rate (THB) <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-500 font-bold text-sm pointer-events-none">
              ฿
            </span>
            <input
              id="compensationAmount"
              name="compensation_amount"
              type="number"
              step="10"
              min="0"
              value={compensationAmount}
              onChange={onChange}
              required
              placeholder="e.g. 500"
              className="w-full h-11 pl-8 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Vacancies (Seats) */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="requiredAmount"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none"
          >
            Vacancies (Seats) <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Users className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="requiredAmount"
              name="required_amount"
              type="number"
              min="1"
              value={requiredAmount}
              onChange={onChange}
              required
              placeholder="e.g. 10"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none">
            Listing Status
          </label>
          <Select
            value={status.toUpperCase()}
            onChange={onStatusChange}
            options={STATUS_OPTIONS}
            ariaLabel="Listing Status"
          />
        </div>
      </div>

      {/* 2-column inline: Academic Term & Year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Academic Term */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none">
            Academic Term
          </label>
          <Select
            value={String(academicTerm)}
            onChange={onTermChange}
            options={TERM_OPTIONS}
            ariaLabel="Academic Term"
          />
        </div>

        {/* Academic Year */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="academicYear"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none"
          >
            Academic Year <span className="text-rose-500">*</span>
          </label>
          <input
            id="academicYear"
            name="academic_year"
            type="number"
            value={academicYear}
            onChange={onChange}
            required
            placeholder="e.g. 2026 or 2569"
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

export default JobClassificationSection;
