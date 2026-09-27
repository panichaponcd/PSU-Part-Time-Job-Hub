import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export function JobManagementHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/60 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Job Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Create, edit, and organize job postings across campus divisions
        </p>
      </div>
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/jobs/new')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-psu-navy hover:bg-[#003c71] dark:bg-psu-blue dark:hover:bg-[#00527f] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>New Job Listing</span>
        </button>
      </div>
    </div>
  );
}

export default JobManagementHeader;
