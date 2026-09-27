import { FC, FormEvent } from 'react';
import { Pencil, Loader2 } from 'lucide-react';

interface StudentProfileFormProps {
  formData: any;
  onChange: (data: any) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
}

export const StudentProfileForm: FC<StudentProfileFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  saving,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Pencil className="w-4 h-4 text-psu-blue" />
          <span>Edit Student Information</span>
        </h3>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Synchronized with PSU student profile
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
            First Name
          </label>
          <input
            type="text"
            value={formData.first_name || ''}
            onChange={(e) => onChange({ ...formData, first_name: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            value={formData.last_name || ''}
            onChange={(e) => onChange({ ...formData, last_name: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
            Faculty
          </label>
          <input
            type="text"
            value={formData.faculty || ''}
            onChange={(e) => onChange({ ...formData, faculty: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
            Major / Specialization
          </label>
          <input
            type="text"
            value={formData.major || ''}
            onChange={(e) => onChange({ ...formData, major: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
            Religion
          </label>
          <input
            type="text"
            value={formData.religion || ''}
            onChange={(e) => onChange({ ...formData, religion: e.target.value })}
            placeholder="e.g. Buddhism, Islam, Christianity, etc."
            className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
            Diet & Allergies / Special Conditions
          </label>
          <input
            type="text"
            value={formData.allergies || ''}
            onChange={(e) => onChange({ ...formData, allergies: e.target.value })}
            placeholder="e.g. Halal, Vegetarian, Peanut allergy, etc."
            className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-xs font-bold text-white bg-psu-navy hover:bg-psu-blue rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};

export default StudentProfileForm;
