import { useNavigate } from 'react-router-dom';
import { UserMinus, Star } from 'lucide-react';
import { Badge } from '../../ui';

interface ApplicantsTableProps {
  applications: any[];
  job: any;
  onOpenKickModal: (app: any) => void;
}

export function ApplicantsTable({ applications, job, onOpenKickModal }: ApplicantsTableProps) {
  const navigate = useNavigate();

  // Helper to extract student initials
  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper to format ISO date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const isJobCompleted = job?.status === 'COMPLETED';

  return (
    <div className="hidden md:block bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-400 text-[11px] uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="py-4 px-6">Student Info</th>
              <th className="py-4 px-6">Faculty</th>
              <th className="py-4 px-6">Applied Date</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Decision / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs text-slate-700 dark:text-slate-300">
            {applications.map((app) => {
              const displayStatus = app.evaluation ? 'COMPLETED' : app.status;

              return (
                <tr
                  key={app.id}
                  className="hover:bg-psu-blue/5 dark:hover:bg-psu-cyan/5 transition-colors"
                >
                  {/* Student Info: Avatar + Name + ID */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-psu-blue/15 dark:bg-psu-cyan/20 text-psu-blue dark:text-psu-cyan font-bold text-xs flex items-center justify-center shrink-0 border border-psu-blue/20 dark:border-psu-cyan/30 shadow-xs">
                        {getInitials(app.student_name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 dark:text-white leading-snug truncate">
                          {app.student_name || 'Anonymous Student'}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                          ID: {app.student_id || '-'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Faculty */}
                  <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-300">
                    {app.faculty || 'Unassigned'}
                  </td>

                  {/* Applied Date */}
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {formatDate(app.application_date)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6 text-center select-none">
                    <Badge status={displayStatus} />
                  </td>

                  {/* Decision / Action */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!isJobCompleted ? (
                        <button
                          type="button"
                          onClick={() => onOpenKickModal(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                          title="Remove applicant from this job"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                          <span>Kick Applicant</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/applications/${app.id}/evaluate`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs group"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
                          <span>{app.evaluation ? 'Re-evaluate' : 'Evaluate'}</span>
                        </button>
                      )}
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

export default ApplicantsTable;
