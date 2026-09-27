import { useState } from 'react';
import { Star } from 'lucide-react';

interface EvaluateRubricSectionProps {
  punctuality: number;
  responsibility: number;
  grooming: number;
  quality: number;
  onChange: (
    criteria: 'punctuality' | 'responsibility' | 'grooming' | 'quality',
    val: number
  ) => void;
}

interface CriteriaConfig {
  key: 'punctuality' | 'responsibility' | 'grooming' | 'quality';
  index: string;
  title: string;
  description: string;
  feedbackMap: Record<number, string>;
}

const CRITERIA_CONFIGS: CriteriaConfig[] = [
  {
    key: 'punctuality',
    index: 'CRITERIA 01',
    title: 'Punctuality',
    description: 'Attendance & briefing promptness',
    feedbackMap: {
      5: 'Exceptional Attendance',
      4: 'Good Attendance',
      3: 'Acceptable Attendance',
      2: 'Below Standard',
      1: 'Poor Attendance',
    },
  },
  {
    key: 'responsibility',
    index: 'CRITERIA 02',
    title: 'Responsibility',
    description: 'Task diligence & attention to detail',
    feedbackMap: {
      5: 'Proactive & Diligent',
      4: 'Reliable Execution',
      3: 'Moderate Initiative',
      2: 'Lacks Attention',
      1: 'Critical Deficiencies',
    },
  },
  {
    key: 'grooming',
    index: 'CRITERIA 03',
    title: 'Grooming & Attire',
    description: 'University dress code compliance',
    feedbackMap: {
      5: 'Impeccable PSU Uniform',
      4: 'PSU Uniform Compliant',
      3: 'Standard Uniform Checked',
      2: 'Minor Dress Violations',
      1: 'Unacceptable Attire',
    },
  },
  {
    key: 'quality',
    index: 'CRITERIA 04',
    title: 'Work Quality & Conduct',
    description: 'Accuracy, conduct & student assistance',
    feedbackMap: {
      5: 'Outstanding Result',
      4: 'Commendable Effort',
      3: 'Satisfactory Completion',
      2: 'Inconsistent Results',
      1: 'Non-compliant Execution',
    },
  },
];

function InteractiveStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hovered || value);

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            className="p-0.5 transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                isFilled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export function EvaluateRubricSection({
  punctuality,
  responsibility,
  grooming,
  quality,
  onChange,
}: EvaluateRubricSectionProps) {
  const values = { punctuality, responsibility, grooming, quality };

  return (
    <div className="space-y-4">
      {/* Rubric Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Competency Ratings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Tap the stars to adjust applicant grading across work criteria.
          </p>
        </div>
        <span className="text-xs font-semibold text-psu-blue dark:text-psu-cyan">
          Scale: 1 (Poor) to 5 (Exceptional)
        </span>
      </div>

      {/* 2x2 Criteria Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CRITERIA_CONFIGS.map((config) => {
          const currentValue = values[config.key];
          const feedback = config.feedbackMap[currentValue] || 'Standard';

          return (
            <div
              key={config.key}
              className="bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 transition-all rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              {/* Top row: Label, Title, Score Pill */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-psu-blue dark:text-psu-cyan tracking-wider uppercase">
                    {config.index}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                    {config.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {config.description}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-black shadow-xs border border-slate-200 dark:border-slate-700">
                  {currentValue}.0 / 5
                </span>
              </div>

              {/* Bottom row: Interactive Stars & Feedback Badge */}
              <div className="bg-white dark:bg-slate-900 rounded-xl px-3.5 py-2.5 flex items-center justify-between border border-slate-200/70 dark:border-slate-700/70 flex-wrap gap-2">
                <InteractiveStars
                  value={currentValue}
                  onChange={(val) => onChange(config.key, val)}
                />
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-psu-blue/10 dark:bg-psu-cyan/15 text-psu-blue dark:text-psu-cyan border border-psu-blue/20 dark:border-psu-cyan/30">
                  {feedback}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EvaluateRubricSection;
