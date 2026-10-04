import { motion, AnimatePresence } from 'framer-motion';
import { UserMinus, AlertTriangle, Loader2 } from 'lucide-react';

interface KickApplicantModalProps {
  isOpen: boolean;
  applicant: any;
  onClose: () => void;
  onConfirm: () => void;
  isKicking: boolean;
}

export function KickApplicantModal({
  isOpen,
  applicant,
  onClose,
  onConfirm,
  isKicking,
}: KickApplicantModalProps) {
  if (!isOpen || !applicant) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={!isKicking ? onClose : undefined}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-white/60 dark:border-slate-800 z-10 space-y-4 transform-gpu will-change-[transform,opacity]"
        >
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/50 shadow-sm">
              <UserMinus className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-lg font-black text-slate-800 dark:text-white">
                Remove Applicant
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Confirm removal from this duty assignment
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Are you sure you want to remove{' '}
              <strong className="text-slate-800 dark:text-white font-bold">
                {applicant.student_name || 'this student'}
              </strong>{' '}
              {applicant.student_id ? (
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  ({applicant.student_id})
                </span>
              ) : null}{' '}
              from this job?
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>This will release their allocated shift slot for other students.</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isKicking}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isKicking}
              onClick={onConfirm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isKicking ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Removing...</span>
                </>
              ) : (
                <span>Confirm Removal</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default KickApplicantModal;
