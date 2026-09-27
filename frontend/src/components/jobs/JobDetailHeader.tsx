import { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';

interface JobDetailHeaderProps {
  title: string;
  status: string;
  jobType?: string;
}

export const JobDetailHeader: FC<JobDetailHeaderProps> = ({
  title,
  status,
  jobType,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Back Navigation Breadcrumb Link */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/jobs')}
          className="inline-flex items-center text-white/90 hover:text-white font-semibold text-sm transition-all group bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Jobs
        </button>
      </div>

      {/* Header & Title Area */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge status={status} />
          {jobType && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {jobType === 'INTERNAL' ? 'Campus Internal' : 'External Partner'}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default JobDetailHeader;
