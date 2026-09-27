import { Trash2 } from 'lucide-react';
import { Modal } from '../../ui/Modal';

export interface JobDeleteModalProps {
  jobId: number | null;
  jobTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function JobDeleteModal({
  jobId,
  jobTitle,
  onClose,
  onConfirm,
  isDeleting = false,
}: JobDeleteModalProps) {
  return (
    <Modal isOpen={jobId !== null} onClose={onClose} title="Deactivate Job Listing">
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200">
              Are you sure you want to deactivate this job posting?
            </p>
            {jobTitle && (
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 font-semibold">
                "{jobTitle}"
              </p>
            )}
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 leading-relaxed">
              This posting will be soft-deleted and hidden from student discovery and active lists.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? 'Deactivating...' : 'Confirm Deactivate'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default JobDeleteModal;
