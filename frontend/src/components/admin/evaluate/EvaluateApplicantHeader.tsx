import { Star, Check, Award, AlertCircle } from 'lucide-react';

interface EvaluateApplicantHeaderProps {
  application: any;
  averageScore: string;
  resultStatus: 'PASS' | 'FAIL';
  evaluationDate?: string;
}

export function EvaluateApplicantHeader({
  application,
  averageScore,
  resultStatus,
  evaluationDate,
}: EvaluateApplicantHeaderProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formattedDate = evaluationDate
    ? new Date(evaluationDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Student Details with Avatar */}
      <div className="flex items-start sm:items-center gap-4 min-w-0">
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-psu-blue/15 dark:bg-psu-cyan/20 text-psu-blue dark:text-psu-cyan font-bold text-xl sm:text-2xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">
            {getInitials(application?.student_name)}
          </div>
          <span
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-white shadow-xs"
            title="Active Student"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-psu-blue dark:text-psu-cyan uppercase tracking-wider">
              Applicant Evaluation
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
              Undergraduate
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight truncate mt-1">
            {application?.student_name || 'Student Applicant'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 font-medium">
            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
              ID: {application?.student_id || '-'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>{application?.faculty || 'Faculty of PSU'}</span>
            {application?.job_title && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-600 dark:text-slate-300">
                  Role: {application.job_title}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right: Decision Status & Dynamic Score Card */}
      <div className="flex items-center gap-4 shrink-0 self-start lg:self-center flex-wrap sm:flex-nowrap">
        {/* Pass/Fail Status Banner */}
        <div className="flex flex-col items-start lg:items-end">
          {resultStatus === 'PASS' ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Award className="w-3.5 h-3.5" />
              <span>PASS / Accredited</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <AlertCircle className="w-3.5 h-3.5" />
              <span>FAIL / Incomplete</span>
            </div>
          )}
          {formattedDate && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
              Updated {formattedDate}
            </span>
          )}
        </div>

        {/* Prominent Average Score Card */}
        <div className="rounded-2xl bg-psu-navy dark:bg-slate-950 text-white px-5 py-3 shadow-lg flex flex-col items-center justify-center min-w-[130px] border border-white/10">
          <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">
            Average Score
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-2xl sm:text-3xl font-black leading-none text-white">
              {averageScore}
            </span>
            <span className="text-xs text-blue-200 self-end font-medium">/ 5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluateApplicantHeader;
