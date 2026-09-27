import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Banknote, Calendar, MapPin, ArrowRight } from 'lucide-react';
import placeholder from '../assets/placeholder-image.jpg';

export interface JobCardProps {
  job: {
    id: number | string;
    title: string;
    image?: string | null;
    poster_image_url?: string | null;
    pay?: number | string;
    compensation_amount?: number | string;
    date?: string;
    location?: string;
    location_type?: string;
    isOpen?: boolean;
    status?: string;
    type?: string;
    job_type?: string;
    organization_name?: string;
    postedBy?: string;
  };
}

function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate();

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = placeholder;
  };

  const imageUrl = job.image || job.poster_image_url || placeholder;
  const pay = job.pay || job.compensation_amount || '0';
  const location = job.location || job.location_type || 'PSU Phuket';
  const isOpen = job.isOpen !== undefined ? job.isOpen : job.status === 'OPEN';
  const jobType = job.type || job.job_type || 'internal';
  const orgName = job.postedBy || job.organization_name || 'PSU Phuket Campus';

  return (
    <motion.article
      onClick={() => navigate(`/jobs/${job.id}`)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:border-slate-700/80 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        {/* Banner Image Preview */}
        <div className="relative h-44 w-full overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
          <img
            src={imageUrl}
            alt={job.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

          {/* Top Overlay Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm ${
                isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-500 text-white'
              }`}
            >
              {isOpen ? 'OPEN' : 'CLOSED'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-[10px] font-semibold border border-white/40 dark:border-slate-700 shadow-sm capitalize">
              {jobType}
            </span>
          </div>

          {/* Organization Attribution (Bottom of Image) */}
          <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
            <p className="text-[11px] text-white/95 font-medium truncate drop-shadow">
              {orgName}
            </p>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-3 leading-snug line-clamp-2 group-hover:text-psu-blue dark:group-hover:text-psu-light transition-colors">
            {job.title}
          </h3>

          <ul className="space-y-2 text-xs">
            {/* Compensation */}
            <li className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              <Banknote className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>฿{typeof pay === 'number' ? pay.toLocaleString() : pay}</span>
            </li>

            {/* Schedule / Date */}
            {job.date && (
              <li className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="truncate">{job.date}</span>
              </li>
            )}

            {/* Location */}
            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
              <span className="truncate">{location}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
          {jobType} role
        </span>
        {isOpen ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-psu-blue dark:text-psu-light group-hover:translate-x-0.5 transition-transform">
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            Closed
          </span>
        )}
      </div>
    </motion.article>
  );
}

export default JobCard;
