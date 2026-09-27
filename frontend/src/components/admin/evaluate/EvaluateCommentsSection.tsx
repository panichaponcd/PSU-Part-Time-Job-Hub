import { Info, MessageSquare } from 'lucide-react';

interface EvaluateCommentsSectionProps {
  comment: string;
  onChange: (val: string) => void;
}

export function EvaluateCommentsSection({ comment, onChange }: EvaluateCommentsSectionProps) {
  return (
    <div className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="supervisorComments"
          className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4 text-psu-blue dark:text-psu-cyan" />
          <span>Supervisor Comments & Feedback</span>
        </label>
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Official Evaluation Record
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="supervisorComments"
          rows={4}
          maxLength={600}
          value={comment}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter constructive feedback regarding the student's task execution, punctuality, and attitude..."
          className="w-full rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 font-normal text-xs sm:text-sm p-4 transition-all focus:outline-none focus:ring-2 focus:ring-psu-blue/30 focus:border-psu-blue placeholder-slate-400 resize-y shadow-inner"
        />
      </div>

      {/* Footnote & Character Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-400 dark:text-slate-500 px-1">
        <span className="flex items-center gap-1.5 text-psu-blue dark:text-psu-cyan font-medium">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>This remark will appear on the student's official activity transcript and work certificate.</span>
        </span>
        <span className="font-mono text-[11px] self-end sm:self-auto">
          {comment.length} / 600 characters
        </span>
      </div>
    </div>
  );
}

export default EvaluateCommentsSection;
