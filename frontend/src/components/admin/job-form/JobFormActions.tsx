import { Save, Loader2 } from 'lucide-react';

export interface JobFormActionsProps {
  isEditing: boolean;
  saving: boolean;
  onCancel: () => void;
  onSaveDraft?: () => void;
  onSubmit: () => void;
}

export function JobFormActions({
  isEditing,
  saving,
  onCancel,
  onSaveDraft,
  onSubmit,
}: JobFormActionsProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200/80 dark:border-slate-800">
      {/* Left Action: Cancel */}
      <button
        type="button"
        disabled={saving}
        onClick={onCancel}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-colors text-center cursor-pointer disabled:opacity-50"
      >
        Cancel
      </button>

      {/* Right Actions: Save Draft & Primary Submit */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        {onSaveDraft && (
          <button
            type="button"
            disabled={saving}
            onClick={onSaveDraft}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm shadow-2xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
          >
            Save as Draft
          </button>
        )}

        <button
          type="button"
          disabled={saving}
          onClick={onSubmit}
          className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-xl bg-psu-navy hover:bg-psu-deep active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Job Listing'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default JobFormActions;
