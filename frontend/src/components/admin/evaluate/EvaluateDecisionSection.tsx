import { CheckCircle2, XCircle } from 'lucide-react';

interface EvaluateDecisionSectionProps {
  resultStatus: 'PASS' | 'FAIL';
  onChange: (status: 'PASS' | 'FAIL') => void;
}

export function EvaluateDecisionSection({
  resultStatus,
  onChange,
}: EvaluateDecisionSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Final Employment Decision
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Select completion status to issue compensation and credential accreditation.
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Pass Button */}
        <button
          type="button"
          onClick={() => onChange('PASS')}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${
            resultStatus === 'PASS'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 border-2 border-emerald-600'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Pass / Accredited</span>
        </button>

        {/* Fail Button */}
        <button
          type="button"
          onClick={() => onChange('FAIL')}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${
            resultStatus === 'FAIL'
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 border-2 border-rose-600'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Fail / Incomplete</span>
        </button>
      </div>
    </div>
  );
}

export default EvaluateDecisionSection;
