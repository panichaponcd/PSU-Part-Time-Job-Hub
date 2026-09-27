import { FC } from 'react';
import { Banknote, Calendar, MapPin, Clock, Users } from 'lucide-react';

interface JobQuickSpecsProps {
  pay: number | string | undefined;
  dates: string;
  location: string;
  hoursRange: string;
  applicants: number;
  required: number;
}

export const JobQuickSpecs: FC<JobQuickSpecsProps> = ({
  pay,
  dates,
  location,
  hoursRange,
  applicants,
  required,
}) => {
  const formatPay = (payVal: number | string | undefined) => {
    if (payVal === undefined || payVal === null) return '0';
    if (typeof payVal === 'number') return payVal.toLocaleString();
    const num = Number(payVal);
    return isNaN(num) ? payVal : num.toLocaleString();
  };

  return (
    <div className="bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-sm">
        {/* Pay Rate */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 dark:border-emerald-800/40">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              PAY RATE
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-base">
              ฿{formatPay(pay)}
            </span>
          </div>
        </div>

        {/* Working Dates */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-psu-blue dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100 dark:border-blue-800/40">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              DATES
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-base">
              {dates}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-100 dark:border-rose-800/40">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              LOCATION
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {location}
            </span>
          </div>
        </div>

        {/* Working Shift Time */}
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-100 dark:border-indigo-800/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              WORKING HOURS
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {hoursRange}
            </span>
          </div>
        </div>

        {/* Vacancies / Seats */}
        <div className="flex items-start gap-3.5 sm:col-span-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-100 dark:border-amber-800/40">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              CAPACITY & VACANCIES
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {applicants} / {required || 'Unlimited'} Seats Required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobQuickSpecs;
