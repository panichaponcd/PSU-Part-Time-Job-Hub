import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Banknote, MapPin, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';

interface ActiveAssignmentsSectionProps {
  assignments: any[];
}

export const ActiveAssignmentsSection: FC<ActiveAssignmentsSectionProps> = ({
  assignments,
}) => {
  const navigate = useNavigate();

  const formatPay = (payVal: number | string | undefined) => {
    if (payVal === undefined || payVal === null) return '0';
    if (typeof payVal === 'number') return payVal.toLocaleString();
    const num = Number(payVal);
    return isNaN(num) ? payVal : num.toLocaleString();
  };

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
          <span className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Active Assignments{' '}
            <span className="text-slate-400 font-normal">({assignments.length})</span>
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
          Enrolled Jobs & Shifts
        </span>
      </div>

      {assignments.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            You do not have any active campus job assignments right now.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-psu-navy hover:bg-psu-blue transition-colors shadow-sm"
          >
            <span>Browse Available Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((job) => (
            <div
              key={job.applicationId || job.id}
              className="bg-white/80 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                    {job.title}
                  </h3>
                  <Badge status={job.applicationStatus || job.status || 'APPROVED'} />
                </div>

                {job.organization_name && (
                  <p className="text-xs font-semibold text-psu-navy dark:text-psu-light mb-3">
                    {job.organization_name}
                  </p>
                )}

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {job.compensation_amount && (
                    <div className="flex items-center gap-2">
                      <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        ฿{formatPay(job.compensation_amount)}
                      </span>
                    </div>
                  )}

                  {job.location_type && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{job.location_type}</span>
                    </div>
                  )}

                  {job.applicationDate && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Enrolled: {formatDisplayDate(job.applicationDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-psu-navy hover:bg-psu-blue rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ActiveAssignmentsSection;
