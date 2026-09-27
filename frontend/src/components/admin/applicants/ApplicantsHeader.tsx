import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Users } from 'lucide-react';

interface ApplicantsHeaderProps {
  job: any;
  totalApplicants: number;
  onExportCsv: () => void;
}

export function ApplicantsHeader({ job, totalApplicants, onExportCsv }: ApplicantsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Navigation and Titles */}
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => navigate('/admin/jobs')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-psu-blue dark:text-slate-400 dark:hover:text-psu-cyan transition-colors w-fit group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Job Management</span>
        </button>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Applicant List
          </h1>
          {job && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {job.title} • Term {job.academic_term}/{job.academic_year}
            </span>
          )}
        </div>
      </div>

      {/* Right: Total Applicants Pill & Export CSV Action */}
      <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-psu-blue/10 dark:bg-psu-cyan/15 text-psu-blue dark:text-psu-cyan border border-psu-blue/20 dark:border-psu-cyan/30 text-xs font-bold shadow-sm">
          <Users className="w-4 h-4" />
          <span>Total Applicants: {totalApplicants}</span>
        </span>

        <button
          type="button"
          onClick={onExportCsv}
          disabled={totalApplicants === 0}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            totalApplicants === 0
              ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed'
              : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 cursor-pointer'
          }`}
          title="Export applicant list as CSV"
        >
          <Download className="w-4 h-4 text-psu-blue dark:text-psu-cyan" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}

export default ApplicantsHeader;
