import { Star, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { StarDisplay } from './StarDisplay';

export interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApp: any;
}

export function EvaluationModal({ isOpen, onClose, selectedApp }: EvaluationModalProps) {
  if (!selectedApp || !selectedApp.evaluation) return null;

  const evalData = selectedApp.evaluation;
  const overallAvg = (
    ((evalData.punctuality_rating || 0) +
      (evalData.responsibility_rating || 0) +
      (evalData.grooming_rating || 0) +
      (evalData.quality_rating || 0)) /
    4
  ).toFixed(1);

  const isPass = evalData.result_status === 'PASS';

  const formatEvalDate = (dateStr: string) => {
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Performance Evaluation Sheet"
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Job Header Info */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 -mt-2">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {selectedApp.job_title || 'Campus Assignment'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Applied: {formatEvalDate(selectedApp.application_date)}
          </p>
        </div>

        {/* Overall Rating Banner (Stitch Baseline) */}
        <div className="rounded-2xl p-5 sm:p-6 text-white shadow-md flex items-center justify-between bg-gradient-to-r from-psu-navy to-[#006398] dark:from-slate-800 dark:to-slate-900 border border-white/10">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-blue-200 dark:text-blue-300 mb-1">
              OVERALL RATING
            </div>
            <div className="flex items-center gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
                {overallAvg}
              </span>
              <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span
              className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-sm uppercase ${
                isPass
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {isPass ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PASS</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>FAIL</span>
                </>
              )}
            </span>
            <div className="text-[11px] text-blue-200 dark:text-slate-400 mt-2 font-normal">
              Evaluated on {formatEvalDate(evalData.evaluation_date)}
            </div>
          </div>
        </div>

        {/* 2x2 Criteria Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Punctuality */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Punctuality
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                {evalData.punctuality_rating || 0} / 5.0
              </p>
            </div>
            <StarDisplay value={evalData.punctuality_rating || 0} size="sm" />
          </div>

          {/* Responsibility */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Responsibility
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                {evalData.responsibility_rating || 0} / 5.0
              </p>
            </div>
            <StarDisplay value={evalData.responsibility_rating || 0} size="sm" />
          </div>

          {/* Grooming */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Grooming & Decorum
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                {evalData.grooming_rating || 0} / 5.0
              </p>
            </div>
            <StarDisplay value={evalData.grooming_rating || 0} size="sm" />
          </div>

          {/* Work Quality */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Work Quality
              </span>
              <p className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                {evalData.quality_rating || 0} / 5.0
              </p>
            </div>
            <StarDisplay value={evalData.quality_rating || 0} size="sm" />
          </div>
        </div>

        {/* Supervisor Comments Block */}
        {evalData.comment && (
          <div className="bg-blue-50/70 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 space-y-1.5">
            <p className="text-xs font-bold text-psu-navy dark:text-blue-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-psu-blue" />
              <span>Supervisor Feedback</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "{evalData.comment}"
            </p>
          </div>
        )}

        {/* Modal Close Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default EvaluationModal;
