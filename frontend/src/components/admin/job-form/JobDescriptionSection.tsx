import { ChangeEvent } from 'react';
import { FileText, Code } from 'lucide-react';

export interface JobDescriptionSectionProps {
  description: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function JobDescriptionSection({ description, onChange }: JobDescriptionSectionProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="jobDesc"
          className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Description &amp; Candidate Requirements <span className="text-rose-500">*</span>
          </span>
        </label>
        <span className="text-[11px] font-semibold text-psu-blue dark:text-blue-400 flex items-center gap-1 select-none">
          <Code className="w-3.5 h-3.5" />
          <span>Markdown Supported</span>
        </span>
      </div>

      <textarea
        id="jobDesc"
        name="description"
        rows={6}
        value={description}
        onChange={onChange}
        required
        placeholder="Provide a detailed description of duties, qualifications, work conditions, and expected deliverables..."
        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none leading-relaxed transition-all resize-y placeholder:text-slate-400"
      />
    </div>
  );
}

export default JobDescriptionSection;
