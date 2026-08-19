import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      onClick={() => navigate(`/jobs/${job.id}`)}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white/70 backdrop-blur-md rounded-2xl shadow-md overflow-hidden cursor-pointer flex flex-col h-full"
    >
      <div className="h-44 bg-gray-200 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={job.title}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-gray-800 font-bold text-lg mb-3 line-clamp-2 group-hover:text-psu-blue">
          {job.title}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <p className="flex items-center gap-2">💵 <b>฿{pay}</b></p>
          {job.date && <p className="flex items-center gap-2">🗓️ {job.date}</p>}
          <p className="flex items-center gap-2 line-clamp-1">📍 {location}</p>
        </div>

        <div className="mt-auto">
          <span
            className={`text-[10px] font-black px-4 py-1.5 rounded-full ${
              isOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
            }`}
          >
            {isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default JobCard;
