import { FC, SyntheticEvent } from 'react';
import {
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import lineIcon from '../../assets/LINE_logo.svg';

interface JobApplyCardProps {
  image: string;
  title: string;
  academicTerm?: string;
  academicYear?: string;
  organizationName?: string;
  required: number;
  applicants: number;
  capacityPct: number;
  remainingSeats: number;
  applied: boolean;
  applicationStatus: string | null;
  isOpen: boolean;
  jobStatus: string;
  applying: boolean;
  onApply: () => void;
  onCancelClick: () => void;
  onImageError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
  canSeePrivateDetails: boolean;
  lineGroupUrl?: string;
}

export const JobApplyCard: FC<JobApplyCardProps> = ({
  image,
  title,
  academicTerm,
  academicYear,
  organizationName,
  required,
  applicants,
  capacityPct,
  remainingSeats,
  applied,
  applicationStatus,
  isOpen,
  jobStatus,
  applying,
  onApply,
  onCancelClick,
  onImageError,
  canSeePrivateDetails,
  lineGroupUrl,
}) => {
  return (
    <div className="bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
      {/* Job Thumbnail Image Container in 16:9 Aspect Ratio */}
      <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 bg-slate-900 group">
        <img
          src={image}
          alt={title}
          onError={onImageError}
          className="aspect-video w-full object-cover transform group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Meta Information */}
      <div className="space-y-3 text-xs sm:text-sm border-b border-slate-200/80 dark:border-slate-700/80 pb-5">
        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
          <span className="font-medium">Academic Term:</span>
          <span className="font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
            {academicTerm ? `${academicTerm}/${academicYear || ''}` : 'Current Term'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
            POSTED BY:
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight block mt-0.5">
            {organizationName || 'Prince of Songkla University'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
            PSU Phuket Campus
          </span>
        </div>
      </div>

      {/* Live Applicant Counter & Progress Bar */}
      {required > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Applicant Capacity
            </span>
            <span className="text-base font-extrabold text-psu-navy dark:text-psu-light">
              {applicants} / {required} Seats
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-psu-blue to-psu-navy rounded-full transition-all duration-500"
              style={{ width: `${capacityPct}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span>{capacityPct}% Filled</span>
            <span className={remainingSeats === 0 ? 'text-rose-500 font-bold' : 'font-medium'}>
              {remainingSeats === 0 ? 'Full (Registration Closed)' : `${remainingSeats} seats remaining`}
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Action Buttons Block (Lifecycle States) */}
      <div className="space-y-3 pt-2">
        {/* STATE 1: Before Applying (Open & Seats Available) */}
        {!applied && isOpen && remainingSeats > 0 && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onApply}
              disabled={applying}
              className="w-full py-3.5 px-4 bg-psu-navy hover:bg-psu-blue text-white font-bold text-base rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
            >
              {applying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Apply Now</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Authenticated via PSU Passport student credentials</span>
            </p>
          </div>
        )}

        {/* STATE 1B: Before Applying & Position Full (Capacity Reached) */}
        {!applied && isOpen && remainingSeats <= 0 && (
          <div className="space-y-2">
            <button
              type="button"
              disabled
              className="w-full py-3.5 px-4 bg-slate-400 dark:bg-slate-700 text-white font-bold text-base rounded-xl cursor-not-allowed shadow-none flex items-center justify-center gap-2 opacity-80 select-none"
            >
              <Lock className="w-5 h-5 text-slate-200 dark:text-slate-400" />
              <span>Position Full (Capacity Reached)</span>
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              All {required} seats for this position have been filled.
            </p>
          </div>
        )}

        {/* STATE 2: Applied & OPEN (Cancel Available) */}
        {applied && isOpen && (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
              <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                You have applied for this position
              </span>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                Status: {applicationStatus || 'Approved'}
              </p>
            </div>

            <button
              type="button"
              onClick={onCancelClick}
              disabled={applying}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-base rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Cancel Application</span>
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Registration is currently open. You may withdraw your application anytime.
            </p>
          </div>
        )}

        {/* STATE 3: Applied & CLOSED / IN_PROGRESS (Locked) */}
        {applied && !isOpen && jobStatus !== 'COMPLETED' && (
          <div className="space-y-3">
            <button
              type="button"
              disabled
              className="w-full py-3.5 px-4 bg-slate-500 text-white font-bold text-base rounded-xl cursor-not-allowed shadow-none flex items-center justify-center gap-2 opacity-90"
            >
              <Lock className="w-5 h-5 text-slate-300" />
              <span>Applied (Roster Finalized)</span>
            </button>

            <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-3.5 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>To withdraw, please contact staff directly:</span>
              </div>
              <p className="leading-relaxed">
                Registration is closed and shift assignments are locked. Reach out to Student Affairs:
              </p>
              <div className="pt-1 font-semibold text-psu-navy dark:text-psu-light flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-psu-navy dark:text-psu-blue" />
                  <span>Tel: 076-276000 ext. 6012-6014</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-psu-navy dark:text-psu-blue" />
                  <span>Email: student-affairs@phuket.psu.ac.th</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATE 4: Not Applied & Closed */}
        {!applied && !isOpen && (
          <div className="space-y-2">
            <button
              type="button"
              disabled
              className="w-full py-3.5 px-4 bg-slate-400 dark:bg-slate-700 text-white font-bold text-base rounded-xl cursor-not-allowed shadow-none flex items-center justify-center gap-2 opacity-75"
            >
              <Lock className="w-5 h-5" />
              <span>Registration Closed</span>
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Applications are no longer being accepted for this position.
            </p>
          </div>
        )}
      </div>

      {/* Official LINE Group Chat Card (Unlocked when applied or admin) */}
      {canSeePrivateDetails && lineGroupUrl && (
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl p-4 shadow-sm border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-4">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800 flex-shrink-0">
            <img src={lineIcon} alt="LINE Official" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex-grow space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
              Official Group
            </span>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Join Shift Group Chat
            </div>
            <a
              href={lineGroupUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Open in LINE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplyCard;
