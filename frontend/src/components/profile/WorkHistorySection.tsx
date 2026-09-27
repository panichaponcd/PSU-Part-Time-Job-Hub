import { FC } from 'react';
import { Award, Download, Star } from 'lucide-react';

interface WorkHistorySectionProps {
  workHistory: any[];
  onDownloadCertificate: (app: any) => void;
  onOpenEvaluation: (app: any) => void;
}

export const WorkHistorySection: FC<WorkHistorySectionProps> = ({
  workHistory,
  onDownloadCertificate,
  onOpenEvaluation,
}) => {
  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 dark:border-slate-800 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-psu-navy dark:text-blue-300 rounded-xl">
            <Award className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Work History & Performance{' '}
            <span className="text-slate-400 font-normal">({workHistory.length})</span>
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
          Evaluated by PSU Supervisors
        </span>
      </div>

      {workHistory.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            No completed work evaluations on record yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {workHistory.map((app) => {
            const evalData = app.evaluation;
            const isPass = evalData?.result_status === 'PASS';

            return (
              <div
                key={app.id}
                className="bg-white/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {app.job_title || 'Completed Job'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Completed
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Applied: {formatDisplayDate(app.application_date)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Download Certificate Button */}
                  {isPass && (
                    <button
                      type="button"
                      onClick={() => onDownloadCertificate(app)}
                      title="Download Certificate"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-psu-navy hover:bg-psu-blue rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Certificate</span>
                    </button>
                  )}

                  {/* View Evaluation Sheet Button */}
                  <button
                    type="button"
                    onClick={() => onOpenEvaluation(app)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-psu-navy dark:hover:text-white bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-xl shadow-2xs transition-all group cursor-pointer"
                  >
                    <span>View Evaluation Sheet</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default WorkHistorySection;
