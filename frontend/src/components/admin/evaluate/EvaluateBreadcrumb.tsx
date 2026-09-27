import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ShieldCheck } from 'lucide-react';

interface EvaluateBreadcrumbProps {
  job: any;
  application: any;
}

export function EvaluateBreadcrumb({ job, application }: EvaluateBreadcrumbProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (job?.id) {
      navigate(`/admin/jobs/${job.id}/applicants`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 shadow-xl rounded-2xl px-5 py-3.5">
      {/* Left: Breadcrumb Nav */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex-wrap">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-psu-blue hover:text-psu-navy dark:text-psu-cyan dark:hover:text-white transition-colors group cursor-pointer font-bold"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Job Management</span>
        </button>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[160px]">
          {job?.title || 'Job'}
        </span>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-slate-600 dark:text-slate-300">Applicants</span>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-bold text-slate-800 dark:text-white truncate max-w-[180px]">
          {application?.student_name || 'Applicant'}
        </span>
      </nav>

      {/* Right: Semester & Portal Badges */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {job?.academic_term && job?.academic_year && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-psu-blue dark:text-psu-cyan" />
            <span>Semester {job.academic_term} / {job.academic_year}</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-psu-blue/10 dark:bg-psu-cyan/15 text-psu-blue dark:text-psu-cyan text-xs font-bold border border-psu-blue/20 dark:border-psu-cyan/30 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Evaluation Portal</span>
        </span>
      </div>
    </div>
  );
}

export default EvaluateBreadcrumb;
