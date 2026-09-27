import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trash2 } from 'lucide-react';

export interface JobFormBreadcrumbProps {
  isEditing: boolean;
  jobTitle: string;
  jobId?: string | number;
  applicantsCount?: number;
  requiredAmount?: number;
  onDelete?: () => void;
}

export function JobFormBreadcrumb({
  isEditing,
  jobTitle,
  jobId,
  applicantsCount = 0,
  requiredAmount = 0,
  onDelete,
}: JobFormBreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-2xl shadow-sm px-5 sm:px-6 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-3">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm flex-wrap min-w-0">
        <button
          type="button"
          onClick={() => navigate('/admin/jobs')}
          className="inline-flex items-center gap-1.5 text-psu-blue dark:text-blue-400 hover:text-psu-navy dark:hover:text-blue-300 font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Job Management</span>
        </button>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-slate-600 dark:text-slate-400 font-semibold truncate max-w-[200px] sm:max-w-md">
          {isEditing ? jobTitle || 'Edit Listing' : 'Post New Job'}
        </span>
      </div>

      {/* Quick Action Shortcuts (Only in Edit Mode) */}
      {isEditing && (
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {jobId && (
            <button
              type="button"
              onClick={() => navigate(`/admin/jobs/${jobId}/applicants`)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-psu-blue dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>
                Applicants ({applicantsCount}/{requiredAmount})
              </span>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 transition-all shadow-2xs text-xs sm:text-sm font-semibold cursor-pointer active:scale-95"
              title="Delete Listing"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default JobFormBreadcrumb;
