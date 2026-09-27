import React, { ChangeEvent } from 'react';
import { Building2, MapPin } from 'lucide-react';

export interface JobBasicInfoSectionProps {
  title: string;
  organizationName: string;
  locationType: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function JobBasicInfoSection({
  title,
  organizationName,
  locationType,
  onChange,
}: JobBasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      {/* Job Title */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="jobTitle"
          className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none"
        >
          Job Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="jobTitle"
          name="title"
          type="text"
          value={title}
          onChange={onChange}
          required
          placeholder="e.g. Student Assistant - EDC Thailand 2026"
          className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Organization & Location (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Organization Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="orgName"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none"
          >
            Organization / Department <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Building2 className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="orgName"
              name="organization_name"
              type="text"
              value={organizationName}
              onChange={onChange}
              required
              placeholder="e.g. Division of Student Development"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Location / Room */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="locationType"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none"
          >
            Location / Room <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="locationType"
              name="location_type"
              type="text"
              value={locationType}
              onChange={onChange}
              required
              placeholder="e.g. Room 6302, College of Computing"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-psu-blue focus:ring-2 focus:ring-psu-blue/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobBasicInfoSection;
