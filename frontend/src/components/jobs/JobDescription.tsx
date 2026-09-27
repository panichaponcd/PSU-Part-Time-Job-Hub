import { FC } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface JobDescriptionProps {
  description?: string;
}

export const JobDescription: FC<JobDescriptionProps> = ({ description }) => {
  return (
    <div className="bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-psu-navy dark:text-psu-blue" />
        <span>Job Description</span>
      </h2>
      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
        {description || 'No detailed description provided.'}
      </div>

      {/* Standard PSU Qualifications Checklist */}
      <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/70">
        <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
          Qualifications & Guidelines
        </h3>
        <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Enrolled Prince of Songkla University student in good standing.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Punctual, accountable, and adheres to university conduct policies.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Certified activity transcript hours awarded upon completion.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JobDescription;
