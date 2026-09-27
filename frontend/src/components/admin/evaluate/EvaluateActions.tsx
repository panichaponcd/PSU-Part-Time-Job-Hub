import { Save, Loader2 } from 'lucide-react';

interface EvaluateActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function EvaluateActions({
  isEditing,
  isSaving,
  onCancel,
  onSubmit,
}: EvaluateActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
      <button
        type="button"
        disabled={isSaving}
        onClick={onCancel}
        className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer active:scale-95 shadow-xs"
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={isSaving}
        onClick={onSubmit}
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-psu-navy hover:bg-[#003c71] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving Assessment...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Update Evaluation' : 'Submit Evaluation'}</span>
          </>
        )}
      </button>
    </div>
  );
}

export default EvaluateActions;
