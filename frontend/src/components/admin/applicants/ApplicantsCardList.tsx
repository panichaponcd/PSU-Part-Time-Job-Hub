import { useNavigate } from 'react-router-dom';
import { UserMinus, Star } from 'lucide-react';
import { Badge } from '../../ui';

interface ApplicantsCardListProps {
  applications: any[];
  job: any;
  onOpenKickModal: (app: any) => void;
}

export function ApplicantsCardList({
  applications,
  job,
  onOpenKickModal,
}: ApplicantsCardListProps) {
  const navigate = useNavigate();

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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
    <div className="block md:hidden space-y-3">
      {applications.map((app) => {
        const displayStatus = app.evaluation ? 'COMPLETED' : app.status;

        return (
          <div
            key={app.id}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-2xl p-4 shadow-md space-y-3"
          >
            {/* Top row: Avatar, Info, Status Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-psu-blue/15 dark:bg-psu-cyan/20 text-psu-blue dark:text-psu-cyan font-bold text-xs flex items-center justify-center shrink-0 border border-psu-blue/20 dark:border-psu-cyan/30 shadow-xs">
                  {getInitials(app.student_name)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-800 dark:text-white text-sm truncate">
                    {app.student_name || 'Anonymous Student'}
                  </span>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                    ID: {app.student_id || '-'}
                  </span>
                </div>
              </div>
              <div className="shrink-0 select-none">
                <Badge status={displayStatus} />
              </div>
            </div>

            {/* Middle panel: Faculty & Applied Date */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Faculty</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {app.faculty || 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Applied On</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {formatDate(app.application_date)}
                </span>
              </div>
            </div>

            {/* Bottom action row */}
            <div className="flex items-center justify-end gap-2 pt-1">
              {!isJobCompleted ? (
                <button
                  type="button"
                  onClick={() => onOpenKickModal(app)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  <span>Kick Applicant</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/applications/${app.id}/evaluate`)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs group"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
                  <span>{app.evaluation ? 'Re-evaluate' : 'Evaluate'}</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ApplicantsCardList;
