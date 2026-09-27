export interface JobFormHeaderProps {
  isEditing: boolean;
  status: string;
  jobId?: string | number;
  academicYear?: number;
}

export function JobFormHeader({
  isEditing,
  status,
  jobId,
  academicYear = 2569,
}: JobFormHeaderProps) {
  const getStatusBadge = () => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open / Accepting Applications</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-bold select-none">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>In Progress</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold select-none">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Completed</span>
          </span>
        );
      case 'CLOSED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold select-none">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Closed</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200/80 dark:border-slate-800">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            {isEditing ? 'Edit Job Listing' : 'Post New Job'}
          </h1>
          {isEditing && getStatusBadge()}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {isEditing
            ? `Reference ID: PSU-PKT-${academicYear}-${String(jobId).padStart(4, '0')} • Active Campus Job`
            : 'Fill in the details below to create a new part-time position for PSU students'}
        </p>
      </div>
    </div>
  );
}

export default JobFormHeader;
