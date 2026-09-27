import { Users, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export interface JobCardListProps {
  jobs: any[];
  onViewApplicants: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function JobCardList({ jobs, onViewApplicants, onEdit, onDelete }: JobCardListProps) {
  return (
    <div className="md:hidden flex flex-col gap-4">
      {jobs.map((job) => {
        const isInternal = job.job_type === 'INTERNAL';
        const applicantsCount = job.applicants_count || 0;
        const requiredCount = job.required_amount || 0;
        const fillPercent =
          requiredCount > 0 ? Math.min(100, Math.round((applicantsCount / requiredCount) * 100)) : 0;

        return (
          <div
            key={job.id}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-lg border border-white/60 dark:border-slate-800 flex flex-col gap-3.5 transition-all"
          >
            {/* Top Row: Type & Term Pill + Status Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    isInternal
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                      : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60'
                  }`}
                >
                  {job.job_type}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Term {job.academic_term}/{job.academic_year}
                </span>
              </div>

              <Badge status={job.status} />
            </div>

            {/* Title & Organization */}
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {job.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {job.organization_name || 'Campus Organizer'}
              </p>
            </div>

            {/* Applicant Slot Meter */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5" />
                  <span>Applicants Enrolled</span>
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {applicantsCount} / {requiredCount} Slots
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-psu-blue rounded-full transition-all duration-300"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onViewApplicants(job.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Applicants</span>
              </button>

              <button
                type="button"
                onClick={() => onEdit(job.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-psu-blue dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(job.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default JobCardList;
