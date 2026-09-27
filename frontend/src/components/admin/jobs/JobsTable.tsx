import { Users, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export interface JobsTableProps {
  jobs: any[];
  onViewApplicants: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function JobsTable({ jobs, onViewApplicants, onEdit, onDelete }: JobsTableProps) {
  return (
    <div className="hidden md:block bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold tracking-wider uppercase select-none">
              <th className="py-4 px-6 font-bold">Title</th>
              <th className="py-4 px-5 font-bold">Organization</th>
              <th className="py-4 px-5 font-bold">Term / Year</th>
              <th className="py-4 px-5 font-bold">Type</th>
              <th className="py-4 px-5 font-bold text-center">Applicants</th>
              <th className="py-4 px-5 font-bold text-center">Status</th>
              <th className="py-4 px-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {jobs.map((job) => {
              const isInternal = job.job_type === 'INTERNAL';
              const applicantsCount = job.applicants_count || 0;
              const requiredCount = job.required_amount || 0;

              return (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Title */}
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-psu-blue transition-colors block">
                      {job.title}
                    </span>
                  </td>

                  {/* Organization */}
                  <td className="py-4 px-5">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {job.organization_name || 'Campus Organizer'}
                    </span>
                  </td>

                  {/* Term / Year */}
                  <td className="py-4 px-5">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Term {job.academic_term}/{job.academic_year}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                        isInternal
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                          : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60'
                      }`}
                    >
                      {job.job_type}
                    </span>
                  </td>

                  {/* Applicants */}
                  <td className="py-4 px-5 text-center">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {applicantsCount} / {requiredCount}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5 text-center">
                    <Badge status={job.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewApplicants(job.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                        title="View Applicants"
                        aria-label="View Applicants"
                      >
                        <Users className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(job.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-psu-blue dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                        title="Edit Job"
                        aria-label="Edit Job"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(job.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                        title="Deactivate Job"
                        aria-label="Deactivate Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobsTable;
